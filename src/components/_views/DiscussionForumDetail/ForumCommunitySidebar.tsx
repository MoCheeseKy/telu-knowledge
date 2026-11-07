"use client";

import React, { useState } from "react";
import { ForumPostDetail } from "./types";
import { Button } from "@/components/ui/button";
import ActiveForumRecommendations from "@/components/_shared/ActiveForumRecommendations";
import { cn } from "@/lib/utils";

interface ForumCommunitySidebarProps {
  post: ForumPostDetail;
}

export default function ForumCommunitySidebar({
  post,
}: ForumCommunitySidebarProps) {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <aside className="w-full lg:w-[320px] xl:w-[340px] shrink-0 lg:sticky lg:top-24 flex flex-col gap-[32px] pt-2">
      {/* 1. Tentang Komunitas */}
      <section className="flex flex-col w-full">
        <h3 className="font-sans text-[16px] font-bold uppercase text-[var(--primary-text)] tracking-wider mb-2">
          TENTANG KOMUNITAS
        </h3>

        <div className="flex items-start justify-between gap-4 py-3 border-b border-[var(--dust)]/40 w-full">
          <div className="flex flex-col min-w-0 flex-1 gap-1">
            <h4 className="font-sans text-[16px] font-bold text-[var(--foreground)]">
              {post.topic}
            </h4>
            <p className="font-sans text-[14px] font-normal text-[var(--muted)] leading-relaxed">
              {post.communityDesc}
            </p>
            <span className="font-sans text-[12px] font-normal text-[var(--muted)] mt-0.5">
              {post.communityMembers} • {post.communityOnline}
            </span>
          </div>

          <Button
            type="button"
            size="sm"
            variant={isFollowing ? "ghost" : "default"}
            onClick={() => setIsFollowing(!isFollowing)}
            className={cn(
              "h-7 px-3 text-xs font-semibold rounded-md shrink-0 transition-all cursor-pointer",
              isFollowing
                ? "border border-[var(--dust)] text-[var(--foreground)] hover:bg-[var(--background-accent)]"
                : "bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-xs"
            )}
          >
            {isFollowing ? "Mengikuti" : "+ Ikuti"}
          </Button>
        </div>
      </section>

      {/* 2. Top Komunitas Aktif (Reused Component) */}
      <ActiveForumRecommendations title="TOP KOMUNITAS AKTIF" />
    </aside>
  );
}

