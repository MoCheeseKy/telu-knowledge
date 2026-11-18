import "server-only";

import { cookies } from "next/headers";
import {
  AUTH_COOKIE_ACCESS,
  AUTH_COOKIE_REFRESH,
  AUTH_COOKIE_REMEMBER,
} from "@/lib/constants";
import {
  getAccessCookieOptions,
  getRefreshCookieOptions,
  getRememberCookieOptions,
} from "./cookie-options";

/**
 * Pasangan token autentikasi yang disimpan pada HttpOnly cookie.
 */
export interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

/**
 * Membaca `access_token` dan `refresh_token` dari HttpOnly cookie.
 *
 * @returns Objek {@link AuthTokens} berisi token yang tersedia.
 */
export async function getAuthTokens(): Promise<AuthTokens> {
  const cookieStore = await cookies();
  return {
    accessToken: cookieStore.get(AUTH_COOKIE_ACCESS)?.value,
    refreshToken: cookieStore.get(AUTH_COOKIE_REFRESH)?.value,
  };
}

/**
 * Membaca `access_token` dari HttpOnly cookie.
 *
 * @returns String access token atau `undefined` jika tidak ada.
 */
export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_ACCESS)?.value;
}

/**
 * Membaca `refresh_token` dari HttpOnly cookie.
 *
 * @returns String refresh token atau `undefined` jika tidak ada.
 */
export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_REFRESH)?.value;
}

/**
 * Menyimpan token autentikasi ke dalam cookie HttpOnly.
 * - `access_token` memiliki masa berlaku sesuai `expires_in` dari backend (default 3600 detik).
 * - `refresh_token` memiliki `maxAge` 30 hari jika `rememberMe` aktif, atau session cookie jika tidak.
 * - Jika `rememberMe` undefined, status remember ditentukan dari keberadaan cookie `tk_remember` (rotasi sliding).
 *
 * @param tokens - Pasangan `access_token`, `refresh_token`, dan opsional `expires_in`.
 * @param rememberMe - Flag opsi "Ingat saya" (opsional).
 */
export async function setAuthCookies(
  tokens: {
    access_token: string;
    refresh_token: string;
    expires_in?: number;
  },
  rememberMe?: boolean
): Promise<void> {
  const cookieStore = await cookies();

  const isRemember =
    rememberMe !== undefined
      ? rememberMe
      : Boolean(cookieStore.get(AUTH_COOKIE_REMEMBER)?.value);

  cookieStore.set(
    AUTH_COOKIE_ACCESS,
    tokens.access_token,
    getAccessCookieOptions(tokens.expires_in)
  );

  cookieStore.set(
    AUTH_COOKIE_REFRESH,
    tokens.refresh_token,
    getRefreshCookieOptions(isRemember)
  );

  if (isRemember) {
    // Sliding: perpanjang masa berlaku tk_remember ke 30 hari
    cookieStore.set(
      AUTH_COOKIE_REMEMBER,
      "1",
      getRememberCookieOptions()
    );
  } else {
    cookieStore.delete({
      name: AUTH_COOKIE_REMEMBER,
      path: "/",
    });
  }
}

/**
 * Menghapus seluruh cookie autentikasi (logout / invalidasi sesi).
 */
export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete({ name: AUTH_COOKIE_ACCESS, path: "/" });
  cookieStore.delete({ name: AUTH_COOKIE_REFRESH, path: "/" });
  cookieStore.delete({ name: AUTH_COOKIE_REMEMBER, path: "/" });
}
