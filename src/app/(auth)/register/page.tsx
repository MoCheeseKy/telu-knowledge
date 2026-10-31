"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Slicing phase: siap diintegrasikan dengan AuthService backend
  };

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

      {/* Form Register */}
      <form onSubmit={handleSubmit} className="space-y-4">
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@student.telkomuniversity.ac.id"
            required
            leftIcon={<User className="w-5 h-5 text-[var(--muted)]" />}
            className="h-11 text-sm bg-white"
          />
          <p className="text-xs text-[var(--muted)]">
            Hanya domain @student.telkomuniversity.ac.id
          </p>
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
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
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

        {/* Konfirmasi Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-[var(--foreground)]"
          >
            Konfirmasi Password <span className="text-[var(--primary-text)]">*</span>
          </label>
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ulangi password"
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

        {/* Persetujuan Ketentuan */}
        <div className="pt-1">
          <Checkbox
            id="terms"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            label={
              <span className="text-xs sm:text-sm text-[var(--muted)]">
                Saya menyetujui{" "}
                <span className="text-[var(--primary-text)] font-medium hover:underline">
                  Ketentuan Layanan
                </span>{" "}
                dan{" "}
                <span className="text-[var(--primary-text)] font-medium hover:underline">
                  Kebijakan Privasi
                </span>
              </span>
            }
          />
        </div>

        {/* Tombol Register */}
        <Button
          type="submit"
          className="w-full h-11 sm:h-12 bg-[#B42318] hover:bg-[#991B1B] text-white font-semibold rounded-lg text-sm sm:text-base shadow-xs transition-colors mt-2"
        >
          Daftar Akun
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
