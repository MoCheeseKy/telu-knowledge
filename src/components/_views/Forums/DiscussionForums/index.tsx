"use client";

import { Fragment } from "react";
import ForumPostCard from "@/components/_shared/ForumPostCard";
import ActiveForumRecommendations from "@/components/_shared/ActiveForumRecommendations";
import CommunityPostDeleteButton from "@/components/_views/Communities/CommunityDetail/CommunityPostDeleteButton";
import { useAllForumPosts } from "@/services/communities/community-posts.queries";
import { useCommunityRecommendations } from "@/services/recommendations/recommendations.queries";
import { MOCK_VIEWER_ID } from "@/services/communities/community-posts.types";
import { formatDate } from "@/lib/formatters";
import { getErrorMessage } from "@/lib/api/error-messages";

export default function DiscussionForumsView() {
  const {
    data: posts,
    isLoading: isLoadingPosts,
    isError: isErrorPosts,
    error: postsError,
    refetch: refetchPosts,
  } = useAllForumPosts();
  const { data: recommendations, isLoading: isLoadingRecs } =
    useCommunityRecommendations();

  return (
    <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-12 xl:gap-16 py-2 sm:py-6">
      <div className="flex-1 flex flex-col w-full max-w-[679px]">
        <div className="flex flex-col gap-2 mb-8 sm:mb-12 md:mb-[64px]">
          <h1 className="font-sans text-[26px] sm:text-[32px] font-bold text-[var(--primary-text)] leading-tight">
            Temukan Sesuatu Yang Menarik!
          </h1>
          <p className="max-w-full sm:max-w-[380px] font-sans text-[15px] sm:text-[16px] font-normal text-[var(--foreground)] leading-relaxed">
            Catatan, refleksi proyek, dan ruang diskusi mahasiswa Telkom University.
          </p>
        </div>

        {isLoadingPosts ? (
          <div className="flex flex-col gap-8 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex flex-col gap-3 py-4">
                <div className="h-4 w-48 bg-[var(--dust)]/40 rounded" />
                <div className="h-6 w-3/4 bg-[var(--dust)]/40 rounded" />
                <div className="h-4 w-full bg-[var(--dust)]/30 rounded" />
                <div className="h-4 w-2/3 bg-[var(--dust)]/30 rounded" />
                <div className="h-48 w-full bg-[var(--dust)]/20 rounded-xl mt-2" />
              </div>
            ))}
          </div>
        ) : isErrorPosts ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-[var(--dust)]/70 text-center p-8 gap-3">
            <p className="font-sans text-base font-semibold text-[var(--foreground)]">
              Gagal memuat diskusi forum
            </p>
            <p className="font-sans text-[13px] text-[var(--muted)]">
              {getErrorMessage(
                postsError,
                "Terjadi kesalahan saat mengambil daftar diskusi forum."
              )}
            </p>
            <button
              type="button"
              onClick={() => void refetchPosts()}
              className="mt-1 inline-flex h-9 items-center rounded-lg border border-[var(--dust)] px-4 font-sans text-[13px] font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--background-accent)] cursor-pointer"
            >
              Coba lagi
            </button>
          </div>
        ) : !posts || posts.length === 0 ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-[var(--dust)]/70 text-center p-8">
            <p className="font-sans text-base font-semibold text-[var(--foreground)]">
              Belum ada diskusi forum
            </p>
            <p className="mt-1 font-sans text-[13px] text-[var(--muted)]">
              Mulai buat postingan baru di komunitas favorit Anda untuk memulai diskusi.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {posts.map((post, index) => {
              const isMine = post.authorId === MOCK_VIEWER_ID;
              const formattedDate = post.createdAt
                ? formatDate(post.createdAt)
                : "Baru saja";

              return (
                <Fragment key={post.id}>
                  {index > 0 && (
                    <div className="w-full border-t border-[var(--dust)]/40" />
                  )}
                  <ForumPostCard
                    id={post.id}
                    topic={post.communityName || "Komunitas Tel-U"}
                    publisher={post.author?.displayName || "Mahasiswa Tel-U"}
                    postDate={formattedDate}
                    avatarUrl={post.author?.avatarUrl || undefined}
                    title={post.title}
                    description={
                      post.content.length > 200
                        ? `${post.content.slice(0, 200).trim()}...`
                        : post.content
                    }
                    imageUrl={post.coverImageUrl || undefined}
                    imageAlt={post.imageCaption || post.title}
                    likesCount={post.likesCount ?? 0}
                    commentsCount={post.commentsCount ?? 0}
                    repostsCount={post.repostsCount ?? 0}
                    isLiked={Boolean(post.isLiked)}
                    editHref={
                      isMine
                        ? `/communities/${post.communityId || "1"}/post/${post.id}/edit`
                        : undefined
                    }
                    deleteAction={
                      isMine ? (
                        <CommunityPostDeleteButton
                          communityId={post.communityId || "1"}
                          postId={String(post.id)}
                          postTitle={post.title}
                        />
                      ) : undefined
                    }
                  />
                </Fragment>
              );
            })}
          </div>
        )}
      </div>

      <aside className="w-full lg:w-[320px] xl:w-[340px] shrink-0 lg:sticky lg:top-24 flex flex-col gap-[32px] pt-2">
        {isLoadingRecs ? (
          <div className="flex flex-col gap-4 animate-pulse">
            <div className="h-5 w-40 bg-[var(--dust)]/40 rounded" />
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-16 w-full bg-[var(--dust)]/20 rounded-lg" />
            ))}
          </div>
        ) : (
          <ActiveForumRecommendations
            title="TOP KOMUNITAS AKTIF"
            forums={recommendations ?? []}
          />
        )}
      </aside>
    </div>
  );
}
