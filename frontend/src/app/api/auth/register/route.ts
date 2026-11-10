import { NextResponse } from "next/server";
import { assertSameOrigin } from "@/lib/api/origin";
import { getClientIp, serverFetch } from "@/lib/api/server";
import { toApiError } from "@/lib/api/errors";
import { registerSchema } from "@/services/auth/auth.schemas";
import type { RegisterResponseData } from "@/services/auth/auth.types";

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

  const parsed = registerSchema.safeParse(body);
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
    const backendRes = await serverFetch<RegisterResponseData>(
      "/auth/register",
      {
        method: "POST",
        body: parsed.data,
        clientIp,
      }
    );

    return NextResponse.json(
      {
        statusCode: backendRes.statusCode || 201,
        message: backendRes.message,
        isError: false,
        data: backendRes.data,
      },
      { status: backendRes.statusCode || 201 }
    );
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
