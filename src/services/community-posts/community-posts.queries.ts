import { useMutation, useQueryClient } from "@tanstack/react-query";
import { communityPostsApi } from "./community-posts.api";
import type { CreateCommunityPostVariables } from "./community-posts.types";

export const communityPostKeys = {
  all: ["community-posts"] as const,
  lists: () => [...communityPostKeys.all, "list"] as const,
  list: (communityId: string) =>
    [...communityPostKeys.lists(), communityId] as const,
  details: () => [...communityPostKeys.all, "detail"] as const,
  detail: (id: string) => [...communityPostKeys.details(), id] as const,
};

/**
 * Hook mutasi pembuatan postingan baru pada komunitas
 * (POST /proxy/communities/:id/posts).
 */
export function useCreateCommunityPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ communityId, payload }: CreateCommunityPostVariables) =>
      communityPostsApi.createCommunityPost(communityId, payload),
    retry: false,
    onSuccess: (_res, { communityId }) => {
      // Siapkan invalidasi untuk langkah integrasi daftar postingan (GET)
      void queryClient.invalidateQueries({
        queryKey: communityPostKeys.list(communityId),
      });
    },
  });
}
