import type { ArticleFeedItem } from "@/services/articles/articles.types";

export type ArticleRepostsSource = "backend" | "mock";

export interface ToggleRepostResult {
  isReposted: boolean;
  repostsCount: number;
}

/** Artikel yang di-repost seorang user (tab Reposts di profil). */
export interface RepostedArticleItem extends ArticleFeedItem {
  repostedAt: string;
}