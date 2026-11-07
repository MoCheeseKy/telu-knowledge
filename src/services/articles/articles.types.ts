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
