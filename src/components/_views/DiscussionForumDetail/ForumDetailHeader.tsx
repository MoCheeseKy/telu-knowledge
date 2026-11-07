"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ForumPostDetail } from "./types";

interface ForumDetailHeaderProps {
  post: ForumPostDetail;
}

export default function ForumDetailHeader({ post }: ForumDetailHeaderProps) {
  return (
    <div className="flex flex-col w-full">
      {/* Tombol kembali ke feed forum diskusi */}
      <Link
        href="/discussion-forums"
        className="inline-flex items-center gap-2 text-xs font-medium text-[var(--muted)] hover:text-[var(--primary-text)] transition-colors mb-5 w-fit cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Kembali ke Forum Diskusi</span>
      </Link>

      {/* Meta persis seperti ForumPostCard: From {topic} by {publisher}, {postDate} */}
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

