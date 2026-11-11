import EditorLayout from "@/components/_layouts/EditorLayout";
import AuthenticatedShell from "@/components/_shared/AuthenticatedShell";
import { getSession } from "@/lib/auth/session";

export default async function EditorRouteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    const authorName = session?.user?.email?.split("@")[0];

    return (
        <AuthenticatedShell fallbackPath="/editor-studio">
            <EditorLayout authorName={authorName}>{children}</EditorLayout>
        </AuthenticatedShell>
    );
}
