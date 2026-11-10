import { apiFetch } from "@/lib/api/client";
import type { ApiEnvelope } from "@/lib/api/types";
import { aiAssist } from "@/services/ai/ai.api";
import type {
  Article,
  CreateArticlePayload,
  ListMyArticlesParams,
  MyArticlesListData,
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
  updateArticle,
  publishArticle,
  unpublishArticle,
  listMyArticles,
  uploadArticleImage,
  aiAssist,
};

