"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import MyArticleCard from "@/components/_shared/MyArticleCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import {
  useMyArticles,
  usePublishArticle,
  useDeleteArticle,
} from "@/services/articles/articles.queries";

function MyArticleCardSkeleton() {
  return (
    <div className="flex items-center justify-between py-4 border-b border-[var(--dust)]/40 gap-4 animate-pulse">
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
        <div className="w-[100px] h-[70px] sm:w-[120px] sm:h-[80px] rounded-[4px] bg-[var(--dust)]/40 shrink-0" />
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <div className="h-4 w-3/5 bg-[var(--dust)]/40 rounded" />
          <div className="h-3 w-4/5 bg-[var(--dust)]/30 rounded" />
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-[var(--dust)]/30" />
        <div className="w-8 h-8 rounded-lg bg-[var(--dust)]/30" />
      </div>
    </div>
  );
}

export default function MyArticlesView() {
  const [activeTab, setActiveTab] = useState<string>("draft");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    data: draftData,
    isLoading: isLoadingDraft,
    isError: isErrorDraft,
    error: errorDraft,
    refetch: refetchDrafts,
  } = useMyArticles({ status: "draft" });

  const {
    data: publishedData,
    isLoading: isLoadingPublished,
    isError: isErrorPublished,
    error: errorPublished,
    refetch: refetchPublished,
  } = useMyArticles({ status: "published" });

  const publishMutation = usePublishArticle();
  const deleteMutation = useDeleteArticle();

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Artikel berhasil dihapus.");
      void refetchDrafts();
      void refetchPublished();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Gagal menghapus artikel.";
      toast.error(errorMsg);
    } finally {
      setDeletingId(null);
    }
  };

  const handlePublish = async (id: string) => {
    setPublishingId(id);
    try {
      await publishMutation.mutateAsync(id);
      toast.success("Artikel berhasil dipublikasikan!");
      void refetchDrafts();
      void refetchPublished();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Gagal mempublikasikan artikel.";
      toast.error(errorMsg);
    } finally {
      setPublishingId(null);
    }
  };

  const drafts = draftData?.items || [];
  const published = publishedData?.items || [];

  return (
    <div className="w-full flex flex-col py-2 mb-auto">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h1 className="font-sans text-[24px] sm:text-[32px] font-bold text-[var(--foreground)]">
          Artikel Saya
        </h1>
        <Link
          href="/editor-studio"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white transition-colors cursor-pointer shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tulis Artikel</span>
        </Link>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList
          variant="line"
          className="bg-transparent border-b border-[var(--dust)]/60 rounded-none w-full justify-start h-auto p-0 gap-6"
        >
          <TabsTrigger value="draft" className="cursor-pointer">
            Draft {drafts.length > 0 && `(${drafts.length})`}
          </TabsTrigger>

          <TabsTrigger value="diterbitkan" className="cursor-pointer">
            Diterbitkan {published.length > 0 && `(${published.length})`}
          </TabsTrigger>
        </TabsList>

        <div className="flex items-center justify-between text-[12px] sm:text-[13px] text-[var(--muted)] pt-5 sm:pt-6 pb-2">
          <span>Terbaru</span>
        </div>

        <TabsContent value="draft" className="flex flex-col m-0">
          {isLoadingDraft ? (
            <div className="flex flex-col">
              <MyArticleCardSkeleton />
              <MyArticleCardSkeleton />
              <MyArticleCardSkeleton />
            </div>
          ) : isErrorDraft ? (
            <div className="py-12 flex flex-col items-center justify-center text-center gap-2">
              <p className="text-sm text-[var(--failed)]">
                {errorDraft instanceof Error
                  ? errorDraft.message
                  : "Gagal memuat daftar draft artikel."}
              </p>
              <button
                type="button"
                onClick={() => refetchDrafts()}
                className="text-xs text-[var(--primary-text)] font-semibold hover:underline cursor-pointer"
              >
                Coba lagi
              </button>
            </div>
          ) : drafts.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
              <p className="text-sm text-[var(--muted)]">
                Belum ada draft artikel.
              </p>
              <Link
                href="/editor-studio"
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors"
              >
                + Mulai Tulis Draft Pertama
              </Link>
            </div>
          ) : (
            drafts.map((article) => (
              <MyArticleCard
                key={article.id}
                id={article.id}
                title={article.title || "Tanpa Judul"}
                description={
                  article.subtitle ||
                  article.excerpt ||
                  "Belum ada ringkasan atau konten tulisan..."
                }
                imageUrl={article.coverImageUrl || undefined}
                readTime={
                  article.readingTimeMinutes
                    ? `${article.readingTimeMinutes} menit baca`
                    : undefined
                }
                status="draft"
                isDeleting={deletingId === article.id}
                isPublishing={publishingId === article.id}
                onDelete={() => handleDelete(article.id)}
                onPublish={() => handlePublish(article.id)}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="diterbitkan" className="flex flex-col m-0">
          {isLoadingPublished ? (
            <div className="flex flex-col">
              <MyArticleCardSkeleton />
              <MyArticleCardSkeleton />
              <MyArticleCardSkeleton />
            </div>
          ) : isErrorPublished ? (
            <div className="py-12 flex flex-col items-center justify-center text-center gap-2">
              <p className="text-sm text-[var(--failed)]">
                {errorPublished instanceof Error
                  ? errorPublished.message
                  : "Gagal memuat daftar artikel yang diterbitkan."}
              </p>
              <button
                type="button"
                onClick={() => refetchPublished()}
                className="text-xs text-[var(--primary-text)] font-semibold hover:underline cursor-pointer"
              >
                Coba lagi
              </button>
            </div>
          ) : published.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
              <p className="text-sm text-[var(--muted)]">
                Belum ada artikel yang diterbitkan.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("draft")}
                className="text-xs text-[var(--primary-text)] font-semibold hover:underline cursor-pointer"
              >
                Lihat Draft Tulisan Anda →
              </button>
            </div>
          ) : (
            published.map((article) => (
              <MyArticleCard
                key={article.id}
                id={article.id}
                title={article.title || "Tanpa Judul"}
                description={
                  article.subtitle ||
                  article.excerpt ||
                  "Belum ada ringkasan atau konten tulisan..."
                }
                imageUrl={article.coverImageUrl || undefined}
                readTime={
                  article.readingTimeMinutes
                    ? `${article.readingTimeMinutes} menit baca`
                    : undefined
                }
                status="published"
                isDeleting={deletingId === article.id}
                onDelete={() => handleDelete(article.id)}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
