import { apiFetch } from "@/lib/api/client";
import type { ApiEnvelope } from "@/lib/api/types";
import { aiAssist } from "@/services/ai/ai.api";
import type {
  Article,
  ArticleDetailData,
  ArticleFeedItem,
  CreateArticlePayload,
  ListArticleFeedParams,
  ListMyArticlesParams,
  MyArticlesListData,
  ToggleBookmarkResult,
  ToggleLikeResult,
  UpdateArticlePayload,
  UploadedArticleImageData,
} from "./articles.types";

export async function createArticle(
  payload: CreateArticlePayload = {}
): Promise<ApiEnvelope<Article>> {
  return apiFetch<Article>("/proxy/articles", {
    method: "POST",
    body: payload,
  });
}

export async function getArticle(id: string): Promise<ApiEnvelope<Article>> {
  return apiFetch<Article>(`/proxy/articles/${encodeURIComponent(id)}`, {
    method: "GET",
  });
}

export async function updateArticle(
  id: string,
  payload: UpdateArticlePayload
): Promise<ApiEnvelope<Article>> {
  return apiFetch<Article>(`/proxy/articles/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: payload,
  });
}

export async function publishArticle(
  id: string
): Promise<ApiEnvelope<Article>> {
  return apiFetch<Article>(
    `/proxy/articles/${encodeURIComponent(id)}/publish`,
    {
      method: "POST",
    }
  );
}

export async function unpublishArticle(
  id: string
): Promise<ApiEnvelope<Article>> {
  return apiFetch<Article>(
    `/proxy/articles/${encodeURIComponent(id)}/unpublish`,
    {
      method: "POST",
    }
  );
}

export async function deleteArticle(
  id: string
): Promise<ApiEnvelope<null>> {
  return apiFetch<null>(`/proxy/articles/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function listMyArticles(
  params?: ListMyArticlesParams
): Promise<ApiEnvelope<MyArticlesListData>> {
  const searchParams = new URLSearchParams();
  if (params?.status) {
    searchParams.set("status", params.status);
  }
  if (typeof params?.limit === "number") {
    searchParams.set("limit", String(params.limit));
  }
  if (params?.cursor) {
    searchParams.set("cursor", params.cursor);
  }

  const queryString = searchParams.toString();
  const path = queryString
    ? `/proxy/articles/me?${queryString}`
    : "/proxy/articles/me";

  return apiFetch<MyArticlesListData>(path, {
    method: "GET",
  });
}

export async function uploadArticleImage(
  file: File
): Promise<ApiEnvelope<UploadedArticleImageData>> {
  const formData = new FormData();
  formData.append("file", file);

  return apiFetch<UploadedArticleImageData>("/proxy/uploads/article-image", {
    method: "POST",
    body: formData,
  });
}

export { aiAssist };

export const articlesApi = {
  createArticle,
  getArticle,
  getArticleDetail,
  updateArticle,
  publishArticle,
  unpublishArticle,
  deleteArticle,
  listMyArticles,
  getArticleFeed,
  toggleArticleLike,
  toggleArticleBookmark,
  toggleProfileFollow,
  uploadArticleImage,
  aiAssist,
};

export async function getArticleDetail(
  id: string,
  options?: { source?: "backend" | "mock" }
): Promise<ApiEnvelope<ArticleDetailData>> {
  return apiFetch<ArticleDetailData>(`/proxy/articles/${encodeURIComponent(id)}`, {
    method: "GET",
    source: options?.source ?? "mock",
  });
}

export async function toggleArticleLike(
  id: string
): Promise<ApiEnvelope<ToggleLikeResult>> {
  return apiFetch<ToggleLikeResult>(
    `/proxy/articles/${encodeURIComponent(id)}/like`,
    {
      method: "POST",
      source: "mock",
    }
  );
}

export async function toggleArticleBookmark(
  id: string
): Promise<ApiEnvelope<ToggleBookmarkResult>> {
  return apiFetch<ToggleBookmarkResult>(
    `/proxy/articles/${encodeURIComponent(id)}/bookmark`,
    {
      method: "POST",
      source: "mock",
    }
  );
}

export async function toggleProfileFollow(
  profileId: string
): Promise<ApiEnvelope<{ isFollowing: boolean }>> {
  return apiFetch<{ isFollowing: boolean }>(
    `/proxy/profiles/${encodeURIComponent(profileId)}/follow`,
    {
      method: "POST",
      source: "mock",
    }
  );
}

export async function getArticleFeed(
  params?: ListArticleFeedParams
): Promise<ApiEnvelope<ArticleFeedItem[]>> {
  const searchParams = new URLSearchParams();
  if (params?.topic) {
    searchParams.set("topic", params.topic);
  }
  if (typeof params?.limit === "number") {
    searchParams.set("limit", String(params.limit));
  }

  const queryString = searchParams.toString();
  const path = queryString
    ? `/proxy/articles/feed?${queryString}`
    : "/proxy/articles/feed";

  return apiFetch<ArticleFeedItem[]>(path, {
    method: "GET",
    source: params?.source ?? "mock",
  });
}

