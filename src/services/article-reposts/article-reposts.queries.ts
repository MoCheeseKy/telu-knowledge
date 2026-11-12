import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { articleKeys } from "@/services/articles/articles.queries";
import { articleRepostsApi } from "./article-reposts.api";
import type { RepostedArticleItem } from "./article-reposts.types";

export const repostKeys = {
  all: ["profile-reposts"] as const,
  profile: (profileId: string) => [...repostKeys.all, profileId] as const,
};

export function useProfileReposts(profileId?: string | null) {
  return useQuery<RepostedArticleItem[]>({
    queryKey: repostKeys.profile(profileId ?? ""),
    queryFn: async () => {
      if (!profileId) throw new Error("ID profil wajib diisi");
      const res = await articleRepostsApi.listProfileReposts(profileId);
      return res.data;
    },
    enabled: Boolean(profileId),
  });
}

export function useToggleArticleRepost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (articleId: string) =>
      articleRepostsApi.toggleArticleRepost(articleId),
    onSuccess: (_data, articleId) => {
      queryClient.invalidateQueries({ queryKey: ["article-detail", articleId] });
      queryClient.invalidateQueries({ queryKey: articleKeys.feeds() });
      queryClient.invalidateQueries({ queryKey: repostKeys.all });
    },
  });
}