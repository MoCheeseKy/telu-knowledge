import { apiFetch } from "@/lib/api/client";
import type { ApiEnvelope } from "@/lib/api/api.types";
import type {
  CommunityPostDto,
  CreateCommunityPostPayload,
  UpdateCommunityPostPayload,
  ForumCommentDto,
  CreateForumCommentPayload,
  UpdateForumCommentPayload,
  RepostStatusDto,
  UserRepostItemDto,
  CreateCommunityPayload,
  CommunityItemDto,
  PostLikeStatusDto,
} from "./community-posts.types";

/**
 * Membuat postingan baru pada suatu komunitas (POST /proxy/communities/:communityId/posts).
 *
 * @param communityId - ID komunitas target.
 * @param payload - Data postingan baru.
 * @returns Envelope berisi data postingan yang baru dibuat.
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
 * Mengambil daftar postingan dalam suatu komunitas (GET /proxy/communities/:communityId/posts).
 *
 * @param communityId - ID komunitas target.
 * @returns Envelope berisi daftar postingan komunitas.
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
 * Mengambil detail postingan forum berdasarkan ID (GET /proxy/forum-posts/:postId).
 *
 * @param postId - ID postingan forum.
 * @returns Envelope berisi detail postingan.
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
 * Mengambil detail postingan dalam suatu komunitas (GET /proxy/communities/:communityId/posts/:postId).
 *
 * @param communityId - ID komunitas target.
 * @param postId - ID postingan target.
 * @returns Envelope berisi detail postingan komunitas.
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
 * Memperbarui postingan milik sendiri dalam suatu komunitas (PATCH /proxy/communities/:communityId/posts/:postId).
 *
 * @param communityId - ID komunitas target.
 * @param postId - ID postingan yang diperbarui.
 * @param payload - Perubahan data postingan.
 * @returns Envelope berisi data postingan yang telah diperbarui.
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
 * Menghapus postingan milik sendiri dalam suatu komunitas (DELETE /proxy/communities/:communityId/posts/:postId).
 *
 * @param communityId - ID komunitas target.
 * @param postId - ID postingan yang dihapus.
 * @returns Envelope konfirmasi penghapusan.
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
 * Mengambil seluruh daftar postingan forum (GET /proxy/forum-posts).
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
 * Menghapus postingan forum berdasarkan ID (DELETE /proxy/forum-posts/:postId).
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
 * Memperbarui postingan forum berdasarkan ID (PATCH /proxy/forum-posts/:postId).
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

/**
 * Mengambil daftar komentar pada postingan forum (GET /proxy/forum-posts/:postId/comments).
 */
export async function getForumPostComments(
  postId: string
): Promise<ApiEnvelope<ForumCommentDto[]>> {
  return apiFetch<ForumCommentDto[]>(
    `/proxy/forum-posts/${encodeURIComponent(postId)}/comments`,
    {
      method: "GET",
      source: "mock",
    }
  );
}

/**
 * Membuat komentar atau balasan baru pada postingan forum (POST /proxy/forum-posts/:postId/comments).
 */
export async function createForumComment(
  postId: string,
  payload: CreateForumCommentPayload
): Promise<ApiEnvelope<ForumCommentDto>> {
  return apiFetch<ForumCommentDto>(
    `/proxy/forum-posts/${encodeURIComponent(postId)}/comments`,
    {
      method: "POST",
      body: payload,
      source: "mock",
    }
  );
}

/**
 * Memperbarui isi komentar milik sendiri (PATCH /proxy/forum-posts/:postId/comments/:commentId).
 */
export async function updateForumComment(
  postId: string,
  commentId: string,
  payload: UpdateForumCommentPayload
): Promise<ApiEnvelope<ForumCommentDto>> {
  return apiFetch<ForumCommentDto>(
    `/proxy/forum-posts/${encodeURIComponent(postId)}/comments/${encodeURIComponent(
      commentId
    )}`,
    {
      method: "PATCH",
      body: payload,
      source: "mock",
    }
  );
}

/**
 * Menghapus komentar milik sendiri (DELETE /proxy/forum-posts/:postId/comments/:commentId).
 */
export async function deleteForumComment(
  postId: string,
  commentId: string
): Promise<ApiEnvelope<null>> {
  return apiFetch<null>(
    `/proxy/forum-posts/${encodeURIComponent(postId)}/comments/${encodeURIComponent(
      commentId
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

/**
 * Membuat komunitas/forum baru (POST /proxy/communities).
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
 * Mengambil daftar seluruh komunitas/forum (GET /proxy/communities).
 */
export async function listCommunities(): Promise<
  ApiEnvelope<CommunityItemDto[]>
> {
  return apiFetch<CommunityItemDto[]>("/proxy/communities", {
    method: "GET",
    source: "mock",
  });
}

export async function toggleForumPostLike(
  postId: string
): Promise<ApiEnvelope<PostLikeStatusDto>> {
  return apiFetch<PostLikeStatusDto>(
    `/proxy/forum-posts/${encodeURIComponent(postId)}/like`,
    { method: "POST", source: "mock" }
  );
}

/** Kumpulan service API untuk postingan, komentar, repost, dan daftar komunitas/forum. */
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
  getForumPostComments,
  createForumComment,
  updateForumComment,
  deleteForumComment,
  toggleForumPostRepost,
  getForumPostRepostStatus,
  listUserReposts,
  createCommunity,
  listCommunities,
  toggleForumPostLike,
};
