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

export async function listAllForumPosts(): Promise<
  ApiEnvelope<CommunityPostDto[]>
> {
  return apiFetch<CommunityPostDto[]>("/proxy/forum-posts", {
    method: "GET",
    source: "mock",
  });
}

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

export async function toggleForumPostRepost(
  postId: string
): Promise<ApiEnvelope<RepostStatusDto>> {
  return apiFetch<RepostStatusDto>(
    `/proxy/forum-posts/${encodeURIComponent(postId)}/repost`,
    { method: "POST", source: "mock" }
  );
}

export async function getForumPostRepostStatus(
  postId: string
): Promise<ApiEnvelope<RepostStatusDto>> {
  return apiFetch<RepostStatusDto>(
    `/proxy/forum-posts/${encodeURIComponent(postId)}/repost/status`,
    { method: "GET", source: "mock" }
  );
}

export async function listUserReposts(
  userId: string
): Promise<ApiEnvelope<UserRepostItemDto[]>> {
  return apiFetch<UserRepostItemDto[]>(
    `/proxy/profiles/${encodeURIComponent(userId)}/reposts`,
    { method: "GET", source: "mock" }
  );
}

export async function createCommunity(
  payload: CreateCommunityPayload
): Promise<ApiEnvelope<CommunityItemDto>> {
  return apiFetch<CommunityItemDto>("/proxy/communities", {
    method: "POST",
    body: payload,
    source: "mock",
  });
}

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
