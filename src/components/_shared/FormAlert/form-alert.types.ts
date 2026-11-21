import type { ReactNode } from "react";

/**
 * Properti untuk komponen banner peringatan atau notifikasi sukses formulir.
 */
export interface FormAlertProps {
  variant?: "error" | "success";
  messages?: string | string[];
  children?: ReactNode;
  className?: string;
}
