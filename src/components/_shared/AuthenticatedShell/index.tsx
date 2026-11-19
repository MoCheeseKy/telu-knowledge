import { redirect } from "next/navigation";
import { headers } from "next/headers";
import SessionHydrator from "@/components/_shared/SessionHydrator";
import { getSession } from "@/lib/auth/session";
import type { AuthenticatedShellProps } from "./authenticated-shell.types";

export type { AuthenticatedShellProps };

/**
 * Server Component pembungkus halaman terautentikasi yang memvalidasi sesi
 * dan melakukan hidrasi data pengguna ke client.
 */
export default async function AuthenticatedShell({
  children,
  fallbackPath = "/home",
}: AuthenticatedShellProps) {
  const session = await getSession();
  if (!session) {
    const headerList = await headers();
    const currentPath = headerList.get("x-pathname") || fallbackPath;
    redirect(`/api/auth/session-expired?next=${encodeURIComponent(currentPath)}`);
  }

  return <SessionHydrator user={session.user}>{children}</SessionHydrator>;
}

