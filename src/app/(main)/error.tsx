"use client";

import ErrorFallback from "@/components/_shared/ErrorFallback";
import type { ErrorFallbackProps } from "@/components/_shared/ErrorFallback/error-fallback.types";

/** Batas error tingkat rute utama yang menampilkan tampilan pemulihan kesalahan. */
export default function MainRouteErrorPage({
  error,
  reset,
}: ErrorFallbackProps) {
  return <ErrorFallback error={error} reset={reset} />;
}
