"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    // Slicing phase: siap diintegrasikan dengan AuthService backend
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

      {isSuccess ? (
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
              className="w-full h-11 bg-[#B42318] hover:bg-[#991B1B] text-white font-semibold rounded-lg text-sm"
            >
              Masuk Sekarang
            </Button>
          </Link>
        </div>
      ) : (
        /* Form Reset Password */
        <form onSubmit={handleSubmit} className="space-y-4">
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              required
              minLength={8}
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
            />
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password baru"
              required
              minLength={8}
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
            />
          </div>

          {/* Tombol Simpan */}
          <Button
            type="submit"
            className="w-full h-11 sm:h-12 bg-[#B42318] hover:bg-[#991B1B] text-white font-semibold rounded-lg text-sm sm:text-base shadow-xs transition-colors mt-2"
          >
            Simpan Password Baru
          </Button>
        </form>
      )}

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
    </div>
  );
}
