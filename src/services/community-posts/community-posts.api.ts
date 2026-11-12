import { apiFetch } from "@/lib/api/client";
import type { ApiEnvelope } from "@/lib/api/types";
import type {
  CommunityPostDto,
  CreateCommunityPostPayload,
  UpdateCommunityPostPayload,
} from "./community-posts.types";

/**
 * Membuat postingan baru pada komunitas (POST /proxy/communities/:id/posts).
 * Default source 'mock' karena backend NestJS belum menyediakan endpoint ini.
 */
export async function createCommunityPost(
  communityId: string,
  payload: CreateCommunityPostPayload
): Promise<ApiEnvelope<CommunityPostDto>> {
  return apiFetch<CommunityPostDto>(
    `/proxy/communities/${encodeURIComponent(communityId)}/posts`,
    {
      method: "POST",
      body: payload,
      source: "mock",
    }
  );
}

/**
 * Mengambil daftar postingan komunitas, terbaru di atas
 * (GET /proxy/communities/:id/posts).
 */
export async function listCommunityPosts(
  communityId: string
): Promise<ApiEnvelope<CommunityPostDto[]>> {
  return apiFetch<CommunityPostDto[]>(
    `/proxy/communities/${encodeURIComponent(communityId)}/posts`,
    {
      method: "GET",
      source: "mock",
    }
  );
}

/**
 * Mengambil detail postingan by ID saja, tanpa communityId
 * (GET /proxy/forum-posts/:postId) — dipakai halaman /discussion-forums/[id].
 * Konten post saja; komentar/like/save tidak termasuk cakupan endpoint ini.
 */
export async function getForumPostDetail(
  postId: string
): Promise<ApiEnvelope<CommunityPostDto>> {
  return apiFetch<CommunityPostDto>(
    `/proxy/forum-posts/${encodeURIComponent(postId)}`,
    {
      method: "GET",
      source: "mock",
    }
  );
}

/**
 * Mengambil detail postingan komunitas (GET /proxy/communities/:id/posts/:postId).
 */
export async function getCommunityPost(
  communityId: string,
  postId: string
): Promise<ApiEnvelope<CommunityPostDto>> {
  return apiFetch<CommunityPostDto>(
    `/proxy/communities/${encodeURIComponent(communityId)}/posts/${encodeURIComponent(
      postId
    )}`,
    {
      method: "GET",
      source: "mock",
    }
  );
}

/**
 * Menyunting postingan milik sendiri (PATCH /proxy/communities/:id/posts/:postId).
 * Patch parsial: hanya field yang dikirim yang diubah.
 */
export async function updateCommunityPost(
  communityId: string,
  postId: string,
  payload: UpdateCommunityPostPayload
): Promise<ApiEnvelope<CommunityPostDto>> {
  return apiFetch<CommunityPostDto>(
    `/proxy/communities/${encodeURIComponent(communityId)}/posts/${encodeURIComponent(
      postId
    )}`,
    {
      method: "PATCH",
      body: payload,
      source: "mock",
    }
  );
}

/**
 * Menghapus postingan milik sendiri (DELETE /proxy/communities/:id/posts/:postId).
 * Seluruh data turunan (vote, simpan, repost, komentar) ikut dihapus oleh server.
 */
export async function deleteCommunityPost(
  communityId: string,
  postId: string
): Promise<ApiEnvelope<null>> {
  return apiFetch<null>(
    `/proxy/communities/${encodeURIComponent(communityId)}/posts/${encodeURIComponent(
      postId
    )}`,
    {
      method: "DELETE",
      source: "mock",
    }
  );
}

/**
 * Mengambil daftar seluruh postingan forum dari seluruh komunitas
 * (GET /proxy/forum-posts) — dipakai untuk feed /discussion-forums.
 */
export async function listAllForumPosts(): Promise<
  ApiEnvelope<CommunityPostDto[]>
> {
  return apiFetch<CommunityPostDto[]>("/proxy/forum-posts", {
    method: "GET",
    source: "mock",
  });
}

/**
 * Menghapus postingan forum by ID saja (DELETE /proxy/forum-posts/:postId).
 */
export async function deleteForumPost(
  postId: string
): Promise<ApiEnvelope<null>> {
  return apiFetch<null>(
    `/proxy/forum-posts/${encodeURIComponent(postId)}`,
    {
      method: "DELETE",
      source: "mock",
    }
  );
}

/**
 * Menyunting postingan forum by ID (PATCH /proxy/forum-posts/:postId).
 */
export async function updateForumPost(
  postId: string,
  payload: UpdateCommunityPostPayload
): Promise<ApiEnvelope<CommunityPostDto>> {
  return apiFetch<CommunityPostDto>(
    `/proxy/forum-posts/${encodeURIComponent(postId)}`,
    {
      method: "PATCH",
      body: payload,
      source: "mock",
    }
  );
}

export interface CreateCommunityPayload {
  name: string;
  description: string;
  category?: string;
  visibility?: "publik" | "terbatas" | "privat";
  bannerUrl?: string | null;
  avatarColor?: string;
}

export interface CommunityItemDto {
  id: string;
  creator_id?: string;
  name: string;
  slug: string;
  description: string;
  category?: string;
  visibility?: "publik" | "terbatas" | "privat";
  avatar_url?: string | null;
  avatar_color?: string;
  banner_url?: string | null;
  member_count?: number;
  post_count?: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Membuat komunitas / forum baru (POST /proxy/communities).
 */
export async function createCommunity(
  payload: CreateCommunityPayload
): Promise<ApiEnvelope<CommunityItemDto>> {
  return apiFetch<CommunityItemDto>("/proxy/communities", {
    method: "POST",
    body: payload,
    source: "mock",
  });
}

/**
 * Mengambil daftar seluruh komunitas (GET /proxy/communities).
 */
export async function listCommunities(): Promise<
  ApiEnvelope<CommunityItemDto[]>
> {
  return apiFetch<CommunityItemDto[]>("/proxy/communities", {
    method: "GET",
    source: "mock",
  });
}

export const communityPostsApi = {
  createCommunityPost,
  listCommunityPosts,
  listAllForumPosts,
  getCommunityPost,
  getForumPostDetail,
  updateCommunityPost,
  updateForumPost,
  deleteCommunityPost,
  deleteForumPost,
  createCommunity,
  listCommunities,
};
