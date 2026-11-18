import type {
  ArticleComment,
  ArticleDetailAuthor,
  ArticleDetailData,
} from "@/services/articles/articles.types";

/** Properti untuk komponen tampilan utama detail artikel. */
export interface ArticleDetailViewProps {
  articleId: string;
}

/** Properti untuk komponen header detail artikel. */
export interface ArticleDetailHeaderProps {
  article?: ArticleDetailData;
}

/** Properti untuk komponen konten utama detail artikel. */
export interface ArticleDetailContentProps {
  article: ArticleDetailData;
}

/** Properti untuk bar aksi interaksi pada detail artikel. */
export interface ArticleDetailActionsProps {
  article: ArticleDetailData;
}

/** Properti untuk bagian komentar dan diskusi artikel. */
export interface ArticleCommentsSectionProps {
  articleId?: string;
  initialComments?: ArticleComment[];
}

/** Properti untuk sidebar informasi penulis artikel. */
export interface ArticleAuthorSidebarProps {
  author: ArticleDetailAuthor;
}

/** Representasi mark pemformatan inline pada node teks Tiptap. */
export interface TiptapMark {
  type: string;
  attrs?: Record<string, unknown>;
}

/** Representasi satu node dalam pohon dokumen Tiptap JSON. */
export interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: TiptapMark[];
  text?: string;
}

/** Representasi akar dokumen Tiptap JSON. */
export interface TiptapDoc {
  type: "doc";
  content?: TiptapNode[];
  [key: string]: unknown;
}
