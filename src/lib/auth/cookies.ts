import "server-only";

import { cookies } from "next/headers";
import { AUTH_COOKIE_ACCESS, AUTH_COOKIE_REFRESH } from "@/lib/constants";

const isProduction = process.env.NODE_ENV === "production";

export interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

/**
 * Membaca access_token dan refresh_token dari HttpOnly cookie.
 */
export async function getAuthTokens(): Promise<AuthTokens> {
  const cookieStore = await cookies();
  return {
    accessToken: cookieStore.get(AUTH_COOKIE_ACCESS)?.value,
    refreshToken: cookieStore.get(AUTH_COOKIE_REFRESH)?.value,
  };
}

/**
 * Membaca access_token dari HttpOnly cookie.
 */
export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_ACCESS)?.value;
}

/**
 * Membaca refresh_token dari HttpOnly cookie.
 */
export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_REFRESH)?.value;
}

/**
 * Menyimpan token autentikasi ke dalam cookie HttpOnly.
 * - access_token memiliki masa berlaku sesuai expires_in dari backend (default 3600 detik).
 * - refresh_token memiliki maxAge 30 hari jika rememberMe aktif, atau session cookie jika tidak.
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
  const accessMaxAge =
    tokens.expires_in && tokens.expires_in > 0 ? tokens.expires_in : 3600;

  // Set access token cookie
  cookieStore.set(AUTH_COOKIE_ACCESS, tokens.access_token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: isProduction,
    maxAge: accessMaxAge,
  });

  // Set refresh token cookie
  const refreshCookieOptions: {
    httpOnly: boolean;
    sameSite: "lax";
    path: string;
    secure: boolean;
    maxAge?: number;
  } = {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: isProduction,
  };

  if (rememberMe) {
    refreshCookieOptions.maxAge = 30 * 24 * 60 * 60; // 30 hari dalam detik
  }

  cookieStore.set(
    AUTH_COOKIE_REFRESH,
    tokens.refresh_token,
    refreshCookieOptions
  );
}

/**
 * Menghapus seluruh cookie autentikasi (logout / invalidasi sesi).
 */
export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_ACCESS);
  cookieStore.delete(AUTH_COOKIE_REFRESH);
}
