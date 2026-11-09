import CommunityDetailView from "@/components/_views/CommunityDetail";
import { getSampleCommunity } from "@/components/_views/CommunityDetail/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const community = getSampleCommunity(id);

  return {
    title: `${community.name} | Tel-U Knowledge`,
    description: community.description,
  };
}

export default async function CommunityDetailPage({ params }: PageProps) {
  const { id } = await params;
  const community = getSampleCommunity(id);

  return <CommunityDetailView community={community} />;
}
