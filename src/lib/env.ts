import "server-only";

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
  get MOCK_API_BASE_URL(): string {
    const val = process.env.MOCK_API_BASE_URL?.trim();
    return val && val !== "" ? val.replace(/\/+$/, "") : "http://localhost:4000";
  },
  get APP_ORIGIN(): string {
    return getRequiredServerEnv("APP_ORIGIN");
  },
  /** Header IP tepercaya dari reverse proxy (misal: "x-real-ip", "cf-connecting-ip") */
  get TRUSTED_IP_HEADER(): string | undefined {
    const val = process.env.TRUSTED_IP_HEADER?.trim();
    return val && val !== "" ? val.toLowerCase() : undefined;
  },
  /** Jumlah hop proxy tepercaya pada X-Forwarded-For (dihitung dari kanan, default: 0) */
  get TRUSTED_PROXY_HOPS(): number {
    const raw = process.env.TRUSTED_PROXY_HOPS?.trim();
    if (!raw) return 0;
    const parsed = parseInt(raw, 10);
    return isNaN(parsed) || parsed < 0 ? 0 : parsed;
  },
};
