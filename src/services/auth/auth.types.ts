import type { components } from "@/lib/api/schema";

/**
 * Data pengguna terautentikasi yang diturunkan dari OpenAPI `schema.d.ts`.
 */
export type AuthUser = components["schemas"]["AuthUserDto"];

/**
 * Data respons login mentah dari backend (OpenAPI `schema.d.ts`).
 */
export type BackendLoginData = components["schemas"]["LoginDataDto"];

/**
 * Payload form/API untuk login pengguna.
 */
export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Payload form/API untuk registrasi akun mahasiswa baru.
 */
export interface RegisterPayload {
  email: string;
  password: string;
}

/**
 * Payload permintaan pengiriman ulang email verifikasi akun.
 */
export interface ResendVerificationPayload {
  email: string;
}

/**
 * Payload permintaan pengiriman tautan reset kata sandi.
 */
export interface ForgotPasswordPayload {
  email: string;
}

/**
 * Payload penyimpanan kata sandi baru menggunakan token pemulihan.
 */
export interface ResetPasswordPayload {
  password: string;
  token: string;
}

/**
 * Respons data dari BFF ke browser (tanpa token).
 */
export interface AuthUserResponseData {
  user: AuthUser;
}

/**
 * Respons data saat registrasi (user bisa null jika email sudah terdaftar / pencegahan enumerasi).
 */
export interface RegisterResponseData {
  user: AuthUser | null;
}
