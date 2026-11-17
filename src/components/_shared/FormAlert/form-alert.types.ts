import type { ReactNode } from "react";

export interface FormAlertProps {
  variant?: "error" | "success";
  messages?: string | string[];
  children?: ReactNode;
  className?: string;
}
