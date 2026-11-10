"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormAlert from "@/components/_shared/FormAlert";
import FieldError from "@/components/_shared/FieldError";
import { useCooldown } from "@/hooks/use-cooldown";
import { useForgotPassword } from "@/services/auth/auth.queries";
import {
  forgotPasswordFormSchema,
  type ForgotPasswordFormInput,
} from "@/services/auth/auth.schemas";
import { getErrorMessages } from "@/lib/api/error-messages";

export default function ForgotPasswordView() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [resendSuccessMessage, setResendSuccessMessage] = useState<string | null>(
    null
  );

  const forgotMutation = useForgotPassword();
  const cooldown = useCooldown(60);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormInput>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormInput) => {
    setResendSuccessMessage(null);
    forgotMutation.mutate(data, {
      onSuccess: () => {
        setSubmittedEmail(data.email);
        cooldown.start(60);
      },
    });
  };

  const handleResend = () => {
    if (!submittedEmail) return;

    setResendSuccessMessage(null);
    forgotMutation.mutate(
      { email: submittedEmail },
      {
        onSuccess: (res) => {
          setResendSuccessMessage(
            res.message || "Tautan pemulihan kata sandi telah dikirim ulang."
          );
          cooldown.start(60);
        },
      }
    );
  };

  const isPending = forgotMutation.isPending;

  return (
    <div className="w-full flex flex-col justify-center">
      {/* Judul & Deskripsi Halaman */}
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--primary-text)] tracking-tight">
          Lupa Password
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
          Masukkan email SSO Telkom University Anda. Kami akan mengirimkan
          tautan untuk mengatur ulang kata sandi.
        </p>
      </div>

      {submittedEmail ? (
        <div className="p-6 rounded-xl border border-[var(--dust)] bg-[var(--background-accent)]/50 text-center space-y-4 animate-in fade-in-50 duration-300">
          <div className="w-12 h-12 rounded-full bg-[var(--primary-soft)] text-[var(--primary-text)] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div>
            <h3 className="font-semibold text-base text-[var(--foreground)]">
              Tautan Terkirim
            </h3>
            <p className="text-xs sm:text-sm text-[var(--muted)] mt-1 leading-relaxed">
              Jika email <strong>{submittedEmail}</strong> terdaftar, tautan
              pemulihan telah dikirimkan. Silakan periksa inbox atau spam email
              Anda.
            </p>
          </div>

          {resendSuccessMessage && (
            <FormAlert variant="success" messages={resendSuccessMessage} />
          )}

          {forgotMutation.error && (
            <FormAlert
              variant="error"
              messages={getErrorMessages(forgotMutation.error)}
            />
          )}

          <Button
            type="button"
            variant="outline"
            disabled={isPending || cooldown.isCooling}
            onClick={handleResend}
            className="w-full text-xs sm:text-sm border-[var(--dust)] hover:bg-[var(--background-accent)]"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Mengirim Ulang...
              </>
            ) : cooldown.isCooling ? (
              `Kirim Ulang Email (${cooldown.remaining}s)`
            ) : (
              "Kirim Ulang Email"
            )}
          </Button>
        </div>
      ) : (
        /* Form Lupa Password */
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {forgotMutation.error && (
            <FormAlert
              variant="error"
              messages={getErrorMessages(forgotMutation.error)}
            />
          )}

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
              Gunakan email berdomain @student.telkomuniversity.ac.id
            </p>
            <FieldError message={errors.email?.message} />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            variant="destructive"
            className="w-full h-11 sm:h-12 font-semibold text-sm sm:text-base shadow-xs mt-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Mengirim Tautan...
              </>
            ) : (
              "Kirim Tautan Pemulihan"
            )}
          </Button>
        </form>
      )}

      {/* Navigasi Kembali ke Login */}
      <div className="mt-8 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary-text)] hover:underline underline-offset-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke halaman Login</span>
        </Link>
      </div>
    </div>
  );
}
