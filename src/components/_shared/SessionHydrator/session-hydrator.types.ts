import type { ReactNode } from "react";
import type { AuthUser } from "@/services/auth/auth.types";

/**
 * Properti untuk komponen {@link SessionHydrator}.
 */
export interface SessionHydratorProps {
  user: AuthUser | null;
  children: ReactNode;
}
