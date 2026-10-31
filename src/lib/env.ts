/**
 * Modul pembaca dan validator environment variables sisi server.
 * Menjamin variabel wajib terisi dan memberikan pesan kesalahan yang jelas.
 */

function getRequiredServerEnv(key: string): string {
  const value = process.env[key];
  if (!value || value.trim() === "") {
    throw new Error(
      `[ENV ERROR] Variabel lingkungan "${key}" wajib diatur di sisi server. Pastikan file .env telah dikonfigurasi dengan benar.`
    );
  }
  return value.trim().replace(/\/+$/, "");
}

export const serverEnv = {
  get API_BASE_URL(): string {
    return getRequiredServerEnv("API_BASE_URL");
  },
  get APP_ORIGIN(): string {
    return getRequiredServerEnv("APP_ORIGIN");
  },
};
