import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  communityPostsApi,
  type CommunityItemDto,
  type CreateCommunityPayload,
} from "./community-posts.api";
import type {
  CommunityPostDto,
  CreateCommunityPostVariables,
  DeleteCommunityPostVariables,
  UpdateCommunityPostPayload,
  UpdateCommunityPostVariables,
} from "./community-posts.types";

export const communityPostKeys = {
  all: ["community-posts"] as const,
  lists: () => [...communityPostKeys.all, "list"] as const,
  list: (communityId: string) =>
    [...communityPostKeys.lists(), communityId] as const,
  details: () => [...communityPostKeys.all, "detail"] as const,
  detail: (id: string) => [...communityPostKeys.details(), id] as const,
};

/**
 * Hook query detail postingan by ID (GET /proxy/forum-posts/:postId) — tanpa
 * communityId, dipakai halaman /discussion-forums/[id]. Konten post saja.
 * Memakai query key `communityPostKeys.detail(id)` yang sama dengan detail
 * per komunitas (bentuk datanya identik), sehingga cache dapat dipakai bersama.
 */
export function useForumPostDetail(postId?: string | null) {
  return useQuery<CommunityPostDto>({
    queryKey: communityPostKeys.detail(postId ?? ""),
    queryFn: async (): Promise<CommunityPostDto> => {
      if (!postId) {
        throw new Error("ID postingan wajib diisi");
      }
      const res = await communityPostsApi.getForumPostDetail(postId);
      return res.data;
    },
    enabled: Boolean(postId),
  });
}

/**
 * Hook query daftar postingan komunitas, terbaru di atas
 * (GET /proxy/communities/:id/posts).
 * Query key memakai `communityPostKeys.list(communityId)` yang sama dengan
 * target invalidasi mutasi create/update/delete — sehingga feed otomatis
 * me-refresh setelah aksi apa pun tanpa penanganan khusus di komponen.
 */
export function useCommunityPosts(communityId?: string | null) {
  return useQuery<CommunityPostDto[]>({
    queryKey: communityPostKeys.list(communityId ?? ""),
    queryFn: async (): Promise<CommunityPostDto[]> => {
      if (!communityId) {
        throw new Error("ID komunitas wajib diisi");
      }
      const res = await communityPostsApi.listCommunityPosts(communityId);
      return res.data;
    },
    enabled: Boolean(communityId),
  });
}

/**
 * Hook query detail postingan komunitas (GET /proxy/communities/:id/posts/:postId).
 */
export function useCommunityPost(
  communityId?: string | null,
  postId?: string | null
) {
  return useQuery<CommunityPostDto>({
    queryKey: communityPostKeys.detail(postId ?? ""),
    queryFn: async (): Promise<CommunityPostDto> => {
      if (!communityId || !postId) {
        throw new Error("ID komunitas dan postingan wajib diisi");
      }
      const res = await communityPostsApi.getCommunityPost(communityId, postId);
      return res.data;
    },
    enabled: Boolean(communityId && postId),
  });
}

/**
 * Hook mutasi penyuntingan postingan milik sendiri
 * (PATCH /proxy/communities/:id/posts/:postId).
 */
export function useUpdateCommunityPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ communityId, postId, payload }: UpdateCommunityPostVariables) =>
      communityPostsApi.updateCommunityPost(communityId, postId, payload),
    retry: false,
    onSuccess: (res, { communityId }) => {
      if (res?.data?.id) {
        queryClient.setQueryData(
          communityPostKeys.detail(res.data.id),
          res.data
        );
      }
      void queryClient.invalidateQueries({
        queryKey: communityPostKeys.list(communityId),
      });
    },
  });
}

/**
 * Hook mutasi penghapusan postingan milik sendiri
 * (DELETE /proxy/communities/:id/posts/:postId).
 */
export function useDeleteCommunityPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ communityId, postId }: DeleteCommunityPostVariables) =>
      communityPostsApi.deleteCommunityPost(communityId, postId),
    retry: false,
    onSuccess: (_res, { communityId }) => {
      void queryClient.invalidateQueries({
        queryKey: communityPostKeys.list(communityId),
      });
      void queryClient.invalidateQueries({ queryKey: communityPostKeys.all });
    },
  });
}

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
      void queryClient.invalidateQueries({
        queryKey: communityPostKeys.all,
      });
    },
  });
}

/**
 * Hook query seluruh postingan forum (feed utama /discussion-forums).
 */
export function useAllForumPosts() {
  return useQuery<CommunityPostDto[]>({
    queryKey: communityPostKeys.lists(),
    queryFn: async (): Promise<CommunityPostDto[]> => {
      const res = await communityPostsApi.listAllForumPosts();
      return res.data;
    },
  });
}

/**
 * Hook mutasi penghapusan postingan forum by ID saja (tanpa perlu tahu communityId).
 */
export function useDeleteForumPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => communityPostsApi.deleteForumPost(postId),
    retry: false,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: communityPostKeys.all,
      });
    },
  });
}

/**
 * Hook mutasi pembaruan postingan forum by ID saja.
 */
export function useUpdateForumPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      payload,
    }: {
      postId: string;
      payload: UpdateCommunityPostPayload;
    }) => communityPostsApi.updateForumPost(postId, payload),
    retry: false,
    onSuccess: (res) => {
      if (res?.data?.id) {
        queryClient.setQueryData(
          communityPostKeys.detail(res.data.id),
          res.data
        );
      }
      void queryClient.invalidateQueries({
        queryKey: communityPostKeys.all,
      });
    },
  });
}

/**
 * Hook mutasi pembuatan komunitas baru (POST /proxy/communities).
 */
export function useCreateCommunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCommunityPayload) =>
      communityPostsApi.createCommunity(payload),
    retry: false,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["communities"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["recommendations", "communities"],
      });
    },
  });
}

/**
 * Hook query daftar seluruh komunitas (GET /proxy/communities).
 */
export function useCommunities() {
  return useQuery<CommunityItemDto[]>({
    queryKey: ["communities"],
    queryFn: async () => {
      const res = await communityPostsApi.listCommunities();
      return res.data;
    },
  });
}
