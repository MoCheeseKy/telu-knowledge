import { NextResponse } from "next/server";
import { assertSameOrigin } from "@/lib/api/origin";
import { getClientIp, serverFetch } from "@/lib/api/server";
import { clearAuthCookies, getAccessToken } from "@/lib/auth/cookies";

export async function POST(request: Request) {
  const originError = assertSameOrigin(request);
  if (originError) return originError;

  const accessToken = await getAccessToken();
  const clientIp = getClientIp(new Headers(request.headers));

  // Panggil backend logout dengan Bearer token jika cookie ada (kegagalan diabaikan)
  if (accessToken) {
    try {
      await serverFetch("/auth/logout", {
        method: "POST",
        token: accessToken,
        clientIp,
      });
    } catch {
      // Abaikan kegagalan revoke di backend (misal token sudah kedaluwarsa)
    }
  }

  // Selalu bersihkan cookie sesi
  await clearAuthCookies();

  return NextResponse.json({
    statusCode: 200,
    message: "Logout berhasil",
    isError: false,
    data: null,
  });
}
