import DiscussionForumDetailView from "@/components/_views/DiscussionForumDetail";

interface DiscussionForumDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DiscussionForumDetailPage({
  params,
}: DiscussionForumDetailPageProps) {
  const { id } = await params;
  return <DiscussionForumDetailView postId={id} />;
}