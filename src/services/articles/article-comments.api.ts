import { apiFetch } from "@/lib/api/client";
import type { ApiEnvelope } from "@/lib/api/api.types";
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

/**
 * Mengambil daftar komentar artikel (GET /proxy/articles/:id/comments).
 *
 * @param articleId - ID artikel target.
 * @param source - Sumber data API (`mock` atau `backend`).
 * @returns Envelope berisi daftar komentar artikel.
 */
export async function listArticleComments(
  articleId: string,
  source: ArticleCommentsSource = DEFAULT_SOURCE
): Promise<ApiEnvelope<{ comments: ArticleComment[] }>> {
  return apiFetch<{ comments: ArticleComment[] }>(base(articleId), { method: "GET", source });
}

/**
 * Menambahkan komentar atau balasan baru pada artikel (POST /proxy/articles/:id/comments).
 *
 * @param articleId - ID artikel target.
 * @param payload - Konten komentar dan opsional `parent_id` untuk balasan.
 * @param source - Sumber data API (`mock` atau `backend`).
 * @returns Envelope berisi data komentar yang baru dibuat.
 */
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

/**
 * Mengubah isi komentar milik sendiri (PATCH /proxy/articles/:id/comments/:commentId).
 *
 * @param articleId - ID artikel target.
 * @param commentId - ID komentar yang diperbarui.
 * @param payload - Konten komentar terbaru.
 * @param source - Sumber data API (`mock` atau `backend`).
 * @returns Envelope berisi data komentar yang telah diperbarui.
 */
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

/**
 * Menghapus komentar milik sendiri (DELETE /proxy/articles/:id/comments/:commentId).
 *
 * @param articleId - ID artikel target.
 * @param commentId - ID komentar yang akan dihapus.
 * @param source - Sumber data API (`mock` atau `backend`).
 * @returns Envelope konfirmasi penghapusan.
 */
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

/** Kumpulan service API untuk pengelolaan komentar artikel. */
export const articleCommentsApi = {
  listArticleComments,
  createArticleComment,
  updateArticleComment,
  deleteArticleComment,
};