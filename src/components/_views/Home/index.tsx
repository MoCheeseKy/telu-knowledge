"use client";

import { useRouter } from "next/navigation";
import { useArticleFeed } from "@/services/articles/articles.queries";
import {
  useCommunityRecommendations,
  useTopicRecommendations,
  useWriterRecommendations,
} from "@/services/recommendations/recommendations.queries";
import ArticleCard from "@/components/_shared/ArticleCard";
import TopicRecommenndations from "@/components/_shared/TopicRecommenndations";
import WritterRecommendations from "@/components/_shared/WritterRecommendations";
import ActiveForumRecommendations from "@/components/_shared/ActiveForumRecommendations";

function formatDate(dateString?: string | null): string {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
  } catch {
    return dateString;
  }
}

function formatCounter(count?: number): string {
  if (typeof count !== "number") return "0";
  if (count >= 1000) {
    const formatted = (count / 1000).toFixed(1).replace(".", ",");
    return `${formatted}k`;
  }
  return String(count);
}

function ArticleCardSkeleton() {
  return (
    <div className="w-full max-w-[679px] flex flex-col animate-pulse">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-[3px] bg-[var(--dust)]/40 shrink-0" />
        <div className="h-4 w-48 bg-[var(--dust)]/40 rounded" />
      </div>
      <div className="flex items-start justify-between gap-4 sm:gap-6 md:gap-[32px] mt-2.5">
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-7 w-5/6 bg-[var(--dust)]/40 rounded" />
          <div className="h-4 w-full bg-[var(--dust)]/30 rounded mt-1" />
          <div className="h-4 w-3/4 bg-[var(--dust)]/30 rounded" />
        </div>
        <div className="w-[100px] h-[72px] sm:w-[140px] sm:h-[96px] md:w-[160px] md:h-[107px] rounded-lg sm:rounded-xl bg-[var(--dust)]/40 shrink-0" />
      </div>
      <div className="mt-4 flex items-center gap-4">
        <div className="h-6 w-16 bg-[var(--dust)]/30 rounded" />
        <div className="h-6 w-16 bg-[var(--dust)]/30 rounded" />
        <div className="h-6 w-16 bg-[var(--dust)]/30 rounded" />
      </div>
    </div>
  );
}

export default function HomeView() {
  const router = useRouter();
  const { data: articles, isLoading, isError, refetch } = useArticleFeed();
  const { data: topics } = useTopicRecommendations();
  const { data: writers } = useWriterRecommendations();
  const { data: communities } = useCommunityRecommendations();

  return (
    <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-12 xl:gap-16 py-2 sm:py-6">
      <div className="flex-1 flex flex-col w-full max-w-[679px]">
        <div className="flex flex-col gap-2 mb-8 sm:mb-12 md:mb-[64px]">
          <h1 className="font-sans text-[26px] sm:text-[32px] font-bold text-[var(--primary-text)] leading-tight">
            Temukan Sesuatu Yang Menarik!
          </h1>
          <p className="font-sans text-[15px] sm:text-[16px] font-normal text-[var(--foreground)] leading-relaxed">
            Catatan, refleksi proyek, dan ruang diskusi mahasiswa Telkom University.
          </p>
        </div>

        <div className="flex flex-col gap-10">
          {isLoading ? (
            <>
              <ArticleCardSkeleton />
              <div className="w-full border-t border-[var(--dust)]/40" />
              <ArticleCardSkeleton />
              <div className="w-full border-t border-[var(--dust)]/40" />
              <ArticleCardSkeleton />
            </>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-xl border-[var(--dust)]">
              <p className="text-sm text-[var(--foreground)] font-medium mb-3">
                Gagal memuat feed artikel dari mock server.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="px-4 py-2 text-sm font-semibold text-white bg-[var(--primary-text)] rounded-lg hover:opacity-90 transition-opacity"
              >
                Coba Lagi
              </button>
            </div>
          ) : !articles || articles.length === 0 ? (
            <div className="p-8 text-center text-sm text-[var(--foreground)]">
              Belum ada artikel publik yang tersedia.
            </div>
          ) : (
            articles.map((article, index) => (
              <div key={article.id} className="flex flex-col gap-10">
                <ArticleCard
                  id={article.id}
                  topic={article.topic}
                  publisher={article.author.displayName}
                  avatarUrl={article.author.avatarUrl || undefined}
                  postDate={formatDate(article.publishedAt || article.createdAt)}
                  title={article.title}
                  description={article.excerpt || article.subtitle || ""}
                  imageUrl={article.coverImageUrl || ""}
                  likesCount={formatCounter(article.stats.likesCount)}
                  commentsCount={formatCounter(article.stats.commentsCount)}
                  repostsCount={formatCounter(article.stats.repostsCount)}
                  isLiked={article.isLiked}
                  isBookmarked={article.isBookmarked}
                  onClick={() =>
                    router.push(
                      `/discovers-articles/${article.id}/article-detail`
                    )
                  }
                />
                {index < articles.length - 1 && (
                  <div className="w-full border-t border-[var(--dust)]/40" />
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <aside className="w-full lg:w-[320px] xl:w-[340px] shrink-0 lg:sticky lg:top-24 flex flex-col gap-[32px] pt-2">
        <WritterRecommendations writers={writers} />
        <ActiveForumRecommendations forums={communities} />
      </aside>
    </div>
  );
}
