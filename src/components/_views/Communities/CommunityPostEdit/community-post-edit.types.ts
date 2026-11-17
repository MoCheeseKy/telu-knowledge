import type { CommunityDetail } from "../CommunityDetail/community-detail.types";

/** Properti untuk tampilan penyuntingan postingan komunitas. */
export interface CommunityPostEditViewProps {
  community: CommunityDetail;
  postId: string;
}
