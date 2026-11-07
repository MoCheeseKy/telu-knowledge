import DiscussionForumDetailView from "@/components/_views/DiscussionForumDetail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return {
    title: `Detail Diskusi #${id} | Tel-U Knowledge`,
    description: "Ruang diskusi forum mahasiswa Telkom University",
  };
}

export default async function DiscussionForumDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <DiscussionForumDetailView postId={id} />;
}

