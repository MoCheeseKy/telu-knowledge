/**
 * Kontrak data postingan forum/komunitas (mock server: forum_posts).
 * Ditulis manual karena endpoint mock belum tercakup OpenAPI schema backend.
 */

export interface CommunityPostAuthor {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  avatarColor: string;
  username: string | null;
}

export interface CommunityPostDto {
  id: string;
  communityId: string;
  communityName: string | null;
  authorId: string;
  title: string;
  content: string;
  callout: string | null;
  coverImageUrl: string | null;
  imageCaption: string | null;
  flair: string | null;
  tags: string[];
  status: string;
  isHighlighted: boolean;
  score: number;
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
  author: CommunityPostAuthor;
}

export interface CreateCommunityPostPayload {
  title: string;
  content: string;
  flair?: string | null;
  tags?: string[];
  coverImageUrl?: string | null;
  imageCaption?: string | null;
}

export interface CreateCommunityPostVariables {
  communityId: string;
  payload: CreateCommunityPostPayload;
}

/**
 * Patch parsial: field yang tidak dikirim tidak diubah;
 * null eksplisit untuk menghapus coverImageUrl / imageCaption / flair.
 */
export type UpdateCommunityPostPayload = Partial<CreateCommunityPostPayload>;

export interface UpdateCommunityPostVariables {
  communityId: string;
  postId: string;
  payload: UpdateCommunityPostPayload;
}

/**
 * Identitas penulis/viewer tetap mock (lihat docs/integrasi-community-posts/README.md
 * bagian "Identitas Penulis di Mock"). Dipakai untuk cek kepemilikan postingan di UI.
 */
export const MOCK_VIEWER_ID = "10000000-0000-4000-8000-000000000001";
