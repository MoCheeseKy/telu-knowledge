import "server-only";

import { NextResponse } from "next/server";
import { serverEnv } from "@/lib/env";

/**
 * Memvalidasi apakah request mutasi (POST, PUT, PATCH, DELETE) berasal dari same-origin (APP_ORIGIN).
 * Mengembalikan NextResponse 403 dengan format envelope error jika origin tidak valid/hilang.
 * Mengembalikan null jika request valid dan aman untuk diproses.
 *
 * @param request - Objek HTTP Request masuk pada route handler.
 * @returns `NextResponse` 403 jika origin tidak sah, atau `null` jika valid.
 */
export function assertSameOrigin(request: Request): NextResponse | null {
  const method = request.method.toUpperCase();

  if (method === "GET" || method === "HEAD") {
    return null;
  }

  const origin = request.headers.get("origin");
  const expectedOrigin = serverEnv.APP_ORIGIN;

  if (!origin || origin !== expectedOrigin) {
    return NextResponse.json(
      {
        statusCode: 403,
        message: ["Forbidden: Permintaan lintas asal (cross-origin) tidak diizinkan."],
        isError: true,
        data: null,
      },
      { status: 403 }
    );
  }

  return null;
}
