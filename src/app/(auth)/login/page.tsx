"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Slicing phase: siap diintegrasikan dengan AuthService backend
  };

  return (
    <div className="w-full flex flex-col justify-center">
      {/* Judul Halaman */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--primary-text)] tracking-tight">
          Login
        </h1>
      </div>

      {/* Form Login */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email SSO */}
        <div className="space-y-2">
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
            placeholder="Username SSO"
            required
            leftIcon={<User className="w-5 h-5 text-[var(--muted)]" />}
            className="h-11 text-sm bg-white"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
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
            placeholder="Password"
            required
            leftIcon={
              <EyeOff className="w-5 h-5 text-[var(--muted)]" />
            }
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

        {/* Remember me & Lupa Password */}
        <div className="flex items-center justify-between pt-1">
          <Checkbox
            id="remember-me"
            label="Remember me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
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
          className="w-full h-11 sm:h-12 bg-[#B42318] hover:bg-[#991B1B] text-white font-semibold rounded-lg text-sm sm:text-base shadow-xs transition-colors mt-2"
        >
          Sign In
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
