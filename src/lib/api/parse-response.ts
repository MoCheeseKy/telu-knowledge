import { ApiError } from "./errors";
import type { ApiEnvelope, ApiErrorEnvelope } from "./types";

/**
 * Helper bersama untuk mem-parse Response fetch menjadi ApiEnvelope<T>.
 * Aman digunakan baik di sisi Browser (client.ts) maupun Server (server.ts).
 */
export async function parseApiResponse<T>(
  response: Response
): Promise<ApiEnvelope<T>> {
  // Respons sukses HTTP 2xx
  if (response.ok) {
    if (response.status === 204) {
      return {
        statusCode: 204,
        message: "No Content",
        isError: false,
        data: null as T,
      };
    }

    try {
      const json = (await response.json()) as ApiEnvelope<T>;
      return json;
    } catch {
      throw new ApiError(
        response.status,
        "Respons dari server tidak berformat JSON yang valid."
      );
    }
  }

  // Respons error HTTP 4xx / 5xx
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
    "Terjadi kesalahan saat memproses permintaan pada server.",
    errorBody
  );
}
