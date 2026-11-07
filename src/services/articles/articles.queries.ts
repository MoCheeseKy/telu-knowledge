import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAiAssist } from "@/services/ai/ai.queries";
import { articlesApi } from "./articles.api";
import type {
  Article,
  CreateArticlePayload,
  ListMyArticlesParams,
  MyArticlesListData,
  UpdateArticleVariables,
} from "./articles.types";

export const articleKeys = {
  all: ["articles"] as const,
  lists: () => [...articleKeys.all, "list"] as const,
  list: (params?: ListMyArticlesParams) =>
    [...articleKeys.lists(), params ?? {}] as const,
  details: () => [...articleKeys.all, "detail"] as const,
  detail: (id: string) => [...articleKeys.details(), id] as const,
};

/**
 * Hook query detail artikel (GET /proxy/articles/:id).
 * Menggunakan staleTime Infinity dan refetchOnWindowFocus false agar tidak
 * menimpa perubahan lokal yang sedang diketik pengguna di editor.
 */
export function useArticle(id?: string | null) {
  return useQuery<Article>({
    queryKey: articleKeys.detail(id ?? ""),
    queryFn: async (): Promise<Article> => {
      if (!id) {
        throw new Error("ID artikel wajib diisi");
      }
      const res = await articlesApi.getArticle(id);
      return res.data;
    },
    enabled: Boolean(id),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook query daftar artikel milik sendiri (GET /proxy/articles/me).
 */
export function useMyArticles(params?: ListMyArticlesParams) {
  return useQuery<MyArticlesListData>({
    queryKey: articleKeys.list(params),
    queryFn: async (): Promise<MyArticlesListData> => {
      const res = await articlesApi.listMyArticles(params);
      return res.data;
    },
  });
}

export const useListMyArticles = useMyArticles;

/**
 * Hook mutasi pembuatan draft artikel baru (POST /proxy/articles).
 * Menggunakan meta.skipAuthRedirect agar 401 saat mengedit tidak memicu hard redirect.
 */
export function useCreateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateArticlePayload = {}) =>
      articlesApi.createArticle(payload),
    onSuccess: (res) => {
      if (res?.data?.id) {
        queryClient.setQueryData(articleKeys.detail(res.data.id), res.data);
      }
      void queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
    },
    meta: {
      skipAuthRedirect: true,
    },
  });
}

/**
 * Hook mutasi pembaruan artikel (PATCH /proxy/articles/:id).
 * Menggunakan meta.skipAuthRedirect agar 401 saat mengedit tidak memicu hard redirect.
 */
export function useUpdateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateArticleVariables) =>
      articlesApi.updateArticle(id, payload),
    onSuccess: (res) => {
      if (res?.data?.id) {
        queryClient.setQueryData(articleKeys.detail(res.data.id), res.data);
      }
      void queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
    },
    meta: {
      skipAuthRedirect: true,
    },
  });
}

/**
 * Hook mutasi publikasi artikel (POST /proxy/articles/:id/publish).
 * Menggunakan meta.skipAuthRedirect agar 401 saat publikasi tidak memicu hard redirect.
 */
export function usePublishArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => articlesApi.publishArticle(id),
    onSuccess: (res) => {
      if (res?.data?.id) {
        queryClient.setQueryData(articleKeys.detail(res.data.id), res.data);
      }
      void queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
    },
    meta: {
      skipAuthRedirect: true,
    },
  });
}

/**
 * Hook mutasi unggah gambar artikel (POST /proxy/uploads/article-image).
 * Menggunakan meta.skipAuthRedirect agar 401 saat unggah tidak memicu hard redirect.
 */
export function useUploadArticleImage() {
  return useMutation({
    mutationFn: (file: File) => articlesApi.uploadArticleImage(file),
    meta: {
      skipAuthRedirect: true,
    },
  });
}

export { useAiAssist };
