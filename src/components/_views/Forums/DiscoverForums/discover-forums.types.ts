/**
 * Representasi item komunitas pada halaman Jelajah Forum.
 */
export interface DiscoverCommunityItem {
  id: string | number;
  name: string;
  description: string;
  author: string;
  members: string;
  discussions: string;
  image: string;
}

/**
 * Properti untuk komponen kartu komunitas pada halaman Jelajah Forum.
 */
export interface CommunityCardProps {
  community: DiscoverCommunityItem;
  followed: boolean;
  onFollow: () => void;
}
