"use client";

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authKeys } from "@/services/auth/auth.queries";
import type { AuthUser } from "@/services/auth/auth.types";

export interface SessionHydratorProps {
  user: AuthUser | null;
  children: React.ReactNode;
}

/**
 * Client Component untuk mengisi cache authKeys.me dari data sesi server
 * pada render pertama tanpa memicu request jaringan.
 */
export default function SessionHydrator({
  user,
  children,
}: SessionHydratorProps) {
  const queryClient = useQueryClient();

  // Lazy initializer useState berjalan tepat 1 kali pada render pertama
  useState(() => {
    queryClient.setQueryData(authKeys.me, user);
    return true;
  });

  return <>{children}</>;
}
