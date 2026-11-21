import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { forumApi } from "./forum.api";
import type { JoinedForum } from "./forum.types";

export { useToggleArticleRepost } from "@/services/articles/article-reposts.queries";

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

/** Set id forum yang sudah diikuti, untuk cek status gabung per komunitas. */
export function useJoinedForumIds(): Set<string> {
  const { data } = useJoinedForums();
  return useMemo(() => new Set((data ?? []).map((f) => f.id)), [data]);
}

/** Mutasi gabung (join=true) atau keluar (join=false) dari forum. */
export function useToggleJoinForum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ forumId, join }: { forumId: string; join: boolean }) =>
      join ? forumApi.joinForum(forumId) : forumApi.leaveForum(forumId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: forumKeys.all });
      void queryClient.invalidateQueries({ queryKey: ["recommendations", "communities"] });
    },
  });
}