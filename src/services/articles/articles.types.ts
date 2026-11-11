import type { components, operations } from "@/lib/api/schema";

/**
 * Tipe data artikel yang diturunkan langsung dari OpenAPI schema.d.ts
 * sebagai satu-satunya sumber kebenaran (Single Source of Truth).
 */
export type Article = components["schemas"]["ArticleDto"];
export type ArticleSummary = components["schemas"]["ArticleSummaryDto"];
export type ArticleAuthor = components["schemas"]["ArticleAuthorDto"];
export type ArticleStatus = Article["status"];
export type MyArticlesListData = components["schemas"]["MyArticlesListDataDto"];
export type UploadedArticleImageData =
  components["schemas"]["UploadedArticleImageDataDto"];

/**
 * Struktur dokumen JSON Tiptap untuk editor artikel.
 */
export interface TiptapMark {
  type: string;
  attrs?: Record<string, unknown>;
}

export interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: TiptapMark[];
  text?: string;
}

export interface TiptapDoc {
  type: "doc";
  content?: TiptapNode[];
  [key: string]: unknown;
}

type RawCreateArticleDto = components["schemas"]["CreateArticleDto"];
type RawUpdateArticleDto = components["schemas"]["UpdateArticleDto"];

export type CreateArticlePayload = Omit<
  RawCreateArticleDto,
  "subtitle" | "coverImageUrl" | "content"
> & {
  subtitle?: string | null;
  coverImageUrl?: string | null;
  content?: TiptapDoc | Record<string, unknown>;
};

export type UpdateArticlePayload = Omit<
  RawUpdateArticleDto,
  "subtitle" | "coverImageUrl" | "content"
> & {
  subtitle?: string | null;
  coverImageUrl?: string | null;
  content?: TiptapDoc | Record<string, unknown>;
};

export interface UpdateArticleVariables {
  id: string;
  payload: UpdateArticlePayload;
}

export type ListMyArticlesParams = NonNullable<
  operations["ArticlesController_getMyArticles"]["parameters"]["query"]
>;

export interface ArticleFeedAuthor {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  username?: string | null;
  avatarColor?: string;
}

export interface ArticleFeedStats {
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  bookmarksCount: number;
}

export interface ArticleFeedItem {
  id: string;
  title: string;
  subtitle: string | null;
  coverImageUrl: string | null;
  excerpt: string;
  readingTimeMinutes: number;
  status: "draft" | "published";
  slug: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  topic: string;
  topicSlug?: string | null;
  author: ArticleFeedAuthor;
  stats: ArticleFeedStats;
  isLiked: boolean;
  isBookmarked: boolean;
}

export interface ListArticleFeedParams {
  topic?: string;
  limit?: number;
  source?: "backend" | "mock";
}

export interface ArticleCommentAuthor {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  avatarColor?: string;
  username?: string | null;
  faculty?: string | null;
  major?: string | null;
}

export interface ArticleComment {
  id: string;
  articleId: string;
  authorId: string;
  parentId: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: ArticleCommentAuthor;
}

export interface ArticleDetailAuthor {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  username?: string | null;
  avatarColor?: string;
  bio?: string;
  faculty?: string | null;
  major?: string | null;
  generation?: string | null;
  website?: string | null;
  github?: string | null;
  linkedin?: string | null;
  isFollowing: boolean;
}

export interface ArticleDetailData {
  id: string;
  title: string;
  subtitle: string | null;
  coverImageUrl: string | null;
  content: TiptapDoc | Record<string, unknown>;
  excerpt: string;
  readingTimeMinutes: number;
  status: "draft" | "published";
  slug: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  topic: string;
  topicSlug?: string | null;
  author: ArticleDetailAuthor;
  stats: ArticleFeedStats;
  isLiked: boolean;
  isBookmarked: boolean;
  comments: ArticleComment[];
}

export interface ToggleLikeResult {
  isLiked: boolean;
  likesCount: number;
}

export interface ToggleBookmarkResult {
  isBookmarked: boolean;
  bookmarksCount: number;
}

export interface CreateCommentPayload {
  content: string;
  parent_id?: string | null;
}


