/**
 * Definisi tipe data domain Autentikasi Tel-U Knowledge
 */

export interface AuthUser {
  id: string;
  email: string;
  created_at?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterPayload {
  email: string;
  password: string;
}

export interface ResendVerificationPayload {
  email: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  password: string;
  token: string;
}

/**
 * Respons data dari BFF login / me / refresh ke browser (tanpa token).
 */
export interface AuthUserResponseData {
  user: AuthUser;
}

/**
 * Respons data dari backend saat registrasi (tidak mengembalikan token).
 */
export interface RegisterResponseData {
  user: AuthUser | null;
}

/**
 * Respons data internal dari backend NestJS saat login/refresh (hanya ada di server Next.js).
 */
export interface BackendLoginData {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: AuthUser;
}
