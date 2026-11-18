/**
 * Data rekomendasi topik populer beserta jumlah konten terkait dan tautannya.
 */
export interface TopicRecommendation {
  id: string;
  title: string;
  count: string;
  href: string;
}

/**
 * Data rekomendasi penulis beserta informasi profil ringkas dan status mengikuti.
 */
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

/**
 * Data rekomendasi komunitas aktif beserta deskripsi, jumlah anggota aktif, dan status mengikuti.
 */
export interface CommunityRecommendation {
  id: string;
  title: string;
  description: string;
  activeMemberCount: string;
  isFollowing: boolean;
  href: string;
}

