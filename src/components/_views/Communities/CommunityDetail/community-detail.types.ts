import type { CommunityPostDto } from "@/services/communities/community-posts.types";
import { formatDate } from "@/lib/formatters";

/** Item sorotan komunitas yang ditampilkan pada bagian highlights. */
export interface CommunityHighlight {
  id: string;
  title: string;
  authorName: string;
  imageUrl?: string;
  href: string;
}

/** Aturan komunitas yang ditampilkan pada sidebar detail maupun pembuatan postingan. */
export interface CommunityRule {
  id: number;
  title: string;
  description: string;
}

/** Representasi postingan komunitas untuk kebutuhan tampilan kartu feed. */
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

/**
 * Mengubah CommunityPostDto (mock server) menjadi bentuk tampilan kartu feed.
 * Deskripsi dipotong menjadi ringkasan maksimal 280 karakter.
 *
 * @param dto - Data postingan mentah dari API komunitas.
 * @param topicName - Nama topik atau komunitas sebagai label kartu.
 * @returns Objek postingan yang siap dirender pada kartu feed.
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
    postDate: formatDate(dto.createdAt),
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

/** Data lengkap komunitas untuk halaman detail beserta sidebar dan sorotan. */
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

/** Properti untuk komponen utama halaman detail komunitas. */
export interface CommunityDetailViewProps {
  community: CommunityDetail;
}

/** Properti untuk komponen banner header komunitas. */
export interface CommunityBannerProps {
  community: CommunityDetail;
  isJoined: boolean;
  onToggleJoin: () => void;
}

/** Properti untuk komponen daftar feed postingan komunitas. */
export interface CommunityFeedProps {
  posts: CommunityPost[];
  /** Dibutuhkan untuk menyusun tautan "Sunting" pada post milik sendiri. */
  communityId: string;
}

/** Properti untuk komponen sorotan komunitas. */
export interface CommunityHighlightsProps {
  highlights: CommunityHighlight[];
}

/** Properti untuk tombol hapus postingan komunitas beserta dialog konfirmasinya. */
export interface CommunityPostDeleteButtonProps {
  communityId: string;
  /** ID postingan di mock server (CommunityPost.id / CommunityPostDto.id). */
  postId: string;
  postTitle: string;
  /**
   * "card" = tombol aksi kecil di feed (default);
   * "form" = tautan merah di footer form edit.
   */
  variant?: "card" | "form";
  /** Jika diisi, pengguna dialihkan ke URL ini setelah postingan berhasil dihapus. */
  redirectHref?: string;
}

/** Properti untuk komponen sidebar detail komunitas. */
export interface CommunitySidebarProps {
  community: CommunityDetail;
}

/** Contoh data statis komunitas untuk fallback/pratinjau lokal. */
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

/**
 * Mengembalikan data contoh detail komunitas dengan ID sesuai parameter.
 *
 * @param id - ID komunitas yang diminta.
 * @returns Objek CommunityDetail contoh dengan ID tersebut.
 */
export function getSampleCommunity(id: string): CommunityDetail {
  return { ...sampleCommunity, id };
}
