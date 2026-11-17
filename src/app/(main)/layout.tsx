import MainLayout from "@/components/_layouts/MainLayout";
import AuthenticatedShell from "@/components/_shared/AuthenticatedShell";

/** Layout rute utama yang membungkus halaman terautentikasi dengan shell dan tata letak utama. */
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
