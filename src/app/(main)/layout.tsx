import MainLayout from "@/components/_layouts/MainLayout";
import AuthenticatedShell from "@/components/_shared/AuthenticatedShell";

export default function MainRouteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthenticatedShell fallbackPath="/home">
            <MainLayout>{children}</MainLayout>
        </AuthenticatedShell>
    );
}
