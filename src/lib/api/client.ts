import { ApiError, toApiError } from "./errors";
import type { ApiEnvelope, ApiErrorEnvelope } from "./types";

export interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
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

    if (response.ok) {
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

    let errorBody: ApiErrorEnvelope | null = null;
    try {
      errorBody = (await response.json()) as ApiErrorEnvelope;
    } catch {
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
      "Terjadi kesalahan saat memproses permintaan.",
      errorBody
    );
  } catch (error) {
    throw toApiError(error);
  }
}
