import { PUBLIC_AUTH_PATHS } from "@/lib/constants";

/**
 * Daftar path publik yang dapat diakses tanpa autentikasi.
 * Dapat diperluas untuk halaman baca artikel publik di masa mendatang.
 */
export const PUBLIC_PATHS: readonly string[] = [
  ...PUBLIC_AUTH_PATHS,
  // Dapat ditambahkan path publik lain di sini bila diperlukan
];

/**
 * Path backend di bawah segmen auth yang diizinkan untuk diakses melalui generic proxy.
 * Seluruh endpoint auth lainnya wajib melalui BFF route handler khusus (/api/auth/*)
 * guna menjamin token HttpOnly tidak bocor ke browser.
 */
export const PROXY_ALLOWED_AUTH_PATHS: readonly string[] = ["auth/me"];

/**
 * Memeriksa apakah path saat ini merupakan path publik.
 */
export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((publicPath) => pathname === publicPath || pathname.startsWith(`${publicPath}/`));
}

/**
 * Memvalidasi dan memastikan parameter redirect `next` aman.
 * Hanya mengizinkan path relatif yang diawali "/" dan menolak open-redirect (seperti "//domain.com" atau "/\\").
 */
export function safeNextPath(
  nextPath?: string | null,
  fallback = "/home"
): string {
  if (!nextPath || typeof nextPath !== "string") {
    return fallback;
  }

  const trimmed = nextPath.trim();

  // Wajib diawali '/' dan BUKAN '//' atau '/\'
  if (
    trimmed.startsWith("/") &&
    !trimmed.startsWith("//") &&
    !trimmed.startsWith("/\\")
  ) {
    return trimmed;
  }

  return fallback;
}
