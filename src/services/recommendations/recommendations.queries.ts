import { useQuery } from "@tanstack/react-query";
import { recommendationsApi } from "./recommendations.api";
import type {
  CommunityRecommendation,
  TopicRecommendation,
  WriterRecommendation,
} from "./recommendations.types";

/**
 * Daftar query key TanStack Query untuk data rekomendasi.
 */
export const recommendationKeys = {
  all: ["recommendations"] as const,
  topics: () => [...recommendationKeys.all, "topics"] as const,
  writers: () => [...recommendationKeys.all, "writers"] as const,
  communities: () => [...recommendationKeys.all, "communities"] as const,
};

/**
 * Hook query rekomendasi topik populer dengan staleTime 5 menit.
 */
export function useTopicRecommendations() {
  return useQuery<TopicRecommendation[]>({
    queryKey: recommendationKeys.topics(),
    queryFn: async () => {
      const res = await recommendationsApi.getTopicRecommendations();
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook query rekomendasi penulis terpopuler dengan staleTime 5 menit.
 */
export function useWriterRecommendations() {
  return useQuery<WriterRecommendation[]>({
    queryKey: recommendationKeys.writers(),
    queryFn: async () => {
      const res = await recommendationsApi.getWriterRecommendations();
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook query rekomendasi komunitas aktif dengan staleTime 5 menit.
 */
export function useCommunityRecommendations() {
  return useQuery<CommunityRecommendation[]>({
    queryKey: recommendationKeys.communities(),
    queryFn: async () => {
      const res = await recommendationsApi.getCommunityRecommendations();
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

