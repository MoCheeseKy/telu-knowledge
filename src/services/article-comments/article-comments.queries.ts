import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ArticleComment,
  CreateCommentPayload,
} from "@/services/articles/articles.types";
import { articleCommentsApi } from "./article-comments.api";
import type { UpdateCommentVariables } from "./article-comments.types";

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

export function useArticleComments(articleId?: string | null) {
  return useQuery<ArticleComment[]>({
    queryKey: articleCommentKeys.list(articleId ?? ""),
    queryFn: async () => {
      if (!articleId) throw new Error("ID artikel wajib diisi");
      const res = await articleCommentsApi.listArticleComments(articleId);
      // Extract the array from the object
      return res.data?.comments || []; 
    },
    enabled: Boolean(articleId),
  });
}

export function useCreateArticleComment(articleId: string) {
  const refresh = useRefreshComments(articleId);
  return useMutation({
    mutationFn: (payload: CreateCommentPayload) =>
      articleCommentsApi.createArticleComment(articleId, payload),
    onSuccess: refresh,
  });
}

export function useUpdateArticleComment(articleId: string) {
  const refresh = useRefreshComments(articleId);
  return useMutation({
    mutationFn: ({ commentId, payload }: UpdateCommentVariables) =>
      articleCommentsApi.updateArticleComment(articleId, commentId, payload),
    onSuccess: refresh,
  });
}

export function useDeleteArticleComment(articleId: string) {
  const refresh = useRefreshComments(articleId);
  return useMutation({
    mutationFn: (commentId: string) =>
      articleCommentsApi.deleteArticleComment(articleId, commentId),
    onSuccess: refresh,
  });
}