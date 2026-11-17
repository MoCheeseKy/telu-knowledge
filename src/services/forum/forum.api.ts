import { apiFetch } from "@/lib/api/client";
import type { ApiEnvelope } from "@/lib/api/types";
import type { JoinedForum } from "./forum.types";

/**
 * Mengambil forum yang diikuti user (GET /proxy/communities/joined).
 */
export async function getJoinedForums(): Promise<ApiEnvelope<JoinedForum[]>> {
  return apiFetch<JoinedForum[]>("/proxy/communities/joined", {
    method: "GET",
    source: "mock",
  });
}

export const forumApi = { getJoinedForums };