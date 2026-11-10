import "server-only";

import { isIP } from "node:net";
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
  /**
   * Target sumber data:
   * - "backend" (default): diarahkan ke API_BASE_URL backend NestJS.
   * - "mock": diarahkan ke MOCK_API_BASE_URL (json-server).
   */
  source?: "backend" | "mock";
}

let hasWarnedMissingTrustedIp = false;

/**
 * Membaca IP client dari headers request dengan verifikasi proxy tepercaya.
 * - Default AMAN: Jika tidak ada konfigurasi TRUSTED_IP_HEADER atau TRUSTED_PROXY_HOPS,
 *   JANGAN meneruskan IP dari header apa pun (mengembalikan undefined).
 * - TRUSTED_IP_HEADER: Jika diisi, membaca IP HANYA dari header tersebut dan divalidasi.
 * - TRUSTED_PROXY_HOPS (N > 0): Jika TRUSTED_IP_HEADER kosong, membaca entri ke-N dari KANAN
 *   pada X-Forwarded-For dan divalidasi format IP-nya.
 */
export function getClientIp(headers: Headers): string | undefined {
  if (
    process.env.NODE_ENV === "production" &&
    !serverEnv.TRUSTED_IP_HEADER &&
    serverEnv.TRUSTED_PROXY_HOPS === 0 &&
    !hasWarnedMissingTrustedIp
  ) {
    hasWarnedMissingTrustedIp = true;
    console.warn(
      "[SECURITY WARNING] TRUSTED_IP_HEADER atau TRUSTED_PROXY_HOPS belum dikonfigurasi di lingkungan produksi. Header IP klien tidak diteruskan ke backend, sehingga seluruh pengguna akan berbagi satu bucket rate limit backend."
    );
  }

  const trustedHeader = serverEnv.TRUSTED_IP_HEADER;
  if (trustedHeader) {
    const rawValue = headers.get(trustedHeader);
    if (!rawValue) return undefined;
    const candidate = rawValue.split(",")[0]?.trim();
    if (candidate && isIP(candidate) !== 0) {
      return candidate;
    }
    return undefined;
  }

  const hops = serverEnv.TRUSTED_PROXY_HOPS;
  if (hops > 0) {
    const forwardedFor = headers.get("x-forwarded-for");
    if (!forwardedFor) return undefined;

    const entries = forwardedFor
      .split(",")
      .map((ip) => ip.trim())
      .filter(Boolean);

    // Ambil entri ke-N dari KANAN: index = entries.length - hops
    const index = entries.length - hops;
    if (index >= 0 && index < entries.length) {
      const candidate = entries[index];
      if (candidate && isIP(candidate) !== 0) {
        return candidate;
      }
    }
    return undefined;
  }

  // Default aman: jangan percayai header client apa pun
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

  const baseUrl =
    options.source === "mock"
      ? serverEnv.MOCK_API_BASE_URL
      : serverEnv.API_BASE_URL;

  const url = `${baseUrl}/api${normalizedPath}`;

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
