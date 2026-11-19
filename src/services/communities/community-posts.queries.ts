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

export function useAllForumPosts() {
  return useQuery<CommunityPostDto[]>({
    queryKey: communityPostKeys.lists(),
    queryFn: async (): Promise<CommunityPostDto[]> => {
      const res = await communityPostsApi.listAllForumPosts();
      return res.data;
    },
  });
}

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

export function useCommunities() {
  return useQuery<CommunityItemDto[]>({
    queryKey: ["communities"],
    queryFn: async () => {
      const res = await communityPostsApi.listCommunities();
      return res.data;
    },
  });
}

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
      void queryClient.invalidateQueries({
        queryKey: [...communityPostKeys.all, "user-reposts"],
      });
    },
  });
}

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