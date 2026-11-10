import { useQuery } from "@tanstack/react-query";
import { recommendationsApi } from "./recommendations.api";
import type {
  CommunityRecommendation,
  TopicRecommendation,
  WriterRecommendation,
} from "./recommendations.types";

export const recommendationKeys = {
  all: ["recommendations"] as const,
  topics: () => [...recommendationKeys.all, "topics"] as const,
  writers: () => [...recommendationKeys.all, "writers"] as const,
  communities: () => [...recommendationKeys.all, "communities"] as const,
};

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

