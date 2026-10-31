import { NextResponse } from "next/server";
import { assertSameOrigin } from "@/lib/api/origin";
import { getClientIp, serverFetch } from "@/lib/api/server";
import { toApiError } from "@/lib/api/errors";
import { setAuthCookies } from "@/lib/auth/cookies";
import { loginSchema } from "@/services/auth/auth.schemas";
import type { BackendLoginData } from "@/services/auth/auth.types";

export async function POST(request: Request) {
  const originError = assertSameOrigin(request);
  if (originError) return originError;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        statusCode: 400,
        message: ["Format JSON pada body request tidak valid."],
        isError: true,
        data: null,
      },
      { status: 400 }
    );
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        statusCode: 400,
        message: parsed.error.issues.map((issue) => issue.message),
        isError: true,
        data: null,
      },
      { status: 400 }
    );
  }

  const { email, password, rememberMe } = parsed.data;
  const clientIp = getClientIp(new Headers(request.headers));

  try {
    const backendRes = await serverFetch<BackendLoginData>("/auth/login", {
      method: "POST",
      body: { email, password },
      clientIp,
    });

    // Simpan token ke HttpOnly cookie
    await setAuthCookies(backendRes.data, rememberMe);

    // Kembalikan envelope TANPA token ke browser (hanya data user)
    return NextResponse.json({
      statusCode: 200,
      message: backendRes.message || "Login berhasil",
      isError: false,
      data: {
        user: backendRes.data.user,
      },
    });
  } catch (error) {
    const apiErr = toApiError(error);
    return NextResponse.json(
      {
        statusCode: apiErr.statusCode,
        message: apiErr.messages,
        isError: true,
        data: null,
      },
      { status: apiErr.statusCode }
    );
  }
}
