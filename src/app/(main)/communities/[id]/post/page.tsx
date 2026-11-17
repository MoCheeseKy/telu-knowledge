import CommunityPostCreateView from "@/components/_views/Communities/CommunityPostCreate";
import { getSampleCommunity } from "@/components/_views/Communities/CommunityDetail/community-detail.types";

interface PageProps {
  params: Promise<{ id: string }>;
}

/** Menghasilkan metadata halaman pembuatan postingan komunitas berdasarkan ID komunitas. */
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const community = getSampleCommunity(id);

  return {
    title: `Buat Postingan di ${community.name} | Tel-U Knowledge`,
    description: `Tulis dan bagikan postingan baru di ${community.name}.`,
  };
}

/** Halaman untuk membuat postingan baru di dalam komunitas tertentu. */
export default async function CreateCommunityPostPage({ params }: PageProps) {
  const { id } = await params;
  const community = getSampleCommunity(id);

  return <CommunityPostCreateView community={community} />;
}
