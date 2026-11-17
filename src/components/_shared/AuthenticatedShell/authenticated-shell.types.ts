import type { ReactNode } from "react";

/**
 * Properti untuk komponen pembungkus halaman terautentikasi.
 */
export interface AuthenticatedShellProps {
  children: ReactNode;
  fallbackPath?: string;
}
