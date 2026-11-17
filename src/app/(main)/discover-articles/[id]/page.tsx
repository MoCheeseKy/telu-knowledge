import ArticleDetailView from "@/components/_views/Articles/ArticleDetail";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

/** Halaman detail artikel berdasarkan ID artikel. */
export default async function ArticleDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <ArticleDetailView articleId={id} />;
}

