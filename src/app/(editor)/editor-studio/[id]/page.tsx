import EditorStudioView from "@/components/_views/EditorStudio";

interface EditorStudioEditPageProps {
  params: Promise<{ id: string }>;
}

/** Halaman studio editor untuk menyunting artikel yang sudah ada berdasarkan ID rute. */
export default async function EditorStudioEditPage({
  params,
}: EditorStudioEditPageProps) {
  const { id } = await params;
  return <EditorStudioView articleId={id} />;
}

