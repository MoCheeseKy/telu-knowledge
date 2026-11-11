import { apiFetch } from "@/lib/api/client";
import type { ApiEnvelope } from "@/lib/api/types";
import type {
  CommunityPostDto,
  CreateCommunityPostPayload,
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

export const communityPostsApi = {
  createCommunityPost,
};
