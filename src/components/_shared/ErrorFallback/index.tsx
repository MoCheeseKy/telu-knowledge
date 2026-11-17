"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ErrorFallbackProps } from "./error-fallback.types";

/**
 * Tampilan fallback terstandarisasi untuk Next.js Error Boundary (error.tsx).
 * Tidak mengekspos detail teknis error.message/stack ke UI pengguna.
 */
export default function ErrorFallback({
  error,
  reset,
  title = "Terjadi Kesalahan Tak Terduga",
  description = "Maaf, sistem mengalami kendala saat memuat halaman ini. Silakan coba muat ulang atau kembali ke beranda.",
}: ErrorFallbackProps) {
  useEffect(() => {
    console.error("[App ErrorBoundary]", {
      name: error.name,
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="w-full max-w-md rounded-2xl border border-[var(--dust)] bg-[var(--background)] p-6 sm:p-8 shadow-2xs flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-[var(--failed-soft)] text-[var(--failed-text)] flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h1 className="font-newsreader text-2xl sm:text-[28px] font-semibold text-[var(--foreground)] leading-tight mb-2">
          {title}
        </h1>

        <p className="font-sans text-xs sm:text-sm text-[var(--muted)] leading-relaxed mb-6">
          {description}
        </p>

        {error.digest && (
          <p className="font-mono text-[11px] text-[var(--muted)] mb-5 px-2.5 py-1 rounded-md bg-[var(--background-accent)]">
            Kode referensi: {error.digest}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 w-full">
          <Button
            type="button"
            size="sm"
            onClick={reset}
            className="gap-1.5 rounded-lg bg-[var(--primary-text)] hover:bg-[var(--primary-hover)] text-white cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Coba Muat Ulang</span>
          </Button>

          <Link
            href="/home"
            className="inline-flex items-center justify-center gap-1.5 h-8 px-3.5 rounded-lg border border-[var(--dust)] text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--background-accent)] transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
