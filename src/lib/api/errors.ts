/**
 * Penanganan dan Representasi Error Terpadu untuk API & BFF Tel-U Knowledge.
 */

export class ApiError extends Error {
  readonly statusCode: number;
  readonly messages: string[];
  readonly rawResponse?: unknown;

  constructor(
    statusCode: number,
    messageOrMessages: string | string[],
    rawResponse?: unknown
  ) {
    const normalizedMessages = Array.isArray(messageOrMessages)
      ? messageOrMessages.filter((msg): msg is string => typeof msg === "string" && msg.trim() !== "")
      : [messageOrMessages];

    const safeMessages =
      normalizedMessages.length > 0
        ? normalizedMessages
        : ["Terjadi kesalahan pada server."];

    super(safeMessages.join(", "));
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.messages = safeMessages;
    this.rawResponse = rawResponse;

    Object.setPrototypeOf(this, ApiError.prototype);
  }

  override get message(): string {
    return this.messages.join(", ");
  }
}

/**
 * Type guard untuk memeriksa apakah error merupakan instance ApiError.
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    error instanceof ApiError ||
    (typeof error === "object" &&
      error !== null &&
      "name" in error &&
      (error as { name: unknown }).name === "ApiError" &&
      "statusCode" in error &&
      typeof (error as { statusCode: unknown }).statusCode === "number" &&
      "messages" in error &&
      Array.isArray((error as { messages: unknown }).messages))
  );
}

/**
 * Mengonversi segala jenis error (network, abort/timeout, non-JSON) menjadi ApiError standar.
 */
export function toApiError(error: unknown): ApiError {
  if (isApiError(error)) {
    return error;
  }

  // Timeout atau abort
  if (
    (error instanceof DOMException && error.name === "AbortError") ||
    (error instanceof Error && error.name === "TimeoutError")
  ) {
    return new ApiError(
      504,
      "Permintaan ke server melebihi batas waktu (timeout). Silakan coba beberapa saat lagi.",
      error
    );
  }

  // Network offline / koneksi gagal
  if (error instanceof TypeError && error.message.toLowerCase().includes("fetch")) {
    return new ApiError(
      502,
      "Layanan tidak dapat dihubungi, coba lagi nanti.",
      error
    );
  }

  if (error instanceof Error) {
    return new ApiError(
      500,
      error.message && error.message.trim() !== ""
        ? error.message
        : "Terjadi kesalahan internal pada sistem.",
      error
    );
  }

  return new ApiError(500, "Terjadi kesalahan yang tidak terduga.", error);
}
