import { z } from "zod";
import { ALLOWED_EMAIL_DOMAIN } from "@/lib/constants";

/**
 * Validasi email mahasiswa Telkom University
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

export const passwordSchema = z
  .string({ message: "Password wajib diisi" })
  .min(8, "Password minimal 8 karakter");

export const loginSchema = z.object({
  email: teluEmailSchema,
  password: z
    .string({ message: "Password wajib diisi" })
    .min(1, "Password tidak boleh kosong"),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  email: teluEmailSchema,
  password: passwordSchema,
});

export const resendVerificationSchema = z.object({
  email: teluEmailSchema,
});

export const forgotPasswordSchema = z.object({
  email: teluEmailSchema,
});

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  token: z
    .string({ message: "Token pemulihan tidak valid" })
    .min(1, "Token tidak boleh kosong"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
