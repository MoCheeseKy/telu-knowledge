"use client";

import { useToggleArticleRepost } from "@/services/articles/article-reposts.queries";
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
import { formatCounter } from "@/lib/formatters";
import { getErrorMessage } from "@/lib/api/error-messages";
import { copyTextToClipboard } from "@/lib/clipboard";
import type { ArticleDetailActionsProps } from "./article-detail.types";

/**
 * Bar aksi interaksi artikel meliputi suka, navigasi ke komentar, repost, bookmark, dan salin tautan.
 */
export default function ArticleDetailActions({
  article,
}: ArticleDetailActionsProps) {
  const { toast } = useToast();
  const toggleRepostMutation = useToggleArticleRepost();
  const toggleLikeMutation = useToggleArticleLike();
  const toggleBookmarkMutation = useToggleArticleBookmark();

  const [isLiked, setIsLiked] = useState(article.isLiked);
  const [likesCount, setLikesCount] = useState(article.stats.likesCount);
  const [isBookmarked, setIsBookmarked] = useState(article.isBookmarked);
  const [bookmarksCount, setBookmarksCount] = useState(
    article.stats.bookmarksCount
  );
  const [isReposted, setIsReposted] = useState(Boolean(article.isReposted));
  const [repostsCount, setRepostsCount] = useState(article.stats.repostsCount);
  const [copied, setCopied] = useState(false);

  const handleToggleLike = () => {
    if (toggleLikeMutation.isPending) return;
    const prevLiked = isLiked;
    const prevCount = likesCount;
    const nextState = !prevLiked;

    setIsLiked(nextState);
    setLikesCount(nextState ? prevCount + 1 : Math.max(0, prevCount - 1));

    toggleLikeMutation.mutate(article.id, {
      onError: (err) => {
        setIsLiked(prevLiked);
        setLikesCount(prevCount);
        toast.error(getErrorMessage(err, "Gagal memperbarui suka artikel."));
      },
    });
  };

  const handleToggleBookmark = () => {
    if (toggleBookmarkMutation.isPending) return;
    const prevBookmarked = isBookmarked;
    const prevCount = bookmarksCount;
    const nextState = !prevBookmarked;

    setIsBookmarked(nextState);
    setBookmarksCount(nextState ? prevCount + 1 : Math.max(0, prevCount - 1));

    toggleBookmarkMutation.mutate(article.id, {
      onError: (err) => {
        setIsBookmarked(prevBookmarked);
        setBookmarksCount(prevCount);
        toast.error(
          getErrorMessage(err, "Gagal memperbarui simpanan artikel.")
        );
      },
    });
  };

  const handleToggleRepost = () => {
    if (toggleRepostMutation.isPending) return;
    const prevReposted = isReposted;
    const prevCount = repostsCount;
    const nextState = !prevReposted;

    setIsReposted(nextState);
    setRepostsCount(nextState ? prevCount + 1 : Math.max(0, prevCount - 1));

    toggleRepostMutation.mutate(article.id, {
      onError: (err) => {
        setIsReposted(prevReposted);
        setRepostsCount(prevCount);
        toast.error(getErrorMessage(err, "Gagal memperbarui repost artikel."));
      },
    });
  };

  const handleScrollToComments = () => {
    const el = document.getElementById("komentar");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const copiedOk = await copyTextToClipboard(window.location.href);
    if (copiedOk) {
      setCopied(true);
      toast.success("Tautan artikel berhasil disalin ke clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Gagal menyalin tautan ke clipboard.");
    }
  };

  return (
    <div className="mt-8 flex items-center justify-between gap-2 border-y border-[var(--dust)]/40 py-3">
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

      <div className="flex items-center gap-1 sm:gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleToggleRepost}
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
            {formatCounter(repostsCount)}
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

