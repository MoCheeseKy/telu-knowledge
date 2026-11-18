import { apiFetch } from "@/lib/api/client";
import type { ApiEnvelope } from "@/lib/api/api.types";
import type {
  ArticleRepostsSource,
  RepostedArticleItem,
  ToggleRepostResult,
} from "./article-reposts.types";

// Ganti ke "backend" kalau endpoint NestJS sudah ada.
const DEFAULT_SOURCE: ArticleRepostsSource = "mock";

/**
 * Toggle repost artikel (POST /proxy/articles/:id/repost).
 *
 * @param articleId - ID artikel yang di-repost atau dibatalkan repost-nya.
 * @param source - Sumber data API (`mock` atau `backend`).
 * @returns Envelope berisi status dan jumlah repost terbaru.
 */
export async function toggleArticleRepost(
  articleId: string,
  source: ArticleRepostsSource = DEFAULT_SOURCE
): Promise<ApiEnvelope<ToggleRepostResult>> {
  return apiFetch<ToggleRepostResult>(
    `/proxy/articles/${encodeURIComponent(articleId)}/repost`,
    { method: "POST", source }
  );
}

/**
 * Mengambil daftar artikel yang di-repost oleh pengguna (GET /proxy/profiles/:id/reposts).
 *
 * @param profileId - ID profil pengguna target.
 * @param source - Sumber data API (`mock` atau `backend`).
 * @returns Envelope berisi daftar artikel yang di-repost.
 */
export async function listProfileReposts(
  profileId: string,
  source: ArticleRepostsSource = DEFAULT_SOURCE
): Promise<ApiEnvelope<RepostedArticleItem[]>> {
  return apiFetch<RepostedArticleItem[]>(
    `/proxy/profiles/${encodeURIComponent(profileId)}/reposts`,
    { method: "GET", source }
  );
}

/** Kumpulan service API untuk fitur repost artikel. */
export const articleRepostsApi = { toggleArticleRepost, listProfileReposts };