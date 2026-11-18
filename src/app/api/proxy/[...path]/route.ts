import { NextResponse } from "next/server";
import { assertSameOrigin } from "@/lib/api/origin";
import { getClientIp, serverFetch } from "@/lib/api/server";
import { toApiError } from "@/lib/api/errors";
import {
  clearAuthCookies,
  getAccessToken,
  getRefreshToken,
  setAuthCookies,
} from "@/lib/auth/cookies";
import { PROXY_ALLOWED_AUTH_PATHS } from "@/lib/auth/paths";
import { serverEnv } from "@/lib/env";
import type { BackendLoginData } from "@/services/auth/auth.types";

/**
 * Konteks parameter dinamis untuk catch-all route proxy.
 */
interface RouteContext {
  params: Promise<{
    path: string[];
  }>;
}

const SEGMENT_REGEX = /^[A-Za-z0-9_-]+$/;

/**
 * Memeriksa secara rekursif apakah objek atau array mengandung key token sensitif.
 *
 * @param target - Nilai payload JSON yang akan diperiksa.
 * @returns `true` jika ditemukan key `access_token` atau `refresh_token`.
 */
function containsTokenKey(target: unknown): boolean {
  if (!target || typeof target !== "object") {
    return false;
  }
  if (Array.isArray(target)) {
    return target.some(containsTokenKey);
  }
  for (const [key, value] of Object.entries(target as Record<string, unknown>)) {
    if (key === "access_token" || key === "refresh_token") {
      return true;
    }
    if (value && typeof value === "object" && containsTokenKey(value)) {
      return true;
    }
  }
  return false;
}

/**
 * Menangani penerusan request dari klien ke backend API atau mock server secara aman.
 * Mengelola validasi path, auto-refresh token pada respons 401, dan pencegahan kebocoran token.
 *
 * @param request - Request HTTP masuk dari browser.
 * @param context - Konteks route yang berisi segmen path target.
 * @returns Respons hasil penerusan dari backend atau respons error terstandar.
 */
