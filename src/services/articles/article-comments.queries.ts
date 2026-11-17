import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ArticleComment,
  CreateCommentPayload,
} from "@/services/articles/articles.types";
import { articleCommentsApi } from "./article-comments.api";
import type { UpdateCommentVariables } from "./article-comments.types";

/** Factory query key React Query untuk komentar artikel. */
export const articleCommentKeys = {
  all: ["article-comments"] as const,
  list: (articleId: string) => [...articleCommentKeys.all, articleId] as const,
};

/** Halaman detail artikel membaca komentar dari ["article-detail", id]; list ini untuk kebutuhan terpisah. */
function useRefreshComments(articleId: string) {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["article-detail", articleId] });
    queryClient.invalidateQueries({
      queryKey: articleCommentKeys.list(articleId),
    });
  };
}

/**
 * Hook query untuk mengambil daftar komentar pada suatu artikel.
 *
 * @param articleId - ID artikel yang komentarnya diambil.
 * @returns Hasil query berisi array komentar artikel.
 */
export function useArticleComments(articleId?: string | null) {
  return useQuery<ArticleComment[]>({
    queryKey: articleCommentKeys.list(articleId ?? ""),
    queryFn: async () => {
      if (!articleId) throw new Error("ID artikel wajib diisi");
      const res = await articleCommentsApi.listArticleComments(articleId);
      return res.data?.comments || []; 
    },
    enabled: Boolean(articleId),
  });
}

/**
 * Hook mutasi untuk menambahkan komentar atau balasan pada artikel.
 *
 * @param articleId - ID artikel target.
 * @returns Objek mutasi React Query.
 */
export function useCreateArticleComment(articleId: string) {
  const refresh = useRefreshComments(articleId);
  return useMutation({
    mutationFn: (payload: CreateCommentPayload) =>
      articleCommentsApi.createArticleComment(articleId, payload),
    onSuccess: refresh,
  });
}

/**
 * Hook mutasi untuk memperbarui isi komentar artikel.
 *
 * @param articleId - ID artikel target.
 * @returns Objek mutasi React Query.
 */
export function useUpdateArticleComment(articleId: string) {
  const refresh = useRefreshComments(articleId);
  return useMutation({
    mutationFn: ({ commentId, payload }: UpdateCommentVariables) =>
      articleCommentsApi.updateArticleComment(articleId, commentId, payload),
    onSuccess: refresh,
  });
}

/**
 * Hook mutasi untuk menghapus komentar artikel.
 *
 * @param articleId - ID artikel target.
 * @returns Objek mutasi React Query.
 */
export function useDeleteArticleComment(articleId: string) {
  const refresh = useRefreshComments(articleId);
  return useMutation({
    mutationFn: (commentId: string) =>
      articleCommentsApi.deleteArticleComment(articleId, commentId),
    onSuccess: refresh,
  });
}