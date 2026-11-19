"use client";

import { useEffect } from "react";
import type { ErrorFallbackProps } from "@/components/_shared/ErrorFallback/error-fallback.types";

/** Batas error global Next.js untuk menangani kesalahan fatal pada root layout. */
export default function GlobalErrorPage({ error, reset }: ErrorFallbackProps) {
  useEffect(() => {
    console.error("[Global ErrorBoundary]", {
      name: error.name,
      digest: error.digest,
    });
  }, [error]);

  return (
    <html lang="id">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          backgroundColor: "#FDFCFC",
          color: "#1C1918",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "420px",
            width: "100%",
            padding: "32px 24px",
            borderRadius: "16px",
            border: "1px solid #D6D1CE",
            backgroundColor: "#FDFCFC",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 8px" }}>
            Terjadi Gangguan Sistem
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#6B6461",
              lineHeight: 1.6,
              margin: "0 0 24px",
            }}
          >
            Aplikasi mengalami kesalahan tak terduga. Silakan muat ulang halaman
            untuk memulihkan sesi Anda.
          </p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <button
              type="button"
              onClick={reset}
              style={{
                padding: "9px 16px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#C23A36",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Muat Ulang
            </button>
            <a
              href="/home"
              style={{
                padding: "9px 16px",
                borderRadius: "8px",
                border: "1px solid #D6D1CE",
                color: "#1C1918",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              Ke Beranda
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