async function handleProxy(request: Request, context: RouteContext) {
  const originError = assertSameOrigin(request);
  if (originError) return originError;

  const { path } = await context.params;
  if (
    !Array.isArray(path) ||
    path.length === 0 ||
    path.some((seg) => !SEGMENT_REGEX.test(seg) || seg === "..")
  ) {
    return NextResponse.json(
      {
        statusCode: 400,
        message: ["Segmen path URL tidak valid."],
        isError: true,
        data: null,
      },
      { status: 400 }
    );
  }

  const firstSegment = path[0]?.toLowerCase();
  const joinedPath = path.join("/").toLowerCase();
  if (firstSegment === "auth" && !PROXY_ALLOWED_AUTH_PATHS.includes(joinedPath)) {
    return NextResponse.json(
      {
        statusCode: 404,
        message: ["Endpoint tidak ditemukan"],
        isError: true,
        data: null,
      },
      { status: 404 }
    );
  }

  const isMockSource = request.headers.get("x-data-source") === "mock";
  const baseUrl = isMockSource
    ? serverEnv.MOCK_API_BASE_URL
    : serverEnv.API_BASE_URL;

  const reqUrl = new URL(request.url);
  const targetUrl = `${baseUrl}/api/${path.join("/")}${reqUrl.search}`;

  // Simpan body sebagai ArrayBuffer agar tetap bisa dikirim ulang saat retry 401
  let bodyBuffer: ArrayBuffer | undefined;
  if (request.method !== "GET" && request.method !== "HEAD") {
    try {
      bodyBuffer = await request.arrayBuffer();
    } catch {
      // Body kosong
    }
  }

  let accessToken = await getAccessToken();
  const refreshToken = await getRefreshToken();

  const clientIp = getClientIp(new Headers(request.headers));

  // Hanya jalankan auto-refresh token untuk request backend asli
  if (!isMockSource && !accessToken && refreshToken) {
    try {
      const refreshRes = await serverFetch<BackendLoginData>("/auth/refresh", {
        method: "POST",
        body: { refresh_token: refreshToken },
        clientIp,
      });
      await setAuthCookies(refreshRes.data);
      accessToken = refreshRes.data.access_token;
    } catch {
      await clearAuthCookies();
      return NextResponse.json(
        {
          statusCode: 401,
          message: ["Sesi Anda telah kedaluwarsa. Silakan login kembali."],
          isError: true,
          data: null,
        },
        { status: 401 }
      );
    }
  }

  const executeBackendFetch = async (token?: string): Promise<Response> => {
    const forwardHeaders = new Headers();
    if (clientIp) forwardHeaders.set("X-Forwarded-For", clientIp);

    const contentType = request.headers.get("content-type");
    if (contentType) forwardHeaders.set("Content-Type", contentType);

    const accept = request.headers.get("accept");
    if (accept) forwardHeaders.set("Accept", accept);

    if (token) {
      forwardHeaders.set("Authorization", `Bearer ${token}`);
    }

    const isAiPath = path[0]?.toLowerCase() === "ai";
    const timeoutMs = isAiPath ? 25000 : 10000;

    return fetch(targetUrl, {
      method: request.method,
      headers: forwardHeaders,
      body: bodyBuffer,
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs),
    });
  };

  try {
    let backendResponse = await executeBackendFetch(accessToken);

    if (backendResponse.status === 401 && refreshToken) {
      try {
        const refreshRes = await serverFetch<BackendLoginData>(
          "/auth/refresh",
          {
            method: "POST",
            body: { refresh_token: refreshToken },
            clientIp,
          }
        );
        await setAuthCookies(refreshRes.data);
        accessToken = refreshRes.data.access_token;

        backendResponse = await executeBackendFetch(accessToken);
      } catch {
        await clearAuthCookies();
        return NextResponse.json(
          {
            statusCode: 401,
            message: ["Sesi Anda telah kedaluwarsa. Silakan login kembali."],
            isError: true,
            data: null,
          },
          { status: 401 }
        );
      }
    }

    if (backendResponse.status === 401) {
      await clearAuthCookies();
    }

    const responseData = await backendResponse.arrayBuffer();

    // Cegah kebocoran token ke browser dengan memblokir payload JSON (maks. 1 MB) yang mengandung key token
    const respContentType = backendResponse.headers.get("content-type");
    const isJson = respContentType?.toLowerCase().includes("application/json");
    const MAX_PARSE_SIZE = 1024 * 1024;

    if (isJson && responseData.byteLength <= MAX_PARSE_SIZE) {
      try {
        const text = new TextDecoder().decode(responseData);
        const parsed = JSON.parse(text);
        if (
          parsed &&
          typeof parsed === "object" &&
          "data" in parsed &&
          containsTokenKey(parsed.data)
        ) {
          console.warn(
            "[SECURITY] Generic proxy memblokir respons backend karena mendeteksi token bocor pada payload data."
          );
          return NextResponse.json(
            {
              statusCode: 502,
              message: ["Layanan tidak dapat memproses respons saat ini."],
              isError: true,
              data: null,
            },
            { status: 502 }
          );
        }
      } catch {
        // Abaikan parse error, teruskan respons asli
      }
    }

    const responseHeaders = new Headers();
    if (respContentType) {
      responseHeaders.set("Content-Type", respContentType);
    }

    return new NextResponse(responseData, {
      status: backendResponse.status,
      headers: responseHeaders,
    });
  } catch (error) {
    const apiErr = toApiError(error);
    return NextResponse.json(
      {
        statusCode: apiErr.statusCode,
        message: apiErr.messages,
        isError: true,
        data: null,
      },
      { status: apiErr.statusCode }
    );
  }
}

/**
 * Route handler BFF proxy untuk metode GET.
 *
 * @param request - Request HTTP masuk.
 * @param context - Konteks parameter route dinamis.
 * @returns Respons dari backend atau mock API.
 */
export async function GET(request: Request, context: RouteContext) {
  return handleProxy(request, context);
}

/**
 * Route handler BFF proxy untuk metode POST.
 *
 * @param request - Request HTTP masuk.
 * @param context - Konteks parameter route dinamis.
 * @returns Respons dari backend atau mock API.
 */
export async function POST(request: Request, context: RouteContext) {
  return handleProxy(request, context);
}

/**
 * Route handler BFF proxy untuk metode PUT.
 *
 * @param request - Request HTTP masuk.
 * @param context - Konteks parameter route dinamis.
 * @returns Respons dari backend atau mock API.
 */
export async function PUT(request: Request, context: RouteContext) {
  return handleProxy(request, context);
}

/**
 * Route handler BFF proxy untuk metode PATCH.
 *
 * @param request - Request HTTP masuk.
 * @param context - Konteks parameter route dinamis.
 * @returns Respons dari backend atau mock API.
 */
export async function PATCH(request: Request, context: RouteContext) {
  return handleProxy(request, context);
}

/**
 * Route handler BFF proxy untuk metode DELETE.
 *
 * @param request - Request HTTP masuk.
 * @param context - Konteks parameter route dinamis.
 * @returns Respons dari backend atau mock API.
 */
export async function DELETE(request: Request, context: RouteContext) {
  return handleProxy(request, context);
}
