import EditorLayout from "@/components/_layouts/EditorLayout";

export default function EditorRouteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <EditorLayout>{children}</EditorLayout>;
}
