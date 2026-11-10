import { apiFetch } from "@/lib/api/client";
import type { ApiEnvelope } from "@/lib/api/types";
import { aiAssist } from "@/services/ai/ai.api";
import type {
  Article,
  ArticleComment,
  ArticleDetailData,
  ArticleFeedItem,
  CreateArticlePayload,
  CreateCommentPayload,
  ListArticleFeedParams,
  ListMyArticlesParams,
  MyArticlesListData,
  ToggleBookmarkResult,
  ToggleLikeResult,
  UpdateArticlePayload,
  UploadedArticleImageData,
} from "./articles.types";

/**
 * Membuat draft artikel baru (POST /proxy/articles).
 */
export async function createArticle(
  payload: CreateArticlePayload = {}
): Promise<ApiEnvelope<Article>> {
  return apiFetch<Article>("/proxy/articles", {
    method: "POST",
    body: payload,
  });
}

/**
 * Mengambil detail artikel berdasarkan ID (GET /proxy/articles/:id).
 */
export async function getArticle(id: string): Promise<ApiEnvelope<Article>> {
  return apiFetch<Article>(`/proxy/articles/${encodeURIComponent(id)}`, {
    method: "GET",
  });
}

/**
 * Memperbarui sebagian data artikel milik sendiri (PATCH /proxy/articles/:id).
 */
export async function updateArticle(
  id: string,
  payload: UpdateArticlePayload
): Promise<ApiEnvelope<Article>> {
  return apiFetch<Article>(`/proxy/articles/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: payload,
  });
}

/**
 * Mempublikasikan artikel milik sendiri (POST /proxy/articles/:id/publish).
 */
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

/**
 * Membatalkan publikasi artikel milik sendiri (POST /proxy/articles/:id/unpublish).
 */
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

/**
 * Mengambil daftar artikel milik pengguna yang sedang login (GET /proxy/articles/me).
 */
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

/**
 * Mengunggah file gambar artikel via multipart/form-data (POST /proxy/uploads/article-image).
 */
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
  listMyArticles,
  getArticleFeed,
  toggleArticleLike,
  toggleArticleBookmark,
  createArticleComment,
  toggleProfileFollow,
  uploadArticleImage,
  aiAssist,
};

/**
 * Mengambil detail artikel publik lengkap (GET /proxy/articles/:id).
 */
export async function getArticleDetail(
  id: string,
  options?: { source?: "backend" | "mock" }
): Promise<ApiEnvelope<ArticleDetailData>> {
  return apiFetch<ArticleDetailData>(`/proxy/articles/${encodeURIComponent(id)}`, {
    method: "GET",
    source: options?.source ?? "mock",
  });
}

/**
 * Toggle suka artikel (POST /proxy/articles/:id/like).
 */
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

/**
 * Toggle bookmark artikel (POST /proxy/articles/:id/bookmark).
 */
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

/**
 * Kirim komentar baru pada artikel (POST /proxy/articles/:id/comments).
 */
export async function createArticleComment(
  id: string,
  payload: CreateCommentPayload
): Promise<ApiEnvelope<ArticleComment>> {
  return apiFetch<ArticleComment>(
    `/proxy/articles/${encodeURIComponent(id)}/comments`,
    {
      method: "POST",
      body: payload,
      source: "mock",
    }
  );
}

/**
 * Toggle follow profil penulis (POST /proxy/profiles/:id/follow).
 */
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

/**
 * Mengambil daftar feed artikel publik untuk halaman Home dan Discover (GET /proxy/articles/feed).
 * Default source menggunakan 'mock' jika backend belum menyediakan feed publik.
 */
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

