/** Sumber data API komentar artikel (`backend` atau `mock`). */
export type ArticleCommentsSource = "backend" | "mock";

/** Payload untuk memperbarui isi komentar artikel. */
export interface UpdateCommentPayload {
  content: string;
}

/** Variabel mutasi untuk memperbarui komentar artikel. */
export interface UpdateCommentVariables {
  commentId: string;
  payload: UpdateCommentPayload;
}