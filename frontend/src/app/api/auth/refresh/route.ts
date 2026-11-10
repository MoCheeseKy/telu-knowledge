import { NextResponse } from "next/server";
import { assertSameOrigin } from "@/lib/api/origin";
import { getClientIp, serverFetch } from "@/lib/api/server";
import { toApiError } from "@/lib/api/errors";
import {
  clearAuthCookies,
  getRefreshToken,
  setAuthCookies,
} from "@/lib/auth/cookies";
import type { BackendLoginData } from "@/services/auth/auth.types";

export async function POST(request: Request) {
  const originError = assertSameOrigin(request);
  if (originError) return originError;

  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    await clearAuthCookies();
    return NextResponse.json(
      {
        statusCode: 401,
        message: ["Refresh token tidak ditemukan atau telah kedaluwarsa."],
        isError: true,
        data: null,
      },
      { status: 401 }
    );
  }

  const clientIp = getClientIp(new Headers(request.headers));

  try {
    const backendRes = await serverFetch<BackendLoginData>("/auth/refresh", {
      method: "POST",
      body: { refresh_token: refreshToken },
      clientIp,
    });

    // Simpan token baru ke cookie HttpOnly
    await setAuthCookies(backendRes.data);

    return NextResponse.json({
      statusCode: 200,
      message: backendRes.message || "Token berhasil diperbarui",
      isError: false,
      data: {
        user: backendRes.data.user,
      },
    });
  } catch (error) {
    await clearAuthCookies();
    const apiErr = toApiError(error);
    return NextResponse.json(
      {
        statusCode: 401,
        message: apiErr.messages,
        isError: true,
        data: null,
      },
      { status: 401 }
    );
  }
}
