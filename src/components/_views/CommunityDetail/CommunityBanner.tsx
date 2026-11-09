"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CommunityDetail } from "./types";

interface CommunityBannerProps {
  community: CommunityDetail;
  isJoined: boolean;
  onToggleJoin: () => void;
}

export default function CommunityBanner({
  community,
  isJoined,
  onToggleJoin,
}: CommunityBannerProps) {
  return (
    <section className="flex w-full flex-col">
      {/* Banner + avatar */}
      <div className="relative">
        <div className="h-[120px] w-full rounded-xl bg-[var(--primary-text)] sm:h-[140px]" />
        <img
          src={community.avatarUrl}
          alt={community.name}
          className="absolute left-6 top-[76px] h-20 w-20 rounded-full border-4 border-[var(--background)] bg-[var(--background-accent)] object-cover sm:left-8 sm:top-[70px] sm:h-[100px] sm:w-[100px]"
        />
      </div>

      {/* Judul dan aksi */}
      <div className="flex flex-col gap-4 px-3 pt-10 sm:px-5 sm:pt-8 md:flex-row md:items-start md:justify-between md:gap-6">
        <div className="min-w-0 flex-1 md:pt-2">
          <h1 className="min-w-0 break-words font-sans text-[22px] font-bold leading-[1.25] text-[var(--foreground)] sm:text-[25px]">
            {community.name}
          </h1>

          {/* Statistik ringkas (mobile) */}
          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 font-sans text-[12px] text-[var(--muted)] lg:hidden">
            <span>
              <span className="font-semibold text-[var(--foreground)]">
                {community.memberCount}
              </span>{" "}
              Anggota
            </span>
            <span aria-hidden="true">·</span>
            <span>
              <span className="font-semibold text-[var(--foreground)]">
                {community.postCount}
              </span>{" "}
              Postingan
            </span>
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <Link
            href={`/communities/${community.id}/post`}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-[var(--dust)] bg-transparent px-4 text-[13px] font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--background-accent)]"
          >
            <Plus className="h-4 w-4" />
            Buat Postingan
          </Link>

          <button
            type="button"
            onClick={onToggleJoin}
            aria-pressed={isJoined}
            className={cn(
              "inline-flex h-10 items-center justify-center rounded-lg px-5 text-[13px] font-semibold transition-colors",
              isJoined
                ? "border border-[var(--dust)] bg-transparent text-[var(--foreground)] hover:bg-[var(--background-accent)]"
                : "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
            )}
          >
            {isJoined ? "Diikuti" : "Gabung"}
          </button>
        </div>
      </div>
    </section>
  );
}
