"use client";

import React, { useState, useEffect } from "react";
import { Check, Globe, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import WritterRecommendations from "@/components/_shared/WritterRecommendations";
import { useWriterRecommendations } from "@/services/recommendations/recommendations.queries";
import { useToggleProfileFollow } from "@/services/articles/articles.queries";
import type { ArticleDetailAuthor } from "@/services/articles/articles.types";

interface ArticleAuthorSidebarProps {
  author: ArticleDetailAuthor;
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 0 0 1.64-1.64c0-.91-.73-1.64-1.64-1.64a1.64 1.64 0 0 0-1.64 1.64c0 .91.73 1.64 1.64 1.64m1.39 9.74v-8.37H5.07v8.37h2.78z" />
    </svg>
  );
}

const formatExternalUrl = (url?: string | null): string => {
  if (!url) return "";
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

export default function ArticleAuthorSidebar({
  author,
}: ArticleAuthorSidebarProps) {
  const [isFollowing, setIsFollowing] = useState(Boolean(author.isFollowing));
  const toggleFollowMutation = useToggleProfileFollow();

  useEffect(() => {
    setIsFollowing(Boolean(author.isFollowing));
  }, [author.isFollowing]);

  const { data: topWriters } = useWriterRecommendations();

  const initial = (author.displayName || "U").charAt(0).toUpperCase();

  const handleToggleFollow = () => {
    const nextState = !isFollowing;
    setIsFollowing(nextState);
    toggleFollowMutation.mutate(author.id);
  };

  const hasSocials = Boolean(author.website || author.github || author.linkedin);

  return (
    <aside className="w-full lg:w-[320px] xl:w-[340px] shrink-0 lg:sticky lg:top-24 flex flex-col gap-9 pt-2">
      <div className="flex flex-col p-5 sm:p-6 rounded-2xl bg-[var(--background)] border border-[var(--dust)] shadow-2xs">
        <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] mb-4">
          Tentang Penulis
        </span>

        <div className="flex items-center gap-3.5 mb-4">
          {author.avatarUrl ? (
            <img
              src={author.avatarUrl}
              alt={author.displayName}
              className="size-13 rounded-full object-cover shrink-0 ring-1 ring-[var(--dust)]/60"
            />
          ) : (
            <div
              aria-hidden="true"
              style={{ backgroundColor: author.avatarColor || "var(--primary)" }}
              className="size-13 rounded-full text-white text-lg font-bold shrink-0 flex items-center justify-center select-none shadow-2xs"
            >
              {initial}
            </div>
          )}

          <div className="flex flex-col min-w-0">
            <h4 className="font-sans text-[16px] font-bold text-[var(--foreground)] truncate leading-tight">
              {author.displayName}
            </h4>
            {author.username && (
              <span className="font-mono text-xs text-[var(--muted)] mt-0.5 truncate">
                @{author.username}
              </span>
            )}
          </div>
        </div>

        {author.bio && (
          <p className="font-sans text-xs sm:text-[13px] text-[#3E3A38] leading-relaxed mb-4">
            {author.bio}
          </p>
        )}

        {hasSocials && (
          <div className="mb-4 flex items-center gap-2 pt-2 border-t border-[var(--dust)]/40 text-[var(--muted)]">
            {author.website && (
              <a
                href={formatExternalUrl(author.website)}
                target="_blank"
                rel="noopener noreferrer"
                title={`Website: ${author.website}`}
                className="size-8 rounded-lg border border-[var(--dust)]/60 flex items-center justify-center text-[var(--muted)] hover:text-[var(--primary-text)] hover:border-[var(--primary-text)] hover:bg-[var(--background-accent)] transition-all cursor-pointer shadow-2xs"
              >
                <Globe className="size-4" />
              </a>
            )}
            {author.github && (
              <a
                href={formatExternalUrl(author.github)}
                target="_blank"
                rel="noopener noreferrer"
                title={`GitHub: ${author.github}`}
                className="size-8 rounded-lg border border-[var(--dust)]/60 flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground)] hover:bg-[var(--background-accent)] transition-all cursor-pointer shadow-2xs"
              >
                <GithubIcon className="size-4" />
              </a>
            )}
            {author.linkedin && (
              <a
                href={formatExternalUrl(author.linkedin)}
                target="_blank"
                rel="noopener noreferrer"
                title={`LinkedIn: ${author.linkedin}`}
                className="size-8 rounded-lg border border-[var(--dust)]/60 flex items-center justify-center text-[var(--muted)] hover:text-[#0A66C2] hover:border-[#0A66C2] hover:bg-[var(--background-accent)] transition-all cursor-pointer shadow-2xs"
              >
                <LinkedinIcon className="size-4" />
              </a>
            )}
          </div>
        )}

        {/* 5. Tombol Follow Full-Width di Bagian Bawah */}
        <Button
          type="button"
          size="default"
          onClick={handleToggleFollow}
          className={cn(
            "w-full h-10 text-xs font-semibold rounded-xl cursor-pointer transition-all gap-2",
            isFollowing
              ? "bg-transparent border border-[var(--dust)] text-[var(--foreground)] hover:border-[var(--primary-text)] hover:text-[var(--primary-text)] hover:bg-[var(--background-accent)]"
              : "bg-[var(--primary-text)] text-white hover:bg-[var(--primary-hover)] shadow-xs"
          )}
        >
          {isFollowing ? (
            <>
              <Check className="size-4 text-[var(--success-text)]" />
              <span>Mengikuti</span>
            </>
          ) : (
            <>
              <UserPlus className="size-4" />
              <span>+ Ikuti Penulis</span>
            </>
          )}
        </Button>
      </div>

      {/* Daftar Top 5 Penulis dengan Followers Terbanyak */}
      <WritterRecommendations
        title="TOP PENULIS"
        writers={topWriters}
      />
    </aside>
  );
}
