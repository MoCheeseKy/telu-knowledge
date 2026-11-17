/**
 * Penanganan dan Representasi Error untuk API & BFF Tel-U Knowledge.
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

    // Pastikan rawResponse tidak pernah ikut terserialisasi secara otomatis (enumerable: false)
    Object.defineProperty(this, "rawResponse", {
      value: rawResponse,
      writable: false,
      enumerable: false,
      configurable: true,
    });

    Object.setPrototypeOf(this, ApiError.prototype);
  }

  override get message(): string {
    return this.messages.join(", ");
  }

  /**
   * Representasi JSON aman yang tidak pernah membocorkan rawResponse ke browser.
   */
  toJSON(): { name: string; statusCode: number; message: string; messages: string[] } {
    return {
      name: this.name,
      statusCode: this.statusCode,
      message: this.message,
      messages: this.messages,
    };
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
 * Mengonversi segala jenis error (network, abort/timeout, error tak terduga) menjadi ApiError standar.
 * Untuk error internal tak terduga, tidak membocorkan error.message asli ke client,
 * dan hanya mencatat log detail di sisi server (tanpa mengekspos token/rahasia).
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

  // Network offline / koneksi backend gagal
  if (error instanceof TypeError && error.message.toLowerCase().includes("fetch")) {
    return new ApiError(
      502,
      "Layanan tidak dapat dihubungi, coba lagi nanti.",
      error
    );
  }

  // Error tak terduga: catat log HANYA di server, kembalikan pesan generik aman
  if (typeof window === "undefined") {
    // Di sisi server: log detail error internal untuk debugging developer
    console.error(
      "[ApiError Internal Server Error]:",
      error instanceof Error ? error.stack || error.message : error
    );
  }

  return new ApiError(
    500,
    "Terjadi kesalahan internal pada sistem.",
    error
  );
}
