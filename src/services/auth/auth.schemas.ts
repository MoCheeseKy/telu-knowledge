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

/**
 * ============================================================================
 * SKEMA FORM (Khusus validasi sisi client pada react-hook-form)
 * ============================================================================
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

export const loginFormSchema = z.object({
  email: teluEmailSchema,
  password: z
    .string({ message: "Password wajib diisi" })
    .min(1, "Password tidak boleh kosong"),
  rememberMe: z.boolean(),
});

export const forgotPasswordFormSchema = z.object({
  email: teluEmailSchema,
});

export type RegisterFormInput = z.infer<typeof registerFormSchema>;
export type ResetPasswordFormInput = z.infer<typeof resetPasswordFormSchema>;
export type LoginFormInput = z.infer<typeof loginFormSchema>;
export type ForgotPasswordFormInput = z.infer<typeof forgotPasswordFormSchema>;
