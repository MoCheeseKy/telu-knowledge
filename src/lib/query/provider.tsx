"use client";

import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "./query-client";

/**
 * Provider React Query global untuk membungkus tree komponen client.
 *
 * @param props - Properti komponen berisi `children`.
 * @returns Elemen `QueryClientProvider` dengan instance `QueryClient` aktif.
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
