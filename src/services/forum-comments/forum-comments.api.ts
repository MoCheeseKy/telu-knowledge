import { apiFetch } from "@/lib/api/client";
import type { ApiEnvelope } from "@/lib/api/types";
import type {
  CreateForumCommentPayload,
  DeleteForumCommentResult,
  ForumComment,
  UpdateForumCommentPayload,
} from "./forum-comments.types";

export async function listForumComments(
  postId: string
): Promise<ApiEnvelope<ForumComment[]>> {
  return apiFetch<ForumComment[]>(
    `/proxy/forum-posts/${encodeURIComponent(postId)}/comments`,
    {
      method: "GET",
      source: "mock",
    }
  );
}

export async function createForumComment(
  postId: string,
  payload: CreateForumCommentPayload
): Promise<ApiEnvelope<ForumComment>> {
  return apiFetch<ForumComment>(
    `/proxy/forum-posts/${encodeURIComponent(postId)}/comments`,
    {
      method: "POST",
      body: payload,
      source: "mock",
    }
  );
}

export async function updateForumComment(
  commentId: string,
  payload: UpdateForumCommentPayload
): Promise<ApiEnvelope<ForumComment>> {
  return apiFetch<ForumComment>(
    `/proxy/forum-comments/${encodeURIComponent(commentId)}`,
    {
      method: "PATCH",
      body: payload,
      source: "mock",
    }
  );
}

export async function deleteForumComment(
  commentId: string
): Promise<ApiEnvelope<DeleteForumCommentResult>> {
  return apiFetch<DeleteForumCommentResult>(
    `/proxy/forum-comments/${encodeURIComponent(commentId)}`,
    {
      method: "DELETE",
      source: "mock",
    }
  );
}

export const forumCommentsApi = {
  listForumComments,
  createForumComment,
  updateForumComment,
  deleteForumComment,
};