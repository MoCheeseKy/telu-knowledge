import { apiFetch } from "@/lib/api/client";
import type { ApiEnvelope } from "@/lib/api/api.types";
import type { JoinedForum } from "./forum.types";
import type { JoinForumResult } from "./forum.types";

/**
 * Mengambil forum yang diikuti user (GET /proxy/communities/joined).
 */
export async function getJoinedForums(): Promise<ApiEnvelope<JoinedForum[]>> {
  return apiFetch<JoinedForum[]>("/proxy/communities/joined", {
    method: "GET",
    source: "mock",
  });
}

export async function joinForum(forumId: string): Promise<ApiEnvelope<JoinForumResult>> {
  return apiFetch<JoinForumResult>(
    `/proxy/communities/${encodeURIComponent(forumId)}/join`,
    { method: "POST", source: "mock" }
  );
}

export async function leaveForum(forumId: string): Promise<ApiEnvelope<JoinForumResult>> {
  return apiFetch<JoinForumResult>(
    `/proxy/communities/${encodeURIComponent(forumId)}/join`,
    { method: "DELETE", source: "mock" }
  );
}

export const forumApi = { getJoinedForums, joinForum, leaveForum };