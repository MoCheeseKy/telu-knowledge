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
import { serverEnv } from "@/lib/env";
import type { BackendLoginData } from "@/services/auth/auth.types";

interface RouteContext {
  params: Promise<{
    path: string[];
  }>;
}

const SEGMENT_REGEX = /^[A-Za-z0-9_-]+$/;

async function handleProxy(request: Request, context: RouteContext) {
  // 1. Validasi Same-Origin untuk metode mutasi
  const originError = assertSameOrigin(request);
  if (originError) return originError;

  // 2. Validasi segmen path (hanya alfanumerik, dash, underscore, tanpa "..")
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

  // 3. Bangun target URL dengan aman dari API_BASE_URL (mencegah open redirect)
  const reqUrl = new URL(request.url);
  const targetUrl = `${serverEnv.API_BASE_URL}/api/${path.join("/")}${reqUrl.search}`;

  // 4. Baca body request jika bukan metode GET / HEAD (disimpan sebagai ArrayBuffer agar bisa diulang jika 401)
  let bodyBuffer: ArrayBuffer | undefined;
  if (request.method !== "GET" && request.method !== "HEAD") {
    try {
      bodyBuffer = await request.arrayBuffer();
    } catch {
      // Body kosong
    }
  }

  // 5. Baca token autentikasi dari cookie HttpOnly
  let accessToken = await getAccessToken();
  const refreshToken = await getRefreshToken();

  const clientIp = getClientIp(new Headers(request.headers));

  // Jika accessToken tidak ada tetapi refreshToken ada, lakukan refresh terlebih dahulu
  if (!accessToken && refreshToken) {
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

  // Helper untuk mengeksekusi request ke backend
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

    return fetch(targetUrl, {
      method: request.method,
      headers: forwardHeaders,
      body: bodyBuffer,
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
  };

  try {
    let backendResponse = await executeBackendFetch(accessToken);

    // Jika backend membalas 401 dan kita memiliki refreshToken, coba refresh SATU kali lalu ulangi request
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

        // Ulangi request backend satu kali dengan access token baru
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

    // Teruskan status dan body backend apa adanya
    const responseData = await backendResponse.arrayBuffer();
    const responseHeaders = new Headers();

    const respContentType = backendResponse.headers.get("content-type");
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

export async function GET(request: Request, context: RouteContext) {
  return handleProxy(request, context);
}

export async function POST(request: Request, context: RouteContext) {
  return handleProxy(request, context);
}

export async function PUT(request: Request, context: RouteContext) {
  return handleProxy(request, context);
}

export async function PATCH(request: Request, context: RouteContext) {
  return handleProxy(request, context);
}

export async function DELETE(request: Request, context: RouteContext) {
  return handleProxy(request, context);
}
