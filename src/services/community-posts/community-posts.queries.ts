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
} from "./community-posts.types";

export const communityPostKeys = {
  all: ["community-posts"] as const,
  lists: () => [...communityPostKeys.all, "list"] as const,
  list: (communityId: string) =>
    [...communityPostKeys.lists(), communityId] as const,
  details: () => [...communityPostKeys.all, "detail"] as const,
  detail: (id: string) => [...communityPostKeys.details(), id] as const,
  comments: (postId: string) =>
    [...communityPostKeys.detail(postId), "comments"] as const,
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
