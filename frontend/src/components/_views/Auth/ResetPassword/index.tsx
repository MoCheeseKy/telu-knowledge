"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormAlert from "@/components/_shared/FormAlert";
import FieldError from "@/components/_shared/FieldError";
import {
  resetPasswordFormSchema,
  type ResetPasswordFormInput,
} from "@/services/auth/auth.schemas";
import { useResetPassword } from "@/services/auth/auth.queries";
import { getErrorMessages } from "@/lib/api/error-messages";

type ViewStatus = "checking" | "ready" | "invalid" | "success";

export default function ResetPasswordView() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState<ViewStatus>("checking");
  const [serverErrors, setServerErrors] = useState<string[]>([]);

  const [token, setToken] = useState<string | null>(null);
  const parsedRef = React.useRef(false);

  const resetPasswordMutation = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormInput>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (parsedRef.current) return;
    parsedRef.current = true;

    const rawHash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : window.location.hash;

    // Bersihkan hash dari URL segera apa pun kondisinya untuk mencegah kebocoran token
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }

    queueMicrotask(() => {
      if (!rawHash) {
        setStatus("invalid");
        return;
      }

      const params = new URLSearchParams(rawHash);
      const error = params.get("error") || params.get("error_code");
      const type = params.get("type");
      const accessToken = params.get("access_token");

      if (error || type !== "recovery" || !accessToken) {
        setStatus("invalid");
        return;
      }

      setToken(accessToken);
      setStatus("ready");
    });
  }, []);

  const onSubmit = async (data: ResetPasswordFormInput) => {
    if (!token) {
      setServerErrors([
        "Token pemulihan tidak ditemukan atau telah kedaluwarsa. Silakan minta tautan baru.",
      ]);
      return;
    }

    setServerErrors([]);

    try {
      await resetPasswordMutation.mutateAsync({
        password: data.password,
        token,
      });

      // Token dibuang segera dari memori setelah berhasil
      setToken(null);
      setStatus("success");
    } catch (error) {
      const messages = getErrorMessages(error);
      setServerErrors(messages);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center">
      {/* Judul & Deskripsi Halaman */}
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--primary-text)] tracking-tight">
          Reset Password
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
          Buat kata sandi baru yang aman untuk akun Tel-U Knowledge Anda.
        </p>
      </div>

      {status === "checking" && (
        <div className="p-8 rounded-xl border border-[var(--dust)] bg-[var(--background-accent)]/50 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--primary-text)]" />
          <p className="text-sm text-[var(--muted)]">
            Memeriksa tautan pemulihan...
          </p>
        </div>
      )}

      {status === "invalid" && (
        <div className="p-6 rounded-xl border border-[var(--failed)]/30 bg-[var(--background-accent)]/50 text-center space-y-4 animate-in fade-in-50 duration-300">
          <div className="w-12 h-12 rounded-full bg-[var(--failed)]/10 text-[var(--failed)] flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-base text-[var(--foreground)]">
              Tautan Tidak Valid atau Kedaluwarsa
            </h3>
            <p className="text-xs sm:text-sm text-[var(--muted)] mt-1">
              Tautan pemulihan kata sandi tidak valid atau telah kedaluwarsa. Silakan ajukan permintaan baru untuk mengatur ulang kata sandi Anda.
            </p>
          </div>
          <Link href="/forgot-password" className="block w-full">
            <Button
              type="button"
              variant="destructive"
              className="w-full h-11 font-semibold rounded-lg text-sm"
            >
              Minta Tautan Baru
            </Button>
          </Link>
          <div className="pt-2">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-medium text-[var(--muted)] hover:text-[var(--primary-text)] transition-colors"
            >
              Kembali ke Login
            </Link>
          </div>
        </div>
      )}

      {status === "success" && (
        <div className="p-6 rounded-xl border border-[var(--dust)] bg-[var(--background-accent)]/50 text-center space-y-4 animate-in fade-in-50 duration-300">
          <div className="w-12 h-12 rounded-full bg-[var(--primary-soft)] text-[var(--primary-text)] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-base text-[var(--foreground)]">
              Kata Sandi Berhasil Diperbarui
            </h3>
            <p className="text-xs sm:text-sm text-[var(--muted)] mt-1">
              Kata sandi Anda telah berhasil diubah. Silakan masuk kembali dengan
              kata sandi baru Anda.
            </p>
          </div>
          <Link href="/login" className="block w-full">
            <Button
              type="button"
              variant="destructive"
              className="w-full h-11 font-semibold rounded-lg text-sm"
            >
              Masuk Sekarang
            </Button>
          </Link>
        </div>
      )}

      {status === "ready" && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {serverErrors.length > 0 && (
            <FormAlert variant="error" messages={serverErrors}>
              <Link
                href="/forgot-password"
                className="inline-block mt-1 text-xs underline font-medium hover:opacity-80"
              >
                Minta tautan pemulihan baru
              </Link>
            </FormAlert>
          )}

          {/* Password Baru */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[var(--foreground)]"
            >
              Password Baru <span className="text-[var(--primary-text)]">*</span>
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

          {/* Konfirmasi Password Baru */}
          <div className="space-y-1.5">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-[var(--foreground)]"
            >
              Konfirmasi Password Baru{" "}
              <span className="text-[var(--primary-text)]">*</span>
            </label>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Ulangi password baru"
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

          {/* Tombol Simpan */}
          <Button
            type="submit"
            disabled={resetPasswordMutation.isPending}
            variant="destructive"
            className="w-full h-11 sm:h-12 font-semibold rounded-lg text-sm sm:text-base shadow-xs transition-colors mt-2"
          >
            {resetPasswordMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Menyimpan...
              </>
            ) : (
              "Simpan Password Baru"
            )}
          </Button>

          {/* Navigasi Kembali ke Login */}
          <div className="mt-8 text-center">
            <p className="text-sm text-[var(--muted)]">
              Ingat kata sandi Anda?{" "}
              <Link
                href="/login"
                className="font-semibold text-[var(--primary-text)] hover:underline underline-offset-4"
              >
                Kembali ke Login
              </Link>
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
