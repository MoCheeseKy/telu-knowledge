import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { articleKeys } from "@/services/articles/articles.queries";
import { articleRepostsApi } from "./article-reposts.api";
import type { RepostedArticleItem } from "./article-reposts.types";

/** Factory query key React Query untuk daftar repost artikel pada profil. */
export const repostKeys = {
  all: ["profile-reposts"] as const,
  profile: (profileId: string) => [...repostKeys.all, profileId] as const,
};

/**
 * Hook query untuk mengambil daftar artikel yang di-repost pada profil pengguna.
 *
 * @param profileId - ID profil pengguna target.
 * @returns Hasil query berisi daftar artikel yang di-repost.
 */
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

/**
 * Hook mutasi untuk melakukan toggle repost pada artikel.
 *
 * @returns Objek mutasi React Query.
 */
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