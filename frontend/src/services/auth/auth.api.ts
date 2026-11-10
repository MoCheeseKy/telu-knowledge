import { apiFetch } from "@/lib/api/client";
import type { ApiEnvelope } from "@/lib/api/types";
import type {
  AuthUserResponseData,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  RegisterResponseData,
  ResendVerificationPayload,
  ResetPasswordPayload,
} from "./auth.types";

/**
 * Layanan API Autentikasi sisi Client.
 * Seluruh pemanggilan diarahkan ke Next.js BFF (/api/auth/...) sehingga token
 * tidak pernah beredar di JavaScript browser dan tersimpan aman di cookie HttpOnly.
 */
export const authApi = {
  /**
   * Login user dan simpan access_token serta refresh_token ke HttpOnly cookie via BFF.
   */
  async login(payload: LoginPayload): Promise<ApiEnvelope<AuthUserResponseData>> {
    return apiFetch<AuthUserResponseData>("/auth/login", {
      method: "POST",
      body: payload,
    });
  },

  /**
   * Registrasi akun mahasiswa baru (domain @student.telkomuniversity.ac.id).
   */
  async register(
    payload: RegisterPayload
  ): Promise<ApiEnvelope<RegisterResponseData>> {
    return apiFetch<RegisterResponseData>("/auth/register", {
      method: "POST",
      body: payload,
    });
  },

  /**
   * Mengakhiri sesi login dan menghapus cookie autentikasi.
   */
  async logout(): Promise<ApiEnvelope<null>> {
    return apiFetch<null>("/auth/logout", {
      method: "POST",
    });
  },

  /**
   * Memperbarui sesi menggunakan refresh_token dari cookie HttpOnly.
   */
  async refresh(): Promise<ApiEnvelope<AuthUserResponseData>> {
    return apiFetch<AuthUserResponseData>("/auth/refresh", {
      method: "POST",
    });
  },

  /**
   * Mengambil data profil user yang sedang login saat ini via Proxy BFF.
   */
  async me(): Promise<ApiEnvelope<AuthUserResponseData>> {
    return apiFetch<AuthUserResponseData>("/proxy/auth/me", {
      method: "GET",
    });
  },

  /**
   * Meminta tautan reset kata sandi ke email SSO mahasiswa.
   */
  async forgotPassword(
    payload: ForgotPasswordPayload
  ): Promise<ApiEnvelope<null>> {
    return apiFetch<null>("/auth/forgot-password", {
      method: "POST",
      body: payload,
    });
  },

  /**
   * Mengirim ulang tautan konfirmasi email pendaftaran.
   */
  async resendVerification(
    payload: ResendVerificationPayload
  ): Promise<ApiEnvelope<null>> {
    return apiFetch<null>("/auth/resend-verification", {
      method: "POST",
      body: payload,
    });
  },

  /**
   * Menyimpan kata sandi baru menggunakan recovery token.
   */
  async resetPassword(
    payload: ResetPasswordPayload
  ): Promise<ApiEnvelope<null>> {
    return apiFetch<null>("/auth/reset-password", {
      method: "POST",
      body: payload,
    });
  },
};
