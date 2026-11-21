/**
 * Informasi penulis postingan forum/komunitas (mock server: forum_posts).
 * Ditulis manual karena endpoint mock belum tercakup OpenAPI schema backend.
 */
export interface CommunityPostAuthor {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  avatarColor: string;
  username: string | null;
  faculty?: string | null;
  major?: string | null;
  generation?: string | null;
}

/** Data postingan forum atau komunitas. */
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
  isReposted: boolean;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
  author: CommunityPostAuthor;
}

/** Payload untuk membuat postingan komunitas/forum baru. */
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
 * Payload pembaruan parsial postingan: field yang tidak dikirim tidak diubah;
 * null eksplisit untuk menghapus coverImageUrl / imageCaption / flair.
 */
export type UpdateCommunityPostPayload = Partial<CreateCommunityPostPayload>;

export interface UpdateCommunityPostVariables {
  communityId: string;
  postId: string;
  payload: UpdateCommunityPostPayload;
}

export interface DeleteCommunityPostVariables {
  communityId: string;
  postId: string;
}

export interface RepostStatusDto {
  isReposted: boolean;
  repostsCount: number;
}

export interface UserRepostItemDto {
  repostId: string;
  repostedAt: string;
  post: CommunityPostDto;
}

export interface PostLikeStatusDto {
  isLiked: boolean;
  likesCount: number;
  score: number;
}

/** Informasi penulis komentar postingan forum (mock server: forum_comments). */
export interface ForumCommentAuthor {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  avatarColor?: string;
  username: string | null;
  faculty?: string | null;
  major?: string | null;
  generation?: string | null;
}

/** Data komentar atau balasan pada postingan forum (mock server: forum_comments). */
export interface ForumCommentDto {
  id: string;
  postId: string;
  authorId: string;
  parentId: string | null;
  content: string;
  score: number;
  userVote: 1 | -1 | 0;
  createdAt: string;
  updatedAt: string;
  author: ForumCommentAuthor;
}

/** Payload untuk menambahkan komentar atau balasan baru pada postingan forum. */
export interface CreateForumCommentPayload {
  content: string;
  parentId?: string | null;
}

/** Payload untuk memperbarui isi komentar pada postingan forum. */
export interface UpdateForumCommentPayload {
  content: string;
}

/** Variabel mutasi untuk menambahkan komentar pada postingan forum. */
export interface CreateForumCommentVariables {
  postId: string;
  payload: CreateForumCommentPayload;
}

/** Variabel mutasi untuk memperbarui komentar pada postingan forum. */
export interface UpdateForumCommentVariables {
  postId: string;
  commentId: string;
  payload: UpdateForumCommentPayload;
}

/** Variabel mutasi untuk menghapus komentar pada postingan forum. */
export interface DeleteForumCommentVariables {
  postId: string;
  commentId: string;
}

/** Variabel mutasi untuk memperbarui postingan forum berdasarkan ID postingan. */
export interface UpdateForumPostVariables {
  postId: string;
  payload: UpdateCommunityPostPayload;
}

/** Payload untuk membuat komunitas atau forum baru. */
export interface CreateCommunityPayload {
  name: string;
  description: string;
  category?: string;
  visibility?: "publik" | "terbatas" | "privat";
  bannerUrl?: string | null;
  avatarColor?: string;
}

/** Data item komunitas atau forum. */
export interface CommunityItemDto {
  id: string;
  creator_id?: string;
  name: string;
  slug: string;
  description: string;
  category?: string;
  visibility?: "publik" | "terbatas" | "privat";
  avatar_url?: string | null;
  avatar_color?: string;
  banner_url?: string | null;
  member_count?: number;
  post_count?: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Identitas penulis/viewer tetap mock (lihat docs/integrasi-community-posts/README.md
 * bagian "Identitas Penulis di Mock"). Dipakai untuk cek kepemilikan postingan di UI.
 */
export const MOCK_VIEWER_ID = "10000000-0000-4000-8000-000000000001";
