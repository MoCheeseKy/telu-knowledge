"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, User, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormAlert from "@/components/_shared/FormAlert";
import FieldError from "@/components/_shared/FieldError";
import { useCooldown } from "@/hooks/use-cooldown";
import { useResendVerification } from "@/services/auth/auth.queries";
import { teluEmailSchema } from "@/services/auth/auth.schemas";
import { getErrorMessages } from "@/lib/api/error-messages";

type CallbackStatus =
  | "loading"
  | "success"
  | "error"
  | "pkce_unsupported"
  | "no_info";

export default function CallbackView() {
  const [status, setStatus] = useState<CallbackStatus>("loading");
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [resendSuccessMessage, setResendSuccessMessage] = useState<string | null>(
    null
  );

  const parsedRef = React.useRef(false);

  const resendMutation = useResendVerification();
  const cooldown = useCooldown(60);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (parsedRef.current) return;
    parsedRef.current = true;

    const hashStr = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : window.location.hash;
    const hashParams = new URLSearchParams(hashStr);

    const searchParams = new URLSearchParams(window.location.search);
    const hasPkceCode = searchParams.has("code");

    // Clear hash dan query dari URL biar aman
    if (window.location.hash || window.location.search) {
      window.history.replaceState(null, "", window.location.pathname);
    }

    queueMicrotask(() => {
      const hasError =
        hashParams.has("error") ||
        hashParams.has("error_code") ||
        searchParams.has("error");

      if (hasError) {
        setStatus("error");
        return;
      }

      if (hasPkceCode) {
        setStatus("pkce_unsupported");
        return;
      }

      const type = hashParams.get("type");
      const hasAccessToken = Boolean(hashParams.get("access_token"));
      const isSignupOrEmail = type === "signup" || type === "email";

      if (isSignupOrEmail && hasAccessToken) {
        setStatus("success");
      } else {
        setStatus("no_info");
      }
    });
  }, []);

  const handleResend = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setResendSuccessMessage(null);

    const parsed = teluEmailSchema.safeParse(emailInput);
    if (!parsed.success) {
      setEmailError(
        parsed.error.issues[0]?.message || "Format email tidak valid"
      );
      return;
    }

    resendMutation.mutate(
      { email: parsed.data },
      {
        onSuccess: (res) => {
          setResendSuccessMessage(
            res.message || "Tautan verifikasi baru telah dikirimkan ke email Anda."
          );
          cooldown.start(60);
        },
      }
    );
  };

  if (status === "loading") {
    return (
      <div className="w-full flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary-text)]" />
        <p className="mt-4 text-sm text-[var(--muted)]">
          Memproses tautan verifikasi...
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="w-full flex flex-col justify-center animate-in fade-in-50 duration-300">
        <div className="p-6 sm:p-8 rounded-xl border border-[var(--dust)] bg-white text-center space-y-5 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-[var(--success-soft)] text-[var(--success-text)] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div>
            <h2 className="font-bold text-2xl text-[var(--foreground)] tracking-tight">
              Email Berhasil Diverifikasi
            </h2>
            <p className="text-sm text-[var(--muted)] mt-2 leading-relaxed">
              Akun SSO Telkom University Anda telah aktif. Silakan masuk untuk
              mulai mengakses artikel, forum diskusi, dan fitur Tel-U Knowledge.
            </p>
          </div>

          <Link href="/login" className="block w-full pt-2">
            <Button
              type="button"
              variant="destructive"
              className="w-full h-11 text-sm font-semibold shadow-xs"
            >
              Masuk Sekarang
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // State error atau PKCE code
  return (
    <div className="w-full flex flex-col justify-center animate-in fade-in-50 duration-300">
      <div className="p-6 sm:p-8 rounded-xl border border-[var(--dust)] bg-white space-y-5 shadow-xs">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-[var(--failed-soft)] text-[var(--failed-text)] flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <h2 className="font-bold text-2xl text-[var(--foreground)] tracking-tight">
            {status === "no_info"
              ? "Tautan Tidak Valid"
              : "Tautan Tidak Valid atau Kedaluwarsa"}
          </h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            {status === "no_info"
              ? "Tautan tidak valid. Buka tautan verifikasi dari email Anda."
              : status === "pkce_unsupported"
                ? "Tautan verifikasi menggunakan format kode otorisasi (PKCE) yang belum didukung secara langsung. Silakan minta tautan baru."
                : "Tautan verifikasi yang Anda buka sudah tidak berlaku atau telah kedaluwarsa. Masukkan email Anda di bawah ini untuk meminta tautan verifikasi baru."}
          </p>
        </div>

        {resendSuccessMessage && (
          <FormAlert variant="success" messages={resendSuccessMessage} />
        )}

        {resendMutation.error && (
          <FormAlert
            variant="error"
            messages={getErrorMessages(resendMutation.error)}
          />
        )}

        {/* ReVerification */}
        <form onSubmit={handleResend} className="space-y-4 pt-1" noValidate>
          <div className="space-y-1.5">
            <label
              htmlFor="callback-email"
              className="block text-sm font-medium text-[var(--foreground)]"
            >
              Email SSO Tel-U <span className="text-[var(--primary-text)]">*</span>
            </label>
            <Input
              id="callback-email"
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="nama@student.telkomuniversity.ac.id"
              aria-invalid={Boolean(emailError)}
              leftIcon={<User className="w-5 h-5 text-[var(--muted)]" />}
              className="h-11 text-sm bg-white"
            />
            <FieldError message={emailError || undefined} />
          </div>

          <Button
            type="submit"
            disabled={resendMutation.isPending || cooldown.isCooling}
            variant="destructive"
            className="w-full h-11 text-sm font-semibold shadow-xs"
          >
            {resendMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Mengirim Ulang...
              </>
            ) : cooldown.isCooling ? (
              `Kirim Ulang (${cooldown.remaining}s)`
            ) : (
              "Kirim Ulang Email Verifikasi"
            )}
          </Button>
        </form>

        <div className="pt-2 text-center">
          <Link
            href="/login"
            className="text-sm font-semibold text-[var(--primary-text)] hover:underline"
          >
            Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
}
