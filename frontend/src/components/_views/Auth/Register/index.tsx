"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Lock, Eye, EyeOff, Loader2, MailCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import FormAlert from "@/components/_shared/FormAlert";
import FieldError from "@/components/_shared/FieldError";
import { useCooldown } from "@/hooks/use-cooldown";
import { useRegister, useResendVerification } from "@/services/auth/auth.queries";
import {
  registerFormSchema,
  type RegisterFormInput,
} from "@/services/auth/auth.schemas";
import { getErrorMessages } from "@/lib/api/error-messages";

export default function RegisterView() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [resendSuccessMessage, setResendSuccessMessage] = useState<string | null>(
    null
  );

  const registerMutation = useRegister();
  const resendMutation = useResendVerification();
  const cooldown = useCooldown(60);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormInput>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      agreed: false,
    },
  });

  const onSubmit = (data: RegisterFormInput) => {
    registerMutation.mutate(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          setRegisteredEmail(data.email);
        },
      }
    );
  };

  const handleResend = () => {
    if (!registeredEmail) return;

    resendMutation.mutate(
      { email: registeredEmail },
      {
        onSuccess: (res) => {
          setResendSuccessMessage(
            res.message || "Tautan verifikasi telah dikirim ulang ke email Anda."
          );
          cooldown.start(60);
        },
      }
    );
  };

  const isPending = registerMutation.isPending;

  // State sukses: Ganti tampilan dengan instruksi cek email
  if (registeredEmail) {
    return (
      <div className="w-full flex flex-col justify-center animate-in fade-in-50 duration-300">
        <div className="p-6 sm:p-8 rounded-xl border border-[var(--dust)] bg-white text-center space-y-5 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-[var(--primary-soft)] text-[var(--primary-text)] flex items-center justify-center mx-auto">
            <MailCheck className="w-7 h-7" />
          </div>

          <div>
            <h2 className="font-bold text-2xl text-[var(--foreground)] tracking-tight">
              Cek Email Anda
            </h2>
            <p className="text-sm text-[var(--muted)] mt-2 leading-relaxed">
              Kami telah mengirimkan tautan verifikasi akun ke{" "}
              <strong className="text-[var(--foreground)] font-semibold">
                {registeredEmail}
              </strong>
              . Silakan buka email Anda untuk mengaktifkan akun sebelum login.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {resendSuccessMessage && (
              <FormAlert variant="success" messages={resendSuccessMessage} />
            )}

            {resendMutation.error && (
              <FormAlert
                variant="error"
                messages={getErrorMessages(resendMutation.error)}
              />
            )}

            <Button
              type="button"
              variant="outline"
              disabled={resendMutation.isPending || cooldown.isCooling}
              onClick={handleResend}
              className="w-full h-11 text-sm border-[var(--dust)] hover:bg-[var(--background-accent)]"
            >
              {resendMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Mengirim Ulang...
                </>
              ) : cooldown.isCooling ? (
                `Kirim ulang email (${cooldown.remaining}s)`
              ) : (
                "Kirim ulang email verifikasi"
              )}
            </Button>

            <Link href="/login" className="block w-full">
              <Button
                type="button"
                variant="destructive"
                className="w-full h-11 text-sm font-semibold shadow-xs"
              >
                Kembali ke Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col justify-center">
      {/* Judul & Deskripsi Halaman */}
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--primary-text)] tracking-tight">
          Register
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Daftarkan akun Anda dengan email SSO Telkom University.
        </p>
      </div>

      {/* Alert Error Server */}
      {registerMutation.error && (
        <div className="mb-5">
          <FormAlert
            variant="error"
            messages={getErrorMessages(registerMutation.error)}
          />
        </div>
      )}

      {/* Form Register */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Email SSO */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[var(--foreground)]"
          >
            Email SSO <span className="text-[var(--primary-text)]">*</span>
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="nama@student.telkomuniversity.ac.id"
            aria-invalid={Boolean(errors.email)}
            leftIcon={<User className="w-5 h-5 text-[var(--muted)]" />}
            className="h-11 text-sm bg-white"
            {...register("email")}
          />
          <p className="text-xs text-[var(--muted)]">
            Hanya domain @student.telkomuniversity.ac.id
          </p>
          <FieldError message={errors.email?.message} />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[var(--foreground)]"
          >
            Password <span className="text-[var(--primary-text)]">*</span>
          </label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Minimal 8 karakter"
            aria-invalid={Boolean(errors.password)}
            leftIcon={<Lock className="w-5 h-5 text-[var(--muted)]" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors p-1"
                aria-label={
                  showPassword
                    ? "Sembunyikan password"
                    : "Tampilkan password"
                }
              >
                {showPassword ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            }
            className="h-11 text-sm bg-white"
            {...register("password")}
          />
          <FieldError message={errors.password?.message} />
        </div>

        {/* Konfirmasi Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-[var(--foreground)]"
          >
            Konfirmasi Password{" "}
            <span className="text-[var(--primary-text)]">*</span>
          </label>
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Ulangi password"
            aria-invalid={Boolean(errors.confirmPassword)}
            leftIcon={<Lock className="w-5 h-5 text-[var(--muted)]" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors p-1"
                aria-label={
                  showConfirmPassword
                    ? "Sembunyikan konfirmasi password"
                    : "Tampilkan konfirmasi password"
                }
              >
                {showConfirmPassword ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            }
            className="h-11 text-sm bg-white"
            {...register("confirmPassword")}
          />
          <FieldError message={errors.confirmPassword?.message} />
        </div>

        {/* Persetujuan Ketentuan */}
        <div className="pt-1 space-y-1">
          <Controller
            control={control}
            name="agreed"
            render={({ field }) => (
              <Checkbox
                id="terms"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                label={
                  <span className="text-xs sm:text-sm text-[var(--muted)]">
                    Saya menyetujui{" "}
                    <span className="text-[var(--primary-text)] font-medium">
                      Ketentuan Layanan
                    </span>{" "}
                    dan{" "}
                    <span className="text-[var(--primary-text)] font-medium">
                      Kebijakan Privasi
                    </span>
                  </span>
                }
              />
            )}
          />
          <FieldError message={errors.agreed?.message} />
        </div>

        {/* Tombol Register */}
        <Button
          type="submit"
          disabled={isPending}
          variant="destructive"
          className="w-full h-11 sm:h-12 font-semibold text-sm sm:text-base shadow-xs mt-2"
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Mendaftarkan Akun...
            </>
          ) : (
            "Daftar Akun"
          )}
        </Button>
      </form>

      {/* Navigasi ke Halaman Login */}
      <div className="mt-8 text-center">
        <p className="text-sm text-[var(--muted)]">
          Sudah memiliki akun?{" "}
          <Link
            href="/login"
            className="font-semibold text-[var(--primary-text)] hover:underline underline-offset-4"
          >
            Masuk sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
