"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordView() {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
        // Slicing phase: siap diintegrasikan dengan AuthService backend
    };

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

            {isSubmitted ? (
                <div className="p-6 rounded-xl border border-[var(--dust)] bg-[var(--background-accent)]/50 text-center space-y-4 animate-in fade-in-50 duration-300">
                    <div className="w-12 h-12 rounded-full bg-[var(--primary-soft)] text-[var(--primary-text)] flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-base text-[var(--foreground)]">
                            Tautan Terkirim
                        </h3>
                        <p className="text-xs sm:text-sm text-[var(--muted)] mt-1">
                            Jika email <strong>{email}</strong> terdaftar, tautan pemulihan
                            telah dikirimkan. Silakan periksa inbox atau spam email Anda.
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsSubmitted(false)}
                        className="w-full text-xs sm:text-sm"
                    >
                        Kirim Ulang Email
                    </Button>
                </div>
            ) : (
                /* Form Lupa Password */
                <form onSubmit={handleSubmit} className="space-y-5">
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
                        <p className="text-xs text-[var(--muted)]">
                            Gunakan email berdomain @student.telkomuniversity.ac.id
                        </p>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-11 sm:h-12 bg-[#B42318] hover:bg-[#991B1B] text-white font-semibold rounded-lg text-sm sm:text-base shadow-xs transition-colors mt-2"
                    >
                        Kirim Tautan Pemulihan
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
