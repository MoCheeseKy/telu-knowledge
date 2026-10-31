/**
 * Konstanta global frontend Tel-U Knowledge
 */

export const ALLOWED_EMAIL_DOMAIN = "@student.telkomuniversity.ac.id";

export const AUTH_COOKIE_ACCESS = "tk_access";
export const AUTH_COOKIE_REFRESH = "tk_refresh";

export const PUBLIC_AUTH_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/auth/callback",
] as const;
