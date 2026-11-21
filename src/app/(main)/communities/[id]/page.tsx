import CommunityDetailView from "@/components/_views/Communities/CommunityDetail";
import { getSampleCommunity } from "@/components/_views/Communities/CommunityDetail/community-detail.types";

interface PageProps {
  params: Promise<{ id: string }>;
}

/** Menghasilkan metadata halaman detail komunitas berdasarkan ID komunitas. */
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const community = getSampleCommunity(id);

  return {
    title: `${community.name} | Tel-U Knowledge`,
    description: community.description,
  };
}

/** Halaman detail komunitas yang menampilkan informasi dan aktivitas komunitas. */
export default async function CommunityDetailPage({ params }: PageProps) {
  const { id } = await params;
  const community = getSampleCommunity(id);

  return <CommunityDetailView community={community} />;
}
