import type { components, operations } from "@/lib/api/schema";

/**
 * Tipe data artikel lengkap yang diturunkan dari OpenAPI schema (`ArticleDto`).
 */
export type Article = components["schemas"]["ArticleDto"];

/** Ringkasan data artikel untuk tampilan daftar (`ArticleSummaryDto`). */
export type ArticleSummary = components["schemas"]["ArticleSummaryDto"];

/** Informasi penulis artikel dari OpenAPI schema (`ArticleAuthorDto`). */
export type ArticleAuthor = components["schemas"]["ArticleAuthorDto"];

/** Status publikasi artikel (`draft` atau `published`). */
export type ArticleStatus = Article["status"];

/** Struktur respons daftar artikel milik pengguna (`MyArticlesListDataDto`). */
export type MyArticlesListData = components["schemas"]["MyArticlesListDataDto"];

/** Data hasil unggah gambar artikel (`UploadedArticleImageDataDto`). */
export type UploadedArticleImageData =
  components["schemas"]["UploadedArticleImageDataDto"];

/** Representasi mark/formatting pada node teks Tiptap. */
export interface TiptapMark {
  type: string;
  attrs?: Record<string, unknown>;
}

/** Representasi satu node dalam struktur dokumen JSON Tiptap. */
export interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: TiptapMark[];
  text?: string;
}

/** Struktur root dokumen JSON Tiptap untuk editor artikel. */
export interface TiptapDoc {
  type: "doc";
  content?: TiptapNode[];
  [key: string]: unknown;
}

type RawCreateArticleDto = components["schemas"]["CreateArticleDto"];
type RawUpdateArticleDto = components["schemas"]["UpdateArticleDto"];

/** Payload untuk membuat draft artikel baru. */
export type CreateArticlePayload = Omit<
  RawCreateArticleDto,
  "subtitle" | "coverImageUrl" | "content"
> & {
  subtitle?: string | null;
  coverImageUrl?: string | null;
  content?: TiptapDoc | Record<string, unknown>;
};

/** Payload untuk memperbarui sebagian data artikel. */
export type UpdateArticlePayload = Omit<
  RawUpdateArticleDto,
  "subtitle" | "coverImageUrl" | "content"
> & {
  subtitle?: string | null;
  coverImageUrl?: string | null;
  content?: TiptapDoc | Record<string, unknown>;
};

/** Variabel mutasi untuk memperbarui artikel berdasarkan ID. */
export interface UpdateArticleVariables {
  id: string;
  payload: UpdateArticlePayload;
}

/** Parameter query untuk mengambil daftar artikel milik sendiri. */
export type ListMyArticlesParams = NonNullable<
  operations["ArticlesController_getMyArticles"]["parameters"]["query"]
>;

/** Informasi ringkas penulis pada item feed artikel. */
export interface ArticleFeedAuthor {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  username?: string | null;
  avatarColor?: string;
}

/** Statistik interaksi artikel (suka, komentar, repost, dan bookmark). */
export interface ArticleFeedStats {
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  bookmarksCount: number;
}

/** Item artikel publik pada halaman feed Home dan Discover. */
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
  isReposted?: boolean;
}

/** Parameter query untuk mengambil daftar feed artikel publik. */
export interface ListArticleFeedParams {
  topic?: string;
  limit?: number;
  source?: "backend" | "mock";
}

/** Informasi penulis pada komentar artikel. */
export interface ArticleCommentAuthor {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  avatarColor?: string;
  username?: string | null;
  faculty?: string | null;
  major?: string | null;
}

/** Data komentar atau balasan pada artikel. */
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

/** Informasi lengkap penulis pada halaman detail artikel. */
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

/** Data detail artikel publik beserta konten, statistik, dan daftar komentarnya. */
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
  isReposted?: boolean;
  comments: ArticleComment[];
}

/** Hasil respons API setelah melakukan toggle suka pada artikel. */
export interface ToggleLikeResult {
  isLiked: boolean;
  likesCount: number;
}

/** Hasil respons API setelah melakukan toggle bookmark pada artikel. */
export interface ToggleBookmarkResult {
  isBookmarked: boolean;
  bookmarksCount: number;
}

/** Payload untuk menambahkan komentar atau balasan baru pada artikel. */
export interface CreateCommentPayload {
  content: string;
  parent_id?: string | null;
}


