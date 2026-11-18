import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE_ACCESS,
  AUTH_COOKIE_REFRESH,
  AUTH_COOKIE_REMEMBER,
} from "@/lib/constants";
import { isPublicPath, safeNextPath } from "@/lib/auth/paths";
import {
  getAccessCookieOptions,
  getRefreshCookieOptions,
  getRememberCookieOptions,
} from "@/lib/auth/cookie-options";
import { serverEnv } from "@/lib/env";

/**
 * Konfigurasi matcher proxy Next.js.
 * Mengecualikan route API BFF (`api/*`), aset internal Next.js (`_next/static`, `_next/image`),
 * aset publik (`images/*`, `favicon.ico`), serta file berekstensi statis.
 */
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|favicon\\.ico|.*\\.[\\w]+$).*)",
  ],
};

/**
 * Proxy request handler di Next.js 16 (pengganti middleware.ts, berjalan di Node.js runtime).
 * Mengatur proteksi route publik/privat dan auto-refresh token.
 *
 * @param request - Request HTTP masuk yang diproses proxy Next.js.
 * @returns Respons lanjut atau redirect sesuai status autentikasi pengguna.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const accessToken = request.cookies.get(AUTH_COOKIE_ACCESS)?.value;
  const refreshToken = request.cookies.get(AUTH_COOKIE_REFRESH)?.value;
  const rememberToken = request.cookies.get(AUTH_COOKIE_REMEMBER)?.value;
  const isRememberActive = Boolean(rememberToken);

  let isAuthenticated = Boolean(accessToken);
  let newAccessToken: string | undefined;
  let newRefreshToken: string | undefined;
  let newExpiresIn: number | undefined;
  let shouldClearCookies = false;

  if (!accessToken && refreshToken) {
    try {
      const refreshRes = await fetch(
        `${serverEnv.API_BASE_URL}/api/auth/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
          cache: "no-store",
          signal: AbortSignal.timeout(5000),
        }
      );

      if (refreshRes.ok) {
        const json = await refreshRes.json();
        if (json?.data?.access_token) {
          isAuthenticated = true;
          newAccessToken = json.data.access_token;
          newRefreshToken = json.data.refresh_token;
          newExpiresIn = json.data.expires_in;
        } else {
          shouldClearCookies = true;
        }
      } else {
        shouldClearCookies = true;
      }
    } catch {
      shouldClearCookies = true;
    }
  }

  const isPublic = isPublicPath(pathname);

  const applyAuthCookiesToResponse = (response: NextResponse) => {
    if (shouldClearCookies) {
      response.cookies.delete(AUTH_COOKIE_ACCESS);
      response.cookies.delete(AUTH_COOKIE_REFRESH);
      response.cookies.delete(AUTH_COOKIE_REMEMBER);
    } else if (newAccessToken && newRefreshToken) {
      response.cookies.set(
        AUTH_COOKIE_ACCESS,
        newAccessToken,
        getAccessCookieOptions(newExpiresIn)
      );
      response.cookies.set(
        AUTH_COOKIE_REFRESH,
        newRefreshToken,
        getRefreshCookieOptions(isRememberActive)
      );
      if (isRememberActive) {
        response.cookies.set(
          AUTH_COOKIE_REMEMBER,
          "1",
          getRememberCookieOptions()
        );
      }
    }
  };

  if (isAuthenticated && (pathname === "/login" || pathname === "/register")) {
    const homeUrl = new URL("/home", serverEnv.APP_ORIGIN);
    const redirectResponse = NextResponse.redirect(homeUrl);
    applyAuthCookiesToResponse(redirectResponse);
    return redirectResponse;
  }

  if (!isAuthenticated && !isPublic) {
    const loginUrl = new URL("/login", serverEnv.APP_ORIGIN);
    const validatedNext = safeNextPath(pathname + search, "/home");
    loginUrl.searchParams.set("next", validatedNext);

    const redirectResponse = NextResponse.redirect(loginUrl);
    if (shouldClearCookies) {
      redirectResponse.cookies.delete(AUTH_COOKIE_ACCESS);
      redirectResponse.cookies.delete(AUTH_COOKIE_REFRESH);
      redirectResponse.cookies.delete(AUTH_COOKIE_REMEMBER);
    }
    return redirectResponse;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname + search);

  // Teruskan cookie hasil refresh ke header request agar Server Component downstream langsung membacanya
  if (newAccessToken) {
    request.cookies.set(AUTH_COOKIE_ACCESS, newAccessToken);
    if (newRefreshToken) {
      request.cookies.set(AUTH_COOKIE_REFRESH, newRefreshToken);
      if (isRememberActive) {
        request.cookies.set(AUTH_COOKIE_REMEMBER, "1");
      }
    }
    requestHeaders.set("cookie", request.cookies.toString());
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  applyAuthCookiesToResponse(response);
  return response;
}

export default proxy;
