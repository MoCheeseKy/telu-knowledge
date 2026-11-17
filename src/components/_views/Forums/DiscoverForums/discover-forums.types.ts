export interface DiscoverCommunityItem {
  id: string | number;
  name: string;
  description: string;
  author: string;
  members: string;
  discussions: string;
  image: string;
}

export interface CommunityCardProps {
  community: DiscoverCommunityItem;
  followed: boolean;
  onFollow: () => void;
}
