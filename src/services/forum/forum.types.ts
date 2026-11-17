export interface JoinedForum {
  id: string;
  title: string;
  description: string;
  activeMemberCount: string;
  isFollowing: boolean;
  href: string;
  role: "owner" | "moderator" | "member";
  joinedAt: string;
}