import type { ArticleFeedItem } from "@/services/articles/articles.types";

/** Sumber data API repost artikel (`backend` atau `mock`). */
export type ArticleRepostsSource = "backend" | "mock";

/** Hasil respons API setelah melakukan toggle repost artikel. */
export interface ToggleRepostResult {
  isReposted: boolean;
  repostsCount: number;
}

/** Artikel yang di-repost seorang user (tab Reposts di profil). */
export interface RepostedArticleItem extends ArticleFeedItem {
  repostedAt: string;
}