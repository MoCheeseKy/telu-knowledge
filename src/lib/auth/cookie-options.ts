/**
 * Opsi standar cookie autentikasi (`tk_access`, `tk_refresh`, `tk_remember`).
 * Modul murni tanpa `server-only` dan `next/headers` agar aman dipakai di `proxy.ts` dan `cookies.ts`.
 */
export interface AuthCookieOptions {
  httpOnly: boolean;
  sameSite: "lax";
  path: string;
  secure: boolean;
  maxAge?: number;
}

const isProduction = process.env.NODE_ENV === "production";

/** Durasi standar access token: 1 jam (3600 detik) jika tidak ada dari backend */
export const DEFAULT_ACCESS_MAX_AGE = 3600;

/** Durasi refresh token & remember cookie jika rememberMe aktif: 30 hari (dalam detik) */
export const REMEMBER_MAX_AGE = 30 * 24 * 60 * 60;

/**
 * Menghasilkan opsi cookie untuk access token (`tk_access`).
 *
 * @param expiresIn - Masa berlaku token dalam detik (opsional).
 * @returns Objek opsi cookie untuk access token.
 */
export function getAccessCookieOptions(expiresIn?: number): AuthCookieOptions {
  return {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: isProduction,
    maxAge: expiresIn && expiresIn > 0 ? expiresIn : DEFAULT_ACCESS_MAX_AGE,
  };
}

/**
 * Menghasilkan opsi cookie untuk refresh token (`tk_refresh`).
 * Jika `rememberMe` bernilai true, `maxAge` diatur 30 hari (sliding);
 * jika false/undefined, menjadi session cookie (`maxAge` undefined).
 *
 * @param rememberMe - Status opsi "Ingat saya".
 * @returns Objek opsi cookie untuk refresh token.
 */
export function getRefreshCookieOptions(rememberMe?: boolean): AuthCookieOptions {
  const options: AuthCookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: isProduction,
  };

  if (rememberMe) {
    options.maxAge = REMEMBER_MAX_AGE;
  }

  return options;
}

/**
 * Menghasilkan opsi cookie untuk penanda remember me (`tk_remember`).
 * Selalu berdurasi 30 hari, `httpOnly`, dan `sameSite` lax.
 *
 * @returns Objek opsi cookie untuk penanda remember me.
 */
export function getRememberCookieOptions(): AuthCookieOptions {
  return {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: isProduction,
    maxAge: REMEMBER_MAX_AGE,
  };
}

/**
 * Menghasilkan opsi dasar untuk penghapusan cookie autentikasi.
 *
 * @returns Objek opsi cookie dengan `maxAge: 0`.
 */
export function getClearCookieOptions(): AuthCookieOptions {
  return {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: isProduction,
    maxAge: 0,
  };
}
