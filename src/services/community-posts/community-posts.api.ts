import { apiFetch } from "@/lib/api/client";
import type { ApiEnvelope } from "@/lib/api/types";
import type {
  CommunityPostDto,
  CreateCommunityPostPayload,
  UpdateCommunityPostPayload,
  RepostStatusDto,      
  UserRepostItemDto,
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
 * Toggle repost postingan forum (POST /proxy/forum-posts/:postId/repost).
 */
export async function toggleForumPostRepost(
  postId: string
): Promise<ApiEnvelope<RepostStatusDto>> {
  return apiFetch<RepostStatusDto>(
    `/proxy/forum-posts/${encodeURIComponent(postId)}/repost`,
    { method: "POST", source: "mock" }
  );
}

/**
 * Ambil status repost postingan (GET /proxy/forum-posts/:postId/repost/status).
 */
export async function getForumPostRepostStatus(
  postId: string
): Promise<ApiEnvelope<RepostStatusDto>> {
  return apiFetch<RepostStatusDto>(
    `/proxy/forum-posts/${encodeURIComponent(postId)}/repost/status`,
    { method: "GET", source: "mock" }
  );
}

/**
 * Ambil daftar repost milik user (GET /proxy/profiles/:userId/reposts).
 * Gunakan userId="me" untuk user yang sedang login.
 */
export async function listUserReposts(
  userId: string
): Promise<ApiEnvelope<UserRepostItemDto[]>> {
  return apiFetch<UserRepostItemDto[]>(
    `/proxy/profiles/${encodeURIComponent(userId)}/reposts`,
    { method: "GET", source: "mock" }
  );
}

export const communityPostsApi = {
  createCommunityPost,
  listCommunityPosts,
  getCommunityPost,
  getForumPostDetail,
  updateCommunityPost,
  deleteCommunityPost,
  toggleForumPostRepost,       
  getForumPostRepostStatus,   
  listUserReposts,
};
