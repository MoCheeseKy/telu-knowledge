"use client";

import React, { useState } from "react";
import {
  ThumbsUp,
  MessageSquareMore,
  Repeat2,
  Bookmark,
  Share2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import {
  useToggleArticleBookmark,
  useToggleArticleLike,
} from "@/services/articles/articles.queries";
import type { ArticleDetailData } from "@/services/articles/articles.types";

interface ArticleDetailActionsProps {
  article: ArticleDetailData;
}

function formatCounter(count: number): string {
  if (count >= 1000) {
    const formatted = (count / 1000).toFixed(1).replace(".", ",");
    return `${formatted}k`;
  }
  return String(count);
}

export default function ArticleDetailActions({
  article,
}: ArticleDetailActionsProps) {
  const [isLiked, setIsLiked] = useState(article.isLiked);
  const [likesCount, setLikesCount] = useState(article.stats.likesCount);
  const [isBookmarked, setIsBookmarked] = useState(article.isBookmarked);
  const [bookmarksCount, setBookmarksCount] = useState(
    article.stats.bookmarksCount
  );
  const [isReposted, setIsReposted] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleLikeMutation = useToggleArticleLike();
  const toggleBookmarkMutation = useToggleArticleBookmark();

  const handleToggleLike = () => {
    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikesCount((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));
    toggleLikeMutation.mutate(article.id);
  };

  const handleToggleBookmark = () => {
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);
    setBookmarksCount((prev) =>
      nextState ? prev + 1 : Math.max(0, prev - 1)
    );
    toggleBookmarkMutation.mutate(article.id);
  };

  const handleScrollToComments = () => {
    const el = document.getElementById("komentar");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const { toast } = useToast();

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Tautan artikel berhasil disalin ke clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="mt-8 flex items-center justify-between gap-2 border-y border-[var(--dust)]/40 py-3">
      {/* Sisi Kiri: Suka & Komentar */}
      <div className="flex items-center gap-1 sm:gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleToggleLike}
          aria-label="Suka artikel"
          className="h-8 px-2.5 py-1 gap-1.5 hover:bg-[var(--background-accent)] rounded-md text-[var(--foreground)] cursor-pointer"
        >
          <ThumbsUp
            className={cn(
              "w-4 h-4 transition-colors",
              isLiked
                ? "fill-[var(--primary-text)] text-[var(--primary-text)]"
                : "text-[var(--foreground)]"
            )}
          />
          <span className="font-sans text-xs sm:text-sm font-semibold">
            {formatCounter(likesCount)}
          </span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleScrollToComments}
          aria-label="Komentar artikel"
          className="h-8 px-2.5 py-1 gap-1.5 hover:bg-[var(--background-accent)] rounded-md text-[var(--foreground)] cursor-pointer"
        >
          <MessageSquareMore className="w-4 h-4 text-[var(--foreground)]" />
          <span className="font-sans text-xs sm:text-sm font-semibold">
            {formatCounter(article.stats.commentsCount)}
          </span>
        </Button>
      </div>

      {/* Sisi Kanan: Repost, Bookmark, Share */}
      <div className="flex items-center gap-1 sm:gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsReposted(!isReposted)}
          aria-label="Repost artikel"
          className="h-8 px-2.5 py-1 gap-1.5 hover:bg-[var(--background-accent)] rounded-md text-[var(--foreground)] cursor-pointer"
        >
          <Repeat2
            className={cn(
              "w-4 h-4 transition-colors",
              isReposted
                ? "text-[var(--primary-text)] font-bold"
                : "text-[var(--primary-text)]"
            )}
          />
          <span className="font-sans text-xs sm:text-sm font-semibold">
            {formatCounter(article.stats.repostsCount)}
          </span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleToggleBookmark}
          aria-label="Simpan artikel"
          className="h-8 px-2 py-1 gap-1.5 hover:bg-[var(--background-accent)] rounded-md text-[var(--foreground)] cursor-pointer"
        >
          <Bookmark
            className={cn(
              "w-4 h-4 transition-colors",
              isBookmarked
                ? "fill-[var(--primary-text)] text-[var(--primary-text)]"
                : "text-[var(--foreground)]"
            )}
          />
          <span className="hidden sm:inline font-sans text-xs font-medium">
            {formatCounter(bookmarksCount)}
          </span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleShare}
          aria-label="Bagikan artikel"
          className="h-8 w-8 hover:bg-[var(--background-accent)] rounded-md text-[var(--foreground)] cursor-pointer relative"
        >
          {copied ? (
            <Check className="w-4 h-4 text-[var(--success-text)]" />
          ) : (
            <Share2 className="w-4 h-4" />
          )}
          {copied && (
            <span className="absolute -top-7 right-0 text-[10px] font-semibold bg-[var(--foreground)] text-white px-2 py-0.5 rounded shadow-sm whitespace-nowrap animate-fade-in">
              Tautan disalin!
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}

