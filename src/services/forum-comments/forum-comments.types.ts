export interface ForumCommentAuthor {
  id: string;
  displayName: string;
  username: string;
  avatarUrl: string | null;
  avatarColor: string | null;
}

export interface ForumComment {
  id: string;
  postId: string;
  authorId: string;
  parentId: string | null;
  content: string;
  score: number;
  isLiked: boolean;
  author: ForumCommentAuthor | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateForumCommentPayload {
  content: string;
  parentId?: string | null;
}

export interface UpdateForumCommentPayload {
  content: string;
}

export interface DeleteForumCommentResult {
  deletedIds: string[];
}