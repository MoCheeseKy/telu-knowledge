"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import FormAlert from "@/components/_shared/FormAlert";
import FieldError from "@/components/_shared/FieldError";
import { useCooldown } from "@/hooks/use-cooldown";
import { useLogin, useResendVerification } from "@/services/auth/auth.queries";
import {
  loginFormSchema,
  type LoginFormInput,
} from "@/services/auth/auth.schemas";
import { safeNextPath } from "@/lib/auth/paths";
import {
  getErrorMessages,
  isEmailNotVerifiedError,
} from "@/lib/api/error-messages";

export default function LoginView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawNext = searchParams.get("next");
  const target = safeNextPath(rawNext, "/home");

  const [showPassword, setShowPassword] = useState(false);
  const [resendSuccessMessage, setResendSuccessMessage] = useState<string | null>(
    null
  );

  const loginMutation = useLogin();
  const resendMutation = useResendVerification();
  const cooldown = useCooldown(60);

  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<LoginFormInput>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = (data: LoginFormInput) => {
    setResendSuccessMessage(null);
    loginMutation.mutate(data, {
      onSuccess: () => {
        router.replace(target);
        router.refresh();
      },
    });
  };

  const isPending = loginMutation.isPending;
  const isUnverified = isEmailNotVerifiedError(loginMutation.error);

  const handleResend = () => {
    const emailVal = getValues("email");
    if (!emailVal) return;

    resendMutation.mutate(
      { email: emailVal },
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

  return (
    <div className="w-full flex flex-col justify-center">
      {/* Judul Halaman */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--primary-text)] tracking-tight">
          Login
        </h1>
      </div>

      {/* Alert Notifikasi / Error */}
      <div className="space-y-3 mb-6">
        {resendSuccessMessage && (
          <FormAlert variant="success" messages={resendSuccessMessage} />
        )}

        {resendMutation.error && (
          <FormAlert
            variant="error"
            messages={getErrorMessages(resendMutation.error)}
          />
        )}

        {loginMutation.error && (
          <FormAlert
            variant="error"
            messages={getErrorMessages(loginMutation.error)}
          >
            {isUnverified && (
              <div className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={resendMutation.isPending || cooldown.isCooling}
                  onClick={handleResend}
                  className="text-xs h-8 bg-white border-[var(--failed)] text-[var(--failed-text)] hover:bg-[var(--failed-soft)]"
                >
                  {resendMutation.isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                      Mengirim...
                    </>
                  ) : cooldown.isCooling ? (
                    `Kirim ulang (${cooldown.remaining}s)`
                  ) : (
                    "Kirim ulang email verifikasi"
                  )}
                </Button>
              </div>
            )}
          </FormAlert>
        )}
      </div>

      {/* Form Login */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
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
            autoComplete="current-password"
            placeholder="Password"
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

        {/* Remember me & Lupa Password */}
        <div className="flex items-center justify-between pt-1">
          <Controller
            control={control}
            name="rememberMe"
            render={({ field }) => (
              <Checkbox
                id="remember-me"
                label="Remember me"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            )}
          />
          <Link
            href="/forgot-password"
            className="text-xs sm:text-sm font-medium text-[var(--muted)] hover:text-[var(--primary-text)] transition-colors"
          >
            Lupa Password?
          </Link>
        </div>

        {/* Tombol Sign In */}
        <Button
          type="submit"
          disabled={isPending}
          variant="destructive"
          className="w-full h-11 sm:h-12 font-semibold text-sm sm:text-base shadow-xs mt-2"
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Masuk...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      {/* Navigasi ke Halaman Register */}
      <div className="mt-8 text-center">
        <p className="text-sm text-[var(--muted)]">
          Belum memiliki akun?{" "}
          <Link
            href="/register"
            className="font-semibold text-[var(--primary-text)] hover:underline underline-offset-4"
          >
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
