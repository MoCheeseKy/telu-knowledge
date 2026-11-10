import { apiFetch } from "@/lib/api/client";
import type { ApiEnvelope } from "@/lib/api/types";
import type {
  CommunityRecommendation,
  TopicRecommendation,
  WriterRecommendation,
} from "./recommendations.types";

/**
 * Mengambil rekomendasi topik populer (GET /proxy/topics/recommendations).
 */
export async function getTopicRecommendations(): Promise<
  ApiEnvelope<TopicRecommendation[]>
> {
  return apiFetch<TopicRecommendation[]>("/proxy/topics/recommendations", {
    method: "GET",
    source: "mock",
  });
}

/**
 * Mengambil rekomendasi penulis terpopuler (GET /proxy/profiles/recommendations).
 */
export async function getWriterRecommendations(): Promise<
  ApiEnvelope<WriterRecommendation[]>
> {
  return apiFetch<WriterRecommendation[]>("/proxy/profiles/recommendations", {
    method: "GET",
    source: "mock",
  });
}

/**
 * Mengambil rekomendasi komunitas aktif (GET /proxy/communities/recommendations).
 */
export async function getCommunityRecommendations(): Promise<
  ApiEnvelope<CommunityRecommendation[]>
> {
  return apiFetch<CommunityRecommendation[]>(
    "/proxy/communities/recommendations",
    {
      method: "GET",
      source: "mock",
    }
  );
}

export const recommendationsApi = {
  getTopicRecommendations,
  getWriterRecommendations,
  getCommunityRecommendations,
};

