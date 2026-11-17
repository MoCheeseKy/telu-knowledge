import { apiFetch } from "@/lib/api/client";
import type { ApiEnvelope } from "@/lib/api/types";
import type {
  ArticleRepostsSource,
  RepostedArticleItem,
  ToggleRepostResult,
} from "./article-reposts.types";

// Ganti ke "backend" kalau endpoint NestJS sudah ada.
const DEFAULT_SOURCE: ArticleRepostsSource = "mock";

/** Toggle repost artikel (POST /proxy/articles/:id/repost). */
export async function toggleArticleRepost(
  articleId: string,
  source: ArticleRepostsSource = DEFAULT_SOURCE
): Promise<ApiEnvelope<ToggleRepostResult>> {
  return apiFetch<ToggleRepostResult>(
    `/proxy/articles/${encodeURIComponent(articleId)}/repost`,
    { method: "POST", source }
  );
}

/** Daftar artikel yang di-repost user (GET /proxy/profiles/:id/reposts). */
export async function listProfileReposts(
  profileId: string,
  source: ArticleRepostsSource = DEFAULT_SOURCE
): Promise<ApiEnvelope<RepostedArticleItem[]>> {
  return apiFetch<RepostedArticleItem[]>(
    `/proxy/profiles/${encodeURIComponent(profileId)}/reposts`,
    { method: "GET", source }
  );
}

export const articleRepostsApi = { toggleArticleRepost, listProfileReposts };