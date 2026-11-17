import { useQuery } from "@tanstack/react-query";
import { forumApi } from "./forum.api";
import type { JoinedForum } from "./forum.types";

/** Factory query key React Query untuk fitur forum pengguna. */
export const forumKeys = {
  all: ["forum"] as const,
  joined: () => [...forumKeys.all, "joined"] as const,
};

/**
 * Hook query untuk mengambil daftar forum yang diikuti pengguna.
 *
 * @returns Hasil query berisi daftar forum yang diikuti.
 */
export function useJoinedForums() {
  return useQuery<JoinedForum[]>({
    queryKey: forumKeys.joined(),
    queryFn: async () => (await forumApi.getJoinedForums()).data,
    staleTime: 1000 * 60 * 5,
  });
}