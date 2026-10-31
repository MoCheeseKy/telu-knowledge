import { redirect } from "next/navigation";
import MainLayout from "@/components/_layouts/MainLayout";
import { getSession } from "@/lib/auth/session";

export default async function MainRouteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    if (!session) {
        redirect("/login");
    }

    return <MainLayout>{children}</MainLayout>;
}
