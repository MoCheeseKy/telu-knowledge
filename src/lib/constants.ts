/**
 * Domain email institusi yang diizinkan untuk pendaftaran akun.
 */
export const ALLOWED_EMAIL_DOMAIN = "@student.telkomuniversity.ac.id";

/**
 * Nama cookie HttpOnly untuk menyimpan access token JWT.
 */
export const AUTH_COOKIE_ACCESS = "tk_access";

/**
 * Nama cookie HttpOnly untuk menyimpan refresh token.
 */
export const AUTH_COOKIE_REFRESH = "tk_refresh";

/**
 * Nama cookie penanda status "Ingat saya".
 */
export const AUTH_COOKIE_REMEMBER = "tk_remember";

/**
 * Daftar rute halaman autentikasi yang dapat diakses tanpa sesi login.
 */
export const PUBLIC_AUTH_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/auth/callback",
] as const;
