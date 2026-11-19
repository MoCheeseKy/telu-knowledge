import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { communityPostsApi } from "./community-posts.api";
import type {
  CommunityPostDto,
  CreateCommunityPostVariables,
  DeleteCommunityPostVariables,
  UpdateCommunityPostVariables,
  ForumCommentDto,
  CreateForumCommentVariables,
  UpdateForumCommentVariables,
  DeleteForumCommentVariables,
  RepostStatusDto,
  UserRepostItemDto,
  UpdateForumPostVariables,
  CreateCommunityPayload,
  CommunityItemDto,
} from "./community-posts.types";

/** Factory query key React Query untuk postingan, komentar, dan repost komunitas/forum. */
export const communityPostKeys = {
  all: ["community-posts"] as const,
  lists: () => [...communityPostKeys.all, "list"] as const,
  list: (communityId: string) =>
    [...communityPostKeys.lists(), communityId] as const,
  details: () => [...communityPostKeys.all, "detail"] as const,
  detail: (id: string) => [...communityPostKeys.details(), id] as const,
  comments: (postId: string) =>
    [...communityPostKeys.detail(postId), "comments"] as const,
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
    mutationFn: ({ postId, payload }: UpdateForumPostVariables) =>
      communityPostsApi.updateForumPost(postId, payload),
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

/**
 * Hook query daftar komentar postingan forum (GET /proxy/forum-posts/:postId/comments).
 */
export function useForumPostComments(postId?: string | null) {
  return useQuery<ForumCommentDto[]>({
    queryKey: communityPostKeys.comments(postId ?? ""),
    queryFn: async (): Promise<ForumCommentDto[]> => {
      if (!postId) {
        throw new Error("ID postingan wajib diisi");
      }
      const res = await communityPostsApi.getForumPostComments(postId);
      return res.data;
    },
    enabled: Boolean(postId),
  });
}

/**
 * Hook mutasi penambahan komentar atau balasan pada postingan forum
 * (POST /proxy/forum-posts/:postId/comments).
 */
export function useCreateForumComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, payload }: CreateForumCommentVariables) =>
      communityPostsApi.createForumComment(postId, payload),
    retry: false,
    onSuccess: (_res, { postId }) => {
      void queryClient.invalidateQueries({
        queryKey: communityPostKeys.comments(postId),
      });
      void queryClient.invalidateQueries({
        queryKey: communityPostKeys.detail(postId),
      });
    },
  });
}

/**
 * Hook mutasi pembaruan isi komentar pada postingan forum
 * (PATCH /proxy/forum-posts/:postId/comments/:commentId).
 */
export function useUpdateForumComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, commentId, payload }: UpdateForumCommentVariables) =>
      communityPostsApi.updateForumComment(postId, commentId, payload),
    retry: false,
    onSuccess: (_res, { postId }) => {
      void queryClient.invalidateQueries({
        queryKey: communityPostKeys.comments(postId),
      });
    },
  });
}

/**
 * Hook mutasi penghapusan komentar pada postingan forum
 * (DELETE /proxy/forum-posts/:postId/comments/:commentId).
 */
export function useDeleteForumComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, commentId }: DeleteForumCommentVariables) =>
      communityPostsApi.deleteForumComment(postId, commentId),
    retry: false,
    onSuccess: (_res, { postId }) => {
      void queryClient.invalidateQueries({
        queryKey: communityPostKeys.comments(postId),
      });
      void queryClient.invalidateQueries({
        queryKey: communityPostKeys.detail(postId),
      });
    },
  });
}

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
      if (res?.data) {
        queryClient.setQueryData(
          communityPostKeys.repostStatus(postId),
          res.data
        );
      }
      void queryClient.invalidateQueries({
        queryKey: communityPostKeys.detail(postId),
      });
      void queryClient.invalidateQueries({
        queryKey: communityPostKeys.lists(),
      });
      // Invalidate seluruh user karena ringan untuk mock
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

export function useToggleForumPostLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => communityPostsApi.toggleForumPostLike(postId),
    retry: false,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: communityPostKeys.all });
    },
  });
}