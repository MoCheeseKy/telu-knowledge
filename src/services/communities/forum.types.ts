/** Data ringkas forum yang diikuti oleh pengguna. */
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

export interface JoinForumResult {
  isJoined: boolean;
  memberCount: number;
}