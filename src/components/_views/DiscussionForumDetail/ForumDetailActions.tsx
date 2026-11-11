"use client";

import React, { useState } from "react";
import { ThumbsUp, MessageSquareMore, Repeat2, Bookmark, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

interface ForumDetailActionsProps {
  postId?: string | number;
  initialScore: number;
  commentsCount: number;
  repostsCount: number;
  isSaved?: boolean;
}

const actionButtonClass =
  "h-7 px-2 py-1 gap-1.5 hover:bg-[var(--background-accent)] rounded-md text-[var(--foreground)] [&_svg]:size-4 transition-colors cursor-pointer";

export default function ForumDetailActions({
  postId,
  initialScore,
  commentsCount,
  repostsCount,
  isSaved = false,
}: ForumDetailActionsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialScore);
  const [isReposted, setIsReposted] = useState(false);
  const [saved, setSaved] = useState(isSaved);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleToggleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
    }
  };

  const handleToggleRepost = () => {
    setIsReposted(!isReposted);
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

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      toast.success("Tautan postingan forum berhasil disalin ke clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Gagal menyalin tautan ke clipboard.");
    }
  };

  return (
    <div className="mt-8 flex items-center justify-between gap-2 border-y border-[var(--dust)]/40 py-3">
      {/* Suka, Komentar, Repost */}
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
          aria-label="Repost"
          onClick={handleToggleRepost}
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
            {repostsCount + (isReposted ? 1 : 0)}
          </span>
        </Button>
      </div>

      {/* Simpan & Bagikan */}
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
