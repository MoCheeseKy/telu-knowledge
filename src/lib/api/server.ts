import "server-only";

import { serverEnv } from "@/lib/env";
import { toApiError } from "./errors";
import { parseApiResponse } from "./parse-response";
import type { ApiEnvelope } from "./types";

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

    return await parseApiResponse<T>(response);
  } catch (error) {
    throw toApiError(error);
  }
}
