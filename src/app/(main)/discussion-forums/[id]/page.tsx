import DiscussionForumDetailView from "@/components/_views/Forums/DiscussionForumDetail";

interface PageProps {
  params: Promise<{ id: string }>;
}

/** Menghasilkan metadata halaman detail diskusi forum berdasarkan ID diskusi. */
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return {
    title: `Detail Diskusi #${id} | Tel-U Knowledge`,
    description: "Ruang diskusi forum mahasiswa Telkom University",
  };
}

/** Halaman detail utas diskusi pada forum mahasiswa. */
export default async function DiscussionForumDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <DiscussionForumDetailView postId={id} />;
}

