import type {
  ArticleComment,
  ArticleDetailAuthor,
  ArticleDetailData,
} from "@/services/articles/articles.types";

export interface ArticleDetailViewProps {
  articleId: string;
}

export interface ArticleDetailHeaderProps {
  article?: ArticleDetailData;
}

export interface ArticleDetailContentProps {
  article: ArticleDetailData;
}

export interface ArticleDetailActionsProps {
  article: ArticleDetailData;
}

export interface ArticleCommentsSectionProps {
  articleId?: string;
  initialComments?: ArticleComment[];
}

export interface ArticleAuthorSidebarProps {
  author: ArticleDetailAuthor;
}

export interface TiptapMark {
  type: string;
  attrs?: Record<string, unknown>;
}

export interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: TiptapMark[];
  text?: string;
}

export interface TiptapDoc {
  type: "doc";
  content?: TiptapNode[];
  [key: string]: unknown;
}
