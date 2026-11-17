import CommunityPostEditView from "@/components/_views/CommunityPostEdit";
import { getSampleCommunity } from "@/components/_views/CommunityDetail/types";

interface PageProps {
  params: Promise<{ id: string; postId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const community = getSampleCommunity(id);

  return {
    title: `Sunting Postingan di ${community.name} | Tel-U Knowledge`,
    description: `Sunting postingan Anda di ${community.name}.`,
  };
}

export default async function EditCommunityPostPage({ params }: PageProps) {
  const { id, postId } = await params;
  const community = getSampleCommunity(id);

  return <CommunityPostEditView community={community} postId={postId} />;
}
