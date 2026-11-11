import "server-only";

import { cache } from "react";
import { getAccessToken } from "./cookies";
import { serverFetch } from "@/lib/api/server";
import type { AuthUser } from "@/services/auth/auth.types";

export interface SessionData {
  user: AuthUser;
}

/**
 * Mengambil data user yang sedang login dari backend (GET /auth/me).
 * Dibungkus React cache() agar di-memoize dan hanya dipanggil maksimal 1 kali per request render server.
 * Mengembalikan { user } jika terotentikasi, atau null jika tidak ada token / token tidak valid.
 */
export const getSession = cache(async (): Promise<SessionData | null> => {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return null;
  }

  try {
    const res = await serverFetch<{ user: AuthUser }>("/auth/me", {
      method: "GET",
      token: accessToken,
    });

    if (res && res.data && res.data.user) {
      return {
        user: res.data.user,
      };
    }

    return null;
  } catch {
    return null;
  }
});
