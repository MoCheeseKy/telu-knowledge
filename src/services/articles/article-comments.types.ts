export type ArticleCommentsSource = "backend" | "mock";

export interface UpdateCommentPayload {
  content: string;
}

export interface UpdateCommentVariables {
  commentId: string;
  payload: UpdateCommentPayload;
}