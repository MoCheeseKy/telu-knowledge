import { redirect } from "next/navigation";
import { headers } from "next/headers";
import SessionHydrator from "@/components/_shared/SessionHydrator";
import { getSession } from "@/lib/auth/session";

export interface AuthenticatedShellProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

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

