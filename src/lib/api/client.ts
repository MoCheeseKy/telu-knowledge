import { toApiError } from "./errors";
import { parseApiResponse } from "./parse-response";
import type { ApiEnvelope } from "./types";

export type DataSource = "backend" | "mock";

export interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /**
   * Target sumber data:
   * - "backend" (default): diteruskan ke server backend NestJS asli.
   * - "mock": dialihkan ke mock server (json-server).
   */
  source?: DataSource;
}

/**
 * Fetcher sisi client (Browser -> Next.js Route Handler / BFF).
 * Selalu memanggil endpoint same-origin (/api/...) dengan credentials: "same-origin".
 */
export async function apiFetch<T>(
  path: string,
  init: ApiFetchOptions = {}
): Promise<ApiEnvelope<T>> {
  const normalizedPath = path.startsWith("/api")
    ? path.replace(/^\/api/, "")
    : path.startsWith("/")
    ? path
    : `/${path}`;

  const url = `/api${normalizedPath}`;

  const requestHeaders = new Headers(init.headers);
  requestHeaders.set("Accept", "application/json");

  // Jika opsi source disetel ke 'mock', sertakan header penanda untuk Next.js proxy
  if (init.source === "mock") {
    requestHeaders.set("x-data-source", "mock");
  }

  let requestBody: BodyInit | undefined;
  if (init.body !== undefined) {
    if (
      typeof init.body === "string" ||
      init.body instanceof FormData ||
      init.body instanceof Blob ||
      init.body instanceof ArrayBuffer
    ) {
      requestBody = init.body;
    } else {
      if (!requestHeaders.has("Content-Type")) {
        requestHeaders.set("Content-Type", "application/json");
      }
      requestBody = JSON.stringify(init.body);
    }
  }

  try {
    const response = await fetch(url, {
      ...init,
      headers: requestHeaders,
      body: requestBody,
      credentials: "same-origin",
    });

    return await parseApiResponse<T>(response);
  } catch (error) {
    throw toApiError(error);
  }
}
