import type { ReactNode } from "react";

export interface AuthenticatedShellProps {
  children: ReactNode;
  fallbackPath?: string;
}
