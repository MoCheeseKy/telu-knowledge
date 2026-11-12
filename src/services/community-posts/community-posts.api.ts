import { apiFetch } from "@/lib/api/client";
import type { ApiEnvelope } from "@/lib/api/types";
import type {
  CommunityPostDto,
  CreateCommunityPostPayload,
  UpdateCommunityPostPayload,
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
