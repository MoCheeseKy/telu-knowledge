import CommunityPostCreateView from "@/components/_views/CommunityPostCreate";
import { getSampleCommunity } from "@/components/_views/CommunityDetail/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const community = getSampleCommunity(id);

  return {
    title: `Buat Postingan di ${community.name} | Tel-U Knowledge`,
    description: `Tulis dan bagikan postingan baru di ${community.name}.`,
  };
}

export default async function CreateCommunityPostPage({ params }: PageProps) {
  const { id } = await params;
  const community = getSampleCommunity(id);

  return <CommunityPostCreateView community={community} />;
}
