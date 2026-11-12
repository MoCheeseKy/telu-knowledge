"use client";

import React from "react";
import Link from "next/link";
import ForumDetailHeader from "./ForumDetailHeader";
import ForumDetailContent from "./ForumDetailContent";
import ForumDetailActions from "./ForumDetailActions";
import ForumCommentsThread from "./ForumCommentsThread";
import ForumCommunitySidebar from "./ForumCommunitySidebar";
import { useForumPostDetail } from "@/services/community-posts/community-posts.queries";
import { MOCK_VIEWER_ID } from "@/services/community-posts/community-posts.types";
import { sampleForumPost, mapForumPostDtoToDetail, ForumPostDetail } from "./types";

interface DiscussionForumDetailViewProps {
  postId?: string;
  initialPost?: ForumPostDetail;
}

export default function DiscussionForumDetailView({
  postId,
  initialPost = sampleForumPost,
}: DiscussionForumDetailViewProps) {
  // Konten post dari mock server (GET /proxy/forum-posts/:postId).
  // Cakupan: konten post saja — komentar/like/save di luar cakupan integrasi ini.
  const {
    data: postDto,
    isLoading,
    isError,
    refetch,
  } = useForumPostDetail(postId);

  if (postId && isLoading) {
    return (
      <div className="w-full max-w-[679px] animate-pulse py-6" aria-busy="true">
        <div className="h-5 w-52 bg-[var(--dust)]/40 rounded" />
        <div className="mt-6 h-8 w-4/5 bg-[var(--dust)]/40 rounded" />
        <div className="mt-8 h-[320px] w-full bg-[var(--dust)]/30 rounded-xl" />
        <div className="mt-6 h-4 w-full bg-[var(--dust)]/30 rounded" />
        <div className="mt-3 h-4 w-5/6 bg-[var(--dust)]/30 rounded" />
      </div>
    );
  }

  if (postId && (isError || !postDto)) {
    return (
      <div className="mt-8 flex min-h-[240px] w-full max-w-[679px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[var(--dust)]/70 text-center">
        <p className="font-sans text-sm font-semibold text-[var(--foreground)]">
          Postingan tidak ditemukan
        </p>
        <p className="font-sans text-[13px] text-[var(--muted)]">
          Postingan mungkin sudah dihapus atau tautannya tidak valid.
        </p>
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => void refetch()}
            className="inline-flex h-9 items-center rounded-lg border border-[var(--dust)] px-4 font-sans text-[13px] font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--background-accent)] cursor-pointer"
          >
            Coba lagi
          </button>
          <Link
            href="/discussion-forums"
            className="inline-flex h-9 items-center rounded-lg bg-[var(--primary)] px-4 font-sans text-[13px] font-semibold text-white transition-colors hover:bg-[var(--primary-hover)]"
          >
            Kembali ke Forum Diskusi
          </Link>
        </div>
      </div>
    );
  }

  const post: ForumPostDetail = postDto
    ? mapForumPostDtoToDetail(postDto)
    : {
        ...initialPost,
        ...(postId ? { id: postId } : {}),
      };

  const isMine = postDto?.authorId === MOCK_VIEWER_ID;

  return (
    <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-12 xl:gap-16 py-6">
      {/* Kolom utama diskusi (lebar maksimal 679px, konsisten dengan DiscussionForumsView dan HomeView) */}
      <div className="flex-1 flex flex-col w-full max-w-[679px]">
        <ForumDetailHeader
          post={post}
          isMine={isMine}
          communityId={postDto?.communityId}
          postId={postId || String(post.id)}
        />
        <ForumDetailContent post={post} />
        <ForumDetailActions
          initialScore={post.score}
          commentsCount={post.commentsCount}
          repostsCount={post.repostsCount}
          isSaved={post.isSaved}
        />
        <ForumCommentsThread initialComments={post.comments} />
      </div>

      {/* Sidebar kanan (konsisten dengan sidebar DiscussionForumsView dan HomeView) */}
      <ForumCommunitySidebar post={post} />
    </div>
  );
}
