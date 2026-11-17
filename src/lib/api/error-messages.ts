import { isApiError } from "./errors";

/**
 * Mengambil daftar pesan error dari berbagai bentuk error (ApiError, Error, unknown).
 * Selalu mengembalikan array string yang siap ditampilkan ke user dalam Bahasa Indonesia.
 *
 * @param error - Objek error yang ditangkap.
 * @returns Array pesan error untuk ditampilkan ke pengguna.
 */
export function getErrorMessages(error: unknown): string[] {
  if (isApiError(error)) {
    return error.messages.length > 0
      ? error.messages
      : ["Terjadi kesalahan pada sistem. Silakan coba beberapa saat lagi."];
  }

  if (error instanceof Error && error.message) {
    return [error.message];
  }

  return [
    "Terjadi kesalahan yang tidak terduga. Silakan coba beberapa saat lagi.",
  ];
}

/**
 * Mengambil pesan error tunggal yang sudah digabung menjadi satu string siap tampil
 * (misal untuk Toast notifikasi atau inline status), dengan dukungan fallback kontekstual.
 *
 * @param error - Objek error yang ditangkap.
 * @param fallback - Pesan cadangan bila error tidak memiliki pesan yang dapat dibaca.
 * @returns String pesan error tunggal.
 */
export function getErrorMessage(error: unknown, fallback?: string): string {
  if (isApiError(error) && error.messages.length > 0) {
    return error.messages.join(", ");
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return (
    fallback ||
    "Terjadi kesalahan yang tidak terduga. Silakan coba beberapa saat lagi."
  );
}

/**
 * Memeriksa apakah error merupakan kegagalan autentikasi akibat email belum diverifikasi.
 * Mengembalikan true jika statusCode 401 dan pesan mengandung kata "belum diverifikasi".
 *
 * @param error - Objek error yang ditangkap.
 * @returns `true` jika error menandakan email belum diverifikasi.
 */
export function isEmailNotVerifiedError(error: unknown): boolean {
  if (!isApiError(error)) {
    return false;
  }

  if (error.statusCode !== 401) {
    return false;
  }

  return error.messages.some((msg) =>
    msg.toLowerCase().includes("belum diverifikasi")
  );
}
