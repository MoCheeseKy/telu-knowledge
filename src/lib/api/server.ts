import { serverEnv } from "@/lib/env";
import { ApiError, toApiError } from "./errors";
import type { ApiEnvelope, ApiErrorEnvelope } from "./types";

export interface ServerFetchOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
  headers?: HeadersInit;
  clientIp?: string;
}

/**
 * Membaca IP client dari headers request dengan fallback aman.
 * Jika terdapat daftar IP pada X-Forwarded-For, mengambil IP pertama (client asli).
 */
export function getClientIp(headers: Headers): string | undefined {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }
  const realIp = headers.get("x-real-ip");
  if (realIp && realIp.trim()) {
    return realIp.trim();
  }
  return undefined;
}

/**
 * Fetcher sisi server (BFF -> Backend NestJS).
 * Menggunakan URL dasar dari API_BASE_URL, timeout 10 detik, dan cache: no-store.
 */
export async function serverFetch<T>(
  path: string,
  options: ServerFetchOptions = {}
): Promise<ApiEnvelope<T>> {
  const normalizedPath = path.startsWith("/api")
    ? path.replace(/^\/api/, "")
    : path.startsWith("/")
    ? path
    : `/${path}`;

  const url = `${serverEnv.API_BASE_URL}/api${normalizedPath}`;

  const requestHeaders = new Headers(options.headers);
  requestHeaders.set("Accept", "application/json");

  if (options.token) {
    requestHeaders.set("Authorization", `Bearer ${options.token}`);
  }

  if (options.clientIp) {
    requestHeaders.set("X-Forwarded-For", options.clientIp);
  }

  let requestBody: BodyInit | undefined;
  if (options.body !== undefined) {
    if (
      typeof options.body === "string" ||
      options.body instanceof FormData ||
      options.body instanceof Blob ||
      options.body instanceof ArrayBuffer
    ) {
      requestBody = options.body;
    } else {
      requestHeaders.set("Content-Type", "application/json");
      requestBody = JSON.stringify(options.body);
    }
  }

  try {
    const response = await fetch(url, {
      method: options.method ?? "GET",
      headers: requestHeaders,
      body: requestBody,
      cache: "no-store",
      signal: AbortSignal.timeout(10000), // Timeout 10 detik
    });

    // Respons sukses (HTTP 2xx)
    if (response.ok) {
      // Jika status HTTP 204 No Content
      if (response.status === 204) {
        return {
          statusCode: 204,
          message: "No Content",
          isError: false,
          data: null as T,
        };
      }

      const json = (await response.json()) as ApiEnvelope<T>;
      return json;
    }

    // Respons error dari backend (HTTP 4xx / 5xx)
    let errorBody: ApiErrorEnvelope | null = null;
    try {
      errorBody = (await response.json()) as ApiErrorEnvelope;
    } catch {
      // Non-JSON response (misal HTML 502/504 dari reverse proxy)
      throw new ApiError(
        response.status,
        response.status >= 500
          ? "Layanan tidak dapat dihubungi, coba lagi nanti."
          : `Permintaan gagal dengan status ${response.status}.`
      );
    }

    if (errorBody && errorBody.isError) {
      throw new ApiError(
        errorBody.statusCode || response.status,
        errorBody.message,
        errorBody
      );
    }

    throw new ApiError(
      response.status,
      "Terjadi kesalahan saat memproses permintaan pada server.",
      errorBody
    );
  } catch (error) {
    throw toApiError(error);
  }
}
