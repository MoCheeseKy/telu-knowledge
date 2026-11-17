import { apiFetch } from "@/lib/api/client";
import type { ApiEnvelope } from "@/lib/api/types";
import type {
  ArticleComment,
  CreateCommentPayload,
} from "@/services/articles/articles.types";
import type {
  ArticleCommentsSource,
  UpdateCommentPayload,
} from "./article-comments.types";

// Ganti ke "backend" kalau endpoint NestJS sudah ada.
const DEFAULT_SOURCE: ArticleCommentsSource = "mock";

const base = (articleId: string) =>
  `/proxy/articles/${encodeURIComponent(articleId)}/comments`;

/** Daftar komentar artikel (GET /proxy/articles/:id/comments). */
export async function listArticleComments(
  articleId: string,
  source: ArticleCommentsSource = DEFAULT_SOURCE
): Promise<ApiEnvelope<{ comments: ArticleComment[] }>> {
  return apiFetch<{ comments: ArticleComment[] }>(base(articleId), { method: "GET", source });
}

/** Tambah komentar / balasan (POST /proxy/articles/:id/comments). */
export async function createArticleComment(
  articleId: string,
  payload: CreateCommentPayload,
  source: ArticleCommentsSource = DEFAULT_SOURCE
): Promise<ApiEnvelope<ArticleComment>> {
  return apiFetch<ArticleComment>(base(articleId), {
    method: "POST",
    body: payload,
    source,
  });
}

/** Ubah isi komentar milik sendiri (PATCH /proxy/articles/:id/comments/:commentId). */
export async function updateArticleComment(
  articleId: string,
  commentId: string,
  payload: UpdateCommentPayload,
  source: ArticleCommentsSource = DEFAULT_SOURCE
): Promise<ApiEnvelope<ArticleComment>> {
  return apiFetch<ArticleComment>(
    `${base(articleId)}/${encodeURIComponent(commentId)}`,
    { method: "PATCH", body: payload, source }
  );
}

/** Hapus komentar milik sendiri (DELETE /proxy/articles/:id/comments/:commentId). */
export async function deleteArticleComment(
  articleId: string,
  commentId: string,
  source: ArticleCommentsSource = DEFAULT_SOURCE
): Promise<ApiEnvelope<null>> {
  return apiFetch<null>(`${base(articleId)}/${encodeURIComponent(commentId)}`, {
    method: "DELETE",
    source,
  });
}

export const articleCommentsApi = {
  listArticleComments,
  createArticleComment,
  updateArticleComment,
  deleteArticleComment,
};