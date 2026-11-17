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
  faculty?: string | null;
  major?: string | null;
  generation?: string | null;
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

export interface DeleteCommunityPostVariables {
  communityId: string;
  postId: string;
}

/**
 * Tipe data komentar postingan forum (mock server: forum_comments).
 */
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

export interface CreateForumCommentPayload {
  content: string;
  parentId?: string | null;
}

export interface UpdateForumCommentPayload {
  content: string;
}

export interface CreateForumCommentVariables {
  postId: string;
  payload: CreateForumCommentPayload;
}

export interface UpdateForumCommentVariables {
  postId: string;
  commentId: string;
  payload: UpdateForumCommentPayload;
}

export interface DeleteForumCommentVariables {
  postId: string;
  commentId: string;
}

/**
 * Identitas penulis/viewer tetap mock (lihat docs/integrasi-community-posts/README.md
 * bagian "Identitas Penulis di Mock"). Dipakai untuk cek kepemilikan postingan di UI.
 */
export const MOCK_VIEWER_ID = "10000000-0000-4000-8000-000000000001";
