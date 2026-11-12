import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { communityPostsApi } from "./community-posts.api";
import type {
  CommunityPostDto,
  CreateCommunityPostVariables,
  DeleteCommunityPostVariables,
  UpdateCommunityPostVariables,
  RepostStatusDto,
  UserRepostItemDto,
} from "./community-posts.types";

export const communityPostKeys = {
  all: ["community-posts"] as const,
  lists: () => [...communityPostKeys.all, "list"] as const,
  list: (communityId: string) =>
    [...communityPostKeys.lists(), communityId] as const,
  details: () => [...communityPostKeys.all, "detail"] as const,
  detail: (id: string) => [...communityPostKeys.details(), id] as const,
  // === Repost ===
  repostStatus: (postId: string) =>
    [...communityPostKeys.all, "repost-status", postId] as const,
  userReposts: (userId: string) =>
    [...communityPostKeys.all, "user-reposts", userId] as const,
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
 * Server ikut menghapus baris repost (cascade), jadi cache user-reposts
 * juga harus di-refresh supaya tab Reposts di profil tidak menampilkan
 * post yang sudah dihapus.
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
    },
  });
}

// ============================================================================
// REPOST
// ============================================================================

/**
 * Hook query status repost satu postingan
 * (GET /proxy/forum-posts/:postId/repost/status).
 */
export function useForumPostRepostStatus(postId?: string | null) {
  return useQuery<RepostStatusDto>({
    queryKey: communityPostKeys.repostStatus(postId ?? ""),
    queryFn: async (): Promise<RepostStatusDto> => {
      if (!postId) {
        throw new Error("ID postingan wajib diisi");
      }
      const res = await communityPostsApi.getForumPostRepostStatus(postId);
      return res.data;
    },
    enabled: Boolean(postId),
  });
}

/**
 * Hook mutasi toggle repost
 * (POST /proxy/forum-posts/:postId/repost).
 * Optimistic update: count & isReposted berubah instan, lalu di-sync dengan
 * respons server. Setelah sukses, daftar user-reposts di-invalidate agar tab
 * Reposts di profil otomatis refetch.
 */
export function useToggleForumPostRepost(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => communityPostsApi.toggleForumPostRepost(postId),
    retry: false,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: communityPostKeys.repostStatus(postId),
      });

      const previous = queryClient.getQueryData<RepostStatusDto>(
        communityPostKeys.repostStatus(postId)
      );

      if (previous) {
        queryClient.setQueryData<RepostStatusDto>(
          communityPostKeys.repostStatus(postId),
          {
            isReposted: !previous.isReposted,
            repostsCount: previous.repostsCount + (previous.isReposted ? -1 : 1),
          }
        );
      }

      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(
          communityPostKeys.repostStatus(postId),
          ctx.previous
        );
      }
    },
    onSuccess: (res) => {
      // Sinkronkan dengan angka final dari server
      if (res?.data) {
        queryClient.setQueryData(
          communityPostKeys.repostStatus(postId),
          res.data
        );
      }
      // Refresh detail & list (biar count di kartu/list konsisten)
      void queryClient.invalidateQueries({
        queryKey: communityPostKeys.detail(postId),
      });
      void queryClient.invalidateQueries({
        queryKey: communityPostKeys.lists(),
      });
      // Refresh tab Reposts di profil (semua user — ringan untuk mock)
      void queryClient.invalidateQueries({
        queryKey: [...communityPostKeys.all, "user-reposts"],
      });
    },
  });
}

/**
 * Hook query daftar repost milik user
 * (GET /proxy/profiles/:userId/reposts). Pakai userId="me" untuk viewer.
 */
export function useUserReposts(userId?: string | null) {
  return useQuery<UserRepostItemDto[]>({
    queryKey: communityPostKeys.userReposts(userId ?? ""),
    queryFn: async (): Promise<UserRepostItemDto[]> => {
      if (!userId) {
        throw new Error("ID pengguna wajib diisi");
      }
      const res = await communityPostsApi.listUserReposts(userId);
      return res.data;
    },
    enabled: Boolean(userId),
  });
}