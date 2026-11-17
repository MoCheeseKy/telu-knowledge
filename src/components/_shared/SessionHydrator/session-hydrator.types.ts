import type { ReactNode } from "react";
import type { AuthUser } from "@/services/auth/auth.types";

export interface SessionHydratorProps {
  user: AuthUser | null;
  children: ReactNode;
}
