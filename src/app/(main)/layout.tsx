import MainLayout from "@/components/_layouts/MainLayout";

export default function MainRouteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <MainLayout>{children}</MainLayout>;
}
