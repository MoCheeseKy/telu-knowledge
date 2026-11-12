"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { ForumPostDetail } from "./types";
import { Button } from "@/components/ui/button";
import CommunityPostDeleteButton from "@/components/_views/CommunityDetail/CommunityPostDeleteButton";

interface ForumDetailHeaderProps {
  post: ForumPostDetail;
  isMine?: boolean;
  communityId?: string;
  postId?: string;
}

export default function ForumDetailHeader({
  post,
  isMine = false,
  communityId,
  postId,
}: ForumDetailHeaderProps) {
  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between gap-4 mb-5">
        <Link
          href="/discussion-forums"
          className="inline-flex items-center gap-2 text-xs font-medium text-[var(--muted)] hover:text-[var(--primary-text)] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Forum Diskusi</span>
        </Link>

        {isMine && postId && (
          <div className="flex items-center gap-2">
            <Link
              href={`/communities/${communityId || "1"}/post/${postId}/edit`}
            >
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2.5 py-1 gap-1.5 hover:bg-[var(--background-accent)] rounded-md text-[var(--foreground)] [&_svg]:size-3.5"
                aria-label="Sunting postingan"
              >
                <Pencil />
                <span className="font-sans text-xs font-bold">Sunting</span>
              </Button>
            </Link>

            <CommunityPostDeleteButton
              communityId={communityId || "1"}
              postId={String(postId)}
              postTitle={post.title}
              redirectHref="/discussion-forums"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {post.publisher.avatarUrl ? (
          <img
            src={post.publisher.avatarUrl}
            alt={post.publisher.name}
            className="w-6 h-6 rounded-[3px] object-cover shrink-0"
          />
        ) : (
          <div
            aria-hidden="true"
            className="w-6 h-6 bg-[var(--primary)] text-white text-[11px] font-bold rounded-[3px] shrink-0 flex items-center justify-center select-none"
          >
            {post.publisher.initial}
          </div>
        )}

        <p className="font-sans text-[11px] leading-none text-[var(--foreground)]">
          <span>From </span>
          <span className="text-[var(--primary-text)] font-semibold">{post.topic}</span>
          <span> by </span>
          <span className="text-[var(--primary-text)] font-semibold">{post.publisher.name}</span>
          <span>, </span>
          <span className="font-semibold">{post.postDate}</span>
        </p>
      </div>
    </div>
  );
}

