import { useQuery } from "@tanstack/react-query";
import { forumApi } from "./forum.api";
import type { JoinedForum } from "./forum.types";

export const forumKeys = {
  all: ["forum"] as const,
  joined: () => [...forumKeys.all, "joined"] as const,
};

export function useJoinedForums() {
  return useQuery<JoinedForum[]>({
    queryKey: forumKeys.joined(),
    queryFn: async () => (await forumApi.getJoinedForums()).data,
    staleTime: 1000 * 60 * 5,
  });
}