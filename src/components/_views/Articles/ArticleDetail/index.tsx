"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useArticleDetail } from "@/services/articles/articles.queries";
import { isApiError } from "@/lib/api/errors";
import { getErrorMessage } from "@/lib/api/error-messages";
import ArticleDetailHeader from "./ArticleDetailHeader";
import ArticleDetailContent from "./ArticleDetailContent";
import ArticleDetailActions from "./ArticleDetailActions";
import ArticleCommentsSection from "./ArticleCommentsSection";
import ArticleAuthorSidebar from "./ArticleAuthorSidebar";
import type { ArticleDetailViewProps } from "./article-detail.types";

/** Skeleton placeholder saat detail artikel sedang dimuat. */
function ArticleDetailSkeleton() {
  return (
    <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-12 xl:gap-16 py-6 animate-pulse">
      <div className="flex-1 flex flex-col w-full max-w-[679px]">
        <div className="h-4 w-24 bg-[var(--dust)]/40 rounded mb-4" />

        <div className="mt-6 space-y-3">
          <div className="h-10 w-full bg-[var(--dust)]/40 rounded" />
          <div className="h-10 w-4/5 bg-[var(--dust)]/40 rounded" />
          <div className="h-5 w-2/3 bg-[var(--dust)]/30 rounded mt-3" />
        </div>

        <div className="w-full h-72 rounded-2xl bg-[var(--dust)]/40 my-6" />

        <div className="space-y-4">
          <div className="h-4 w-full bg-[var(--dust)]/30 rounded" />
          <div className="h-4 w-full bg-[var(--dust)]/30 rounded" />
          <div className="h-4 w-5/6 bg-[var(--dust)]/30 rounded" />
          <div className="h-4 w-4/6 bg-[var(--dust)]/30 rounded" />
        </div>
      </div>

      <div className="w-full lg:w-[320px] xl:w-[340px] shrink-0 flex flex-col gap-8 pt-2">
        <div className="w-full h-60 rounded-xl bg-[var(--dust)]/40" />
        <div className="w-full h-48 rounded-xl bg-[var(--dust)]/30" />
      </div>
    </div>
  );
}

/**
 * Tampilan utama halaman detail artikel beserta aksi interaksi, komentar, dan sidebar penulis.
 */
export default function ArticleDetailView({
  articleId,
}: ArticleDetailViewProps) {
  const {
    data: article,
    isLoading,
    isError,
    error,
    refetch,
  } = useArticleDetail(articleId);

  if (isLoading) {
    return <ArticleDetailSkeleton />;
  }

  if (isError || !article) {
    const isNotFound = !isError || (isApiError(error) && error.statusCode === 404);
    const title = isNotFound ? "Artikel Tidak Ditemukan" : "Gagal Memuat Artikel";
    const description = isNotFound
      ? "Artikel yang Anda tuju mungkin telah dihapus, berstatus draft, atau URL tidak valid."
      : getErrorMessage(error, "Terjadi gangguan saat mengambil detail artikel.");

    return (
      <div className="w-full max-w-[679px] mx-auto py-16 flex flex-col items-center justify-center text-center">
        <h2 className="font-newsreader text-2xl font-bold text-[var(--foreground)] mb-2">
          {title}
        </h2>
        <p className="text-sm text-[var(--muted)] max-w-md mb-6">
          {description}
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 text-xs font-semibold text-white bg-[var(--primary-text)] rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
          >
            Coba Muat Ulang
          </button>
          <Link
            href="/discover-articles"
            className="px-4 py-2 text-xs font-semibold text-[var(--foreground)] border border-[var(--dust)] rounded-lg hover:bg-[var(--background-accent)] transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Cari Artikel</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-12 xl:gap-16 py-6">
      <div className="flex-1 flex flex-col w-full max-w-[679px]">
        <ArticleDetailHeader article={article} />
        <ArticleDetailContent article={article} />
        <ArticleDetailActions article={article} />
        <ArticleCommentsSection
          articleId={article.id}
          initialComments={article.comments || []}
        />
      </div>

      <ArticleAuthorSidebar author={article.author} />
    </div>
  );
}

