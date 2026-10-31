import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_ACCESS,
  AUTH_COOKIE_REFRESH,
  AUTH_COOKIE_REMEMBER,
} from "@/lib/constants";
import { safeNextPath } from "@/lib/auth/paths";

/**
 * Route handler untuk menangani sesi kedaluwarsa / token yang dicabut.
 * Menghapus semua cookie autentikasi dan me-redirect ke halaman login.
 * Mencegah redirect loop antara proxy.ts dan (main)/layout.tsx.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const rawNext = url.searchParams.get("next");
  const validatedNext = safeNextPath(rawNext, "/home");

  const loginUrl = new URL("/login", url.origin);
  loginUrl.searchParams.set("next", validatedNext);

  const response = NextResponse.redirect(loginUrl, 307);
  response.headers.set("Cache-Control", "no-store, max-age=0");

  response.cookies.delete({ name: AUTH_COOKIE_ACCESS, path: "/" });
  response.cookies.delete({ name: AUTH_COOKIE_REFRESH, path: "/" });
  response.cookies.delete({ name: AUTH_COOKIE_REMEMBER, path: "/" });

  return response;
}
