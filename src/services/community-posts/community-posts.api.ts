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

export const communityPostsApi = {
  createCommunityPost,
  listCommunityPosts,
  getCommunityPost,
  updateCommunityPost,
  deleteCommunityPost,
};
