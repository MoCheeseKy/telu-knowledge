import ArticleDetailView from "@/components/_views/ArticleDetail";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <ArticleDetailView articleId={id} />;
}

