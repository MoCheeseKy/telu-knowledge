import { z } from "zod";
import { ALLOWED_EMAIL_DOMAIN } from "@/lib/constants";

/**
 * Skema validasi email mahasiswa Telkom University.
 */
export const teluEmailSchema = z
  .string({ message: "Email wajib diisi" })
  .trim()
  .toLowerCase()
  .email("Format email tidak valid")
  .refine(
    (email) => email.endsWith(ALLOWED_EMAIL_DOMAIN),
    `Email harus menggunakan domain ${ALLOWED_EMAIL_DOMAIN}`
  );

/**
 * Skema validasi kata sandi minimal 8 karakter.
 */
export const passwordSchema = z
  .string({ message: "Password wajib diisi" })
  .min(8, "Password minimal 8 karakter");

/**
 * Skema validasi payload API untuk login pengguna.
 */
export const loginSchema = z.object({
  email: teluEmailSchema,
  password: z
    .string({ message: "Password wajib diisi" })
    .min(1, "Password tidak boleh kosong"),
  rememberMe: z.boolean().optional(),
});

/**
 * Skema validasi payload API untuk pendaftaran akun baru.
 */
export const registerSchema = z.object({
  email: teluEmailSchema,
  password: passwordSchema,
});

/**
 * Skema validasi payload API untuk pengiriman ulang email verifikasi.
 */
export const resendVerificationSchema = z.object({
  email: teluEmailSchema,
});

/**
 * Skema validasi payload API untuk permintaan reset kata sandi.
 */
export const forgotPasswordSchema = z.object({
  email: teluEmailSchema,
});

/**
 * Skema validasi payload API untuk penyimpanan kata sandi baru dengan token pemulihan.
 */
export const resetPasswordSchema = z.object({
  password: passwordSchema,
  token: z
    .string({ message: "Token pemulihan tidak valid" })
    .min(1, "Token tidak boleh kosong"),
});

/**
 * Tipe input hasil inferensi dari `loginSchema`.
 */
export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Tipe input hasil inferensi dari `registerSchema`.
 */
export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Tipe input hasil inferensi dari `resendVerificationSchema`.
 */
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;

/**
 * Tipe input hasil inferensi dari `forgotPasswordSchema`.
 */
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

/**
 * Tipe input hasil inferensi dari `resetPasswordSchema`.
 */
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

/**
 * Skema validasi form registrasi sisi client termasuk konfirmasi kata sandi dan persetujuan layanan.
 */
export const registerFormSchema = z
  .object({
    email: teluEmailSchema,
    password: passwordSchema,
    confirmPassword: z
      .string({ message: "Konfirmasi password wajib diisi" })
      .min(1, "Konfirmasi password tidak boleh kosong"),
    agreed: z.boolean().refine((val) => val === true, {
      message: "Anda harus menyetujui Ketentuan Layanan dan Kebijakan Privasi",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

/**
 * Skema validasi form reset kata sandi sisi client termasuk konfirmasi kecocokan kata sandi.
 */
export const resetPasswordFormSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z
      .string({ message: "Konfirmasi password wajib diisi" })
      .min(1, "Konfirmasi password tidak boleh kosong"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

/**
 * Skema validasi form login sisi client untuk `react-hook-form`.
 */
export const loginFormSchema = z.object({
  email: teluEmailSchema,
  password: z
    .string({ message: "Password wajib diisi" })
    .min(1, "Password tidak boleh kosong"),
  rememberMe: z.boolean(),
});

/**
 * Skema validasi form lupa kata sandi sisi client untuk `react-hook-form`.
 */
export const forgotPasswordFormSchema = z.object({
  email: teluEmailSchema,
});

/**
 * Tipe input hasil inferensi dari `registerFormSchema`.
 */
export type RegisterFormInput = z.infer<typeof registerFormSchema>;

/**
 * Tipe input hasil inferensi dari `resetPasswordFormSchema`.
 */
export type ResetPasswordFormInput = z.infer<typeof resetPasswordFormSchema>;

/**
 * Tipe input hasil inferensi dari `loginFormSchema`.
 */
export type LoginFormInput = z.infer<typeof loginFormSchema>;

/**
 * Tipe input hasil inferensi dari `forgotPasswordFormSchema`.
 */
export type ForgotPasswordFormInput = z.infer<typeof forgotPasswordFormSchema>;
