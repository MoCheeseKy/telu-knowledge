"use client";

import ErrorFallback from "@/components/_shared/ErrorFallback";
import type { ErrorFallbackProps } from "@/components/_shared/ErrorFallback/error-fallback.types";

export default function RootErrorPage({ error, reset }: ErrorFallbackProps) {
  return <ErrorFallback error={error} reset={reset} />;
}
