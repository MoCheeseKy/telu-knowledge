"use client";

import React, { useState } from "react";
import { ThumbsUp, MessageSquareMore, Repeat2, Bookmark, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { copyTextToClipboard } from "@/lib/clipboard";
import { useToast } from "@/components/ui/toast";
import type { ForumDetailActionsProps } from "./discussion-forum-detail.types";
import { getErrorMessage } from "@/lib/api/error-messages";
import {
  useForumPostDetail,
  useToggleForumPostLike,
  useForumPostRepostStatus,
  useToggleForumPostRepost,
} from "@/services/communities/community-posts.queries";

const actionButtonClass =
  "h-7 px-2 py-1 gap-1.5 hover:bg-[var(--background-accent)] rounded-md text-[var(--foreground)] [&_svg]:size-4 transition-colors cursor-pointer";

/**
 * Bar aksi interaktif pada detail postingan forum (suka, komentar, repost, simpan, dan bagikan tautan).
 */
export default function ForumDetailActions({
  postId,
  initialScore,
  commentsCount,
  repostsCount,
  isSaved = false,
}: ForumDetailActionsProps) {
  const { data: postDetail } = useForumPostDetail(postId ? String(postId) : undefined);
  const toggleLike = useToggleForumPostLike();
  const [likeOverride, setLikeOverride] = useState<{ liked: boolean; count: number } | null>(null);

  const isLiked = likeOverride?.liked ?? Boolean(postDetail?.isLiked);
  const likesCount = likeOverride?.count ?? initialScore;
  const repostPostId = postId ? String(postId) : "";
  const { data: repostStatus } = useForumPostRepostStatus(repostPostId || undefined);
  const toggleRepost = useToggleForumPostRepost(repostPostId);

  const isReposted = repostStatus?.isReposted ?? false;
  const shownRepostsCount = repostStatus?.repostsCount ?? repostsCount;
  const [saved, setSaved] = useState(isSaved);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleToggleLike = () => {
    if (!postId || toggleLike.isPending) return;
    const nextLiked = !isLiked;
    setLikeOverride({ liked: nextLiked, count: Math.max(0, likesCount + (nextLiked ? 1 : -1)) });

    toggleLike.mutate(String(postId), {
      onSuccess: (res) =>
        setLikeOverride({ liked: res.data.isLiked, count: res.data.score }),
      onError: (err) => {
        setLikeOverride(null);
        toast.error(getErrorMessage(err, "Gagal memperbarui suka."));
      },
    });
  };

    const handleToggleRepost = () => {
    if (!repostPostId || toggleRepost.isPending) return;
    toggleRepost.mutate(undefined, {
      onError: (err) => {
        toast.error(getErrorMessage(err, "Gagal mengubah status repost."));
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

    const shareUrl = postId
      ? `${window.location.origin}/discussion-forums/${postId}`
      : window.location.href.split("#")[0];

    const copiedOk = await copyTextToClipboard(shareUrl);
    if (copiedOk) {
      setCopied(true);
      toast.success("Tautan postingan forum berhasil disalin ke clipboard!");
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
          className={actionButtonClass}
          aria-label="Suka"
          onClick={handleToggleLike}
        >
          <ThumbsUp
            className={cn(
              "transition-colors",
              isLiked
                ? "fill-[var(--primary-text)] text-[var(--primary-text)]"
                : "text-[var(--foreground)]"
            )}
          />
          <span
            className={cn(
              "font-sans text-xs font-bold",
              isLiked && "text-[var(--primary-text)]"
            )}
          >
            {likesCount}
          </span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={actionButtonClass}
          aria-label="Komentar"
          onClick={handleScrollToComments}
        >
          <MessageSquareMore />
          <span className="font-sans text-xs font-bold">{commentsCount}</span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={actionButtonClass}
          aria-label={isReposted ? "Batalkan repost" : "Repost"}
          onClick={handleToggleRepost}
          aria-pressed={isReposted}
          disabled={toggleRepost.isPending}
        >
          <Repeat2
            className={cn(
              "transition-colors",
              isReposted ? "text-[var(--primary-text)]" : "text-[var(--foreground)]"
            )}
          />
          <span
            className={cn(
              "font-sans text-xs font-bold",
              isReposted && "text-[var(--primary-text)]"
            )}
          >
            {shownRepostsCount}
          </span>
        </Button>
      </div>

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setSaved(!saved)}
          className="h-7 w-7 hover:bg-[var(--background-accent)] rounded-md text-[var(--foreground)] [&_svg]:size-4 cursor-pointer"
          aria-label={saved ? "Tersimpan" : "Simpan"}
          title={saved ? "Tersimpan" : "Simpan"}
        >
          <Bookmark
            className={cn(
              "transition-colors",
              saved
                ? "fill-[var(--foreground)] text-[var(--foreground)]"
                : "text-[var(--foreground)]"
            )}
          />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleShare}
          className="h-7 w-7 hover:bg-[var(--background-accent)] rounded-md text-[var(--foreground)] [&_svg]:size-4 cursor-pointer relative"
          aria-label="Bagikan"
          title={copied ? "Tautan disalin" : "Salin tautan"}
        >
          {copied ? (
            <Check className="text-[var(--success-text)]" />
          ) : (
            <Share2 />
          )}
        </Button>
      </div>
    </div>
  );
}
