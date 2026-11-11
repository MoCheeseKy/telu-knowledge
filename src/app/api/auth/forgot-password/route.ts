import { NextResponse } from "next/server";
import { assertSameOrigin } from "@/lib/api/origin";
import { getClientIp, serverFetch } from "@/lib/api/server";
import { toApiError } from "@/lib/api/errors";
import { forgotPasswordSchema } from "@/services/auth/auth.schemas";

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

  const parsed = forgotPasswordSchema.safeParse(body);
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

  const clientIp = getClientIp(new Headers(request.headers));

  try {
    const backendRes = await serverFetch<null>("/auth/forgot-password", {
      method: "POST",
      body: parsed.data,
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
