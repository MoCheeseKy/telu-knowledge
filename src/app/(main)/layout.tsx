import { redirect } from "next/navigation";
import { headers } from "next/headers";
import MainLayout from "@/components/_layouts/MainLayout";
import { getSession } from "@/lib/auth/session";

export default async function MainRouteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    if (!session) {
        const headerList = await headers();
        const currentPath = headerList.get("x-pathname") || "/home";
        redirect(`/api/auth/session-expired?next=${encodeURIComponent(currentPath)}`);
    }

    return <MainLayout>{children}</MainLayout>;
}
