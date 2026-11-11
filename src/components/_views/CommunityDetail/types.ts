import type { CommunityPostDto } from "@/services/community-posts/community-posts.types";

export interface CommunityHighlight {
  id: string;
  title: string;
  authorName: string;
  imageUrl?: string;
  href: string;
}

export interface CommunityRule {
  id: number;
  title: string;
  description: string;
}

export interface CommunityPost {
  /** ID postingan di mock server (CommunityPostDto.id). */
  id: string | number;
  /** Penulis postingan — dipakai untuk cek kepemilikan (tombol sunting/hapus). */
  authorId: string;
  topic: string;
  publisher: string;
  postDate: string;
  title: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
  likesCount: string | number;
  commentsCount: string | number;
  repostsCount: string | number;
  isLiked?: boolean;
}

const postDateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/**
 * Mengubah CommunityPostDto (mock server) menjadi bentuk tampilan kartu feed.
 * Deskripsi dipotong menjadi ringkasan maksimal 280 karakter.
 */
export function mapCommunityPostDto(
  dto: CommunityPostDto,
  topicName: string
): CommunityPost {
  const trimmed = dto.content.trim();

  return {
    id: dto.id,
    authorId: dto.authorId,
    topic: topicName,
    publisher: dto.author.displayName,
    postDate: postDateFormatter.format(new Date(dto.createdAt)),
    title: dto.title,
    description:
      trimmed.length > 280 ? `${trimmed.slice(0, 280)}…` : trimmed,
    ...(dto.coverImageUrl
      ? {
          imageUrl: dto.coverImageUrl,
          imageAlt: dto.imageCaption ?? dto.title,
        }
      : {}),
    likesCount: dto.likesCount,
    commentsCount: dto.commentsCount,
    repostsCount: dto.repostsCount,
    isLiked: dto.isLiked,
  };
}

export interface CommunityDetail {
  id: string;
  name: string;
  avatarUrl: string;
  description: string;
  memberCount: string;
  postCount: string;
  createdAt: string;
  admin: {
    name: string;
    avatarUrl?: string;
  };
  rules: CommunityRule[];
  highlights: CommunityHighlight[];
}

export const sampleCommunity: CommunityDetail = {
  id: "komunitas-makanan-telkom",
  name: "Komunitas Makanan Telkom University Bandung",
  avatarUrl: "/images/persona-c4.jpg",
  description:
    "Wadah diskusi mahasiswa Telkom University Bandung seputar game Persona: teori cerita, tips bermain, fanart, hingga turnamen antar kampus.",
  memberCount: "72K",
  postCount: "2000",
  createdAt: "14 Sep 2024",
  admin: {
    name: "Vastuolu",
  },
  rules: [
    {
      id: 1,
      title: "Gunakan bahasa yang sopan",
      description:
        "Sapa anggota lain dengan santun dan hindari kata-kata kasar, menyinggung, atau merendahkan.",
    },
    {
      id: 2,
      title: "Dilarang SARA dan ujaran kebencian",
      description:
        "Diskusi yang mengandung unsur suku, agama, ras, dan antargolongan tidak akan ditoleransi.",
    },
    {
      id: 3,
      title: "Cantumkan sumber informasi",
      description:
        "Sertakan tautan atau kredit pembuat asli saat membagikan berita, fanart, atau kutipan.",
    },
    {
      id: 4,
      title: "Dilarang spam dan promosi",
      description:
        "Jual beli, tautan afiliasi, dan promosi berulang di luar topik komunitas akan dihapus.",
    },
  ],
  highlights: [
    {
      id: "hl-1",
      title: "Diskusi Bulanan — November 2026 | Gamer Tel-U",
      authorName: "Vastuolu",
      href: "/discussion-forums/1",
    },
    {
      id: "hl-2",
      title: "Showcase Karya & Turnamen — November 2026",
      authorName: "Rifky M. Prayudhi",
      imageUrl: "/images/persona-c4.jpg",
      href: "/discussion-forums/2",
    },
    {
      id: "hl-3",
      title: "Diskusi Bulanan — Oktober 2026 | Gamer Tel-U",
      authorName: "Vastuolu",
      href: "/discussion-forums/3",
    },
    {
      id: "hl-4",
      title: "Showcase Karya & Turnamen — Oktober 2026",
      authorName: "Rifky M. Prayudhi",
      imageUrl: "/images/persona-c4.jpg",
      href: "/discussion-forums/4",
    },
  ],
};

export function getSampleCommunity(id: string): CommunityDetail {
  return { ...sampleCommunity, id };
}
