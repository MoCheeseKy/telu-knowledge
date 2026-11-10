export interface TopicRecommendation {
  id: string;
  title: string;
  count: string;
  href: string;
}

export interface WriterRecommendation {
  id: string;
  name: string;
  displayName: string;
  username?: string;
  avatarUrl?: string;
  avatarColor?: string;
  followersCount?: number;
  isFollowing: boolean;
}

export interface CommunityRecommendation {
  id: string;
  title: string;
  description: string;
  activeMemberCount: string;
  isFollowing: boolean;
  href: string;
}

