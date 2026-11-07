import EditorStudioView from "@/components/_views/EditorStudio";

interface EditorStudioEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditorStudioEditPage({
  params,
}: EditorStudioEditPageProps) {
  const { id } = await params;
  return <EditorStudioView articleId={id} />;
}

