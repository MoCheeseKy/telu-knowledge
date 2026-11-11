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
