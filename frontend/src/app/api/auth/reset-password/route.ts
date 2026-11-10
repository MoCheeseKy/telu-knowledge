import { NextResponse } from "next/server";
import { assertSameOrigin } from "@/lib/api/origin";
import { getClientIp, serverFetch } from "@/lib/api/server";
import { toApiError } from "@/lib/api/errors";
import { resetPasswordSchema } from "@/services/auth/auth.schemas";

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

  const parsed = resetPasswordSchema.safeParse(body);
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

  const { password, token } = parsed.data;
  const clientIp = getClientIp(new Headers(request.headers));

  try {
    // Token recovery diteruskan sebagai Bearer token dan TIDAK disimpan di cookie atau log
    const backendRes = await serverFetch<null>("/auth/reset-password", {
      method: "POST",
      body: { password },
      token,
      clientIp,
    });

    return NextResponse.json({
      statusCode: backendRes.statusCode || 200,
      message: backendRes.message,
      isError: false,
      data: null,
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
