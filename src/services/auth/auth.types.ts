import type { components } from "@/lib/api/schema";

/**
 * Tipe data backend yang diturunkan langsung dari OpenAPI schema.d.ts
 * sebagai satu-satunya sumber kebenaran (Single Source of Truth).
 */
export type AuthUser = components["schemas"]["AuthUserDto"];
export type BackendLoginData = components["schemas"]["LoginDataDto"];

/**
 * Tipe payload form (ditulis manual sesuai kebutuhan form/input client).
 */
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
