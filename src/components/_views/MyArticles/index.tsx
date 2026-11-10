"use client";

import { useState } from "react";
import MyArticleCard from "@/components/_shared/MyArticleCard";
import {
    dummyDraftArticles,
    dummyPublishedArticles,
    type MyArticleItem,
} from "@/components/_shared/MyArticleCard/_types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function MyArticlesView() {
    const [draftArticles, setDraftArticles] =
        useState<MyArticleItem[]>(dummyDraftArticles);
    const [publishedArticles, setPublishedArticles] = useState<MyArticleItem[]>(
        dummyPublishedArticles
    );

    const handleDeleteDraft = (id?: string | number) => {
        setDraftArticles((prev) => prev.filter((item) => item.id !== id));
    };

    const handleDeletePublished = (id?: string | number) => {
        setPublishedArticles((prev) => prev.filter((item) => item.id !== id));
    };

    const handlePublishDraft = (article: MyArticleItem) => {
        setDraftArticles((prev) => prev.filter((item) => item.id !== article.id));
        setPublishedArticles((prev) => [
            { ...article, id: `pub-${article.id ?? Date.now()}` },
            ...prev,
        ]);
    };

    return (
        <div className="w-full flex flex-col py-2 mb-auto">
            {/* 1. JUDUL HALAMAN */}
            <h1 className="font-sans text-[24px] sm:text-[32px] font-bold text-[var(--foreground)] mb-4 sm:mb-6">
                Artikel Saya
            </h1>

            {/* 2. TABS SHADCN */}
            <Tabs defaultValue="draft" className="w-full">
                {/* Barisan Tab */}
                <TabsList
                    variant="line"
                    className="bg-transparent border-b border-[var(--dust)]/60 rounded-none w-full justify-start h-auto p-0 gap-6"
                >
                    <TabsTrigger value="draft">
                        Draft
                    </TabsTrigger>

                    <TabsTrigger value="diterbitkan">
                        Diterbitkan
                    </TabsTrigger>
                </TabsList>

                {/* Subheader Kolom (Terbaru) */}
                <div className="flex items-center justify-between text-[12px] sm:text-[13px] text-[var(--muted)] pt-5 sm:pt-6 pb-2">
                    <span>Terbaru</span>
                </div>

                {/* 3. LIST ARTIKEL SAAT TAB DRAFT AKTIF */}
                <TabsContent value="draft" className="flex flex-col m-0">
                    {draftArticles.length === 0 ? (
                        <p className="py-12 text-center text-sm text-[var(--muted)]">
                            Belum ada draft artikel.
                        </p>
                    ) : (
                        draftArticles.map((article) => (
                            <MyArticleCard
                                key={article.id}
                                {...article}
                                status="draft"
                                onDelete={() => handleDeleteDraft(article.id)}
                                onPublish={() => handlePublishDraft(article)}
                            />
                        ))
                    )}
                </TabsContent>

                {/* Tab Diterbitkan */}
                <TabsContent value="diterbitkan" className="flex flex-col m-0">
                    {publishedArticles.length === 0 ? (
                        <p className="py-12 text-center text-sm text-[var(--muted)]">
                            Belum ada artikel yang diterbitkan.
                        </p>
                    ) : (
                        publishedArticles.map((article) => (
                            <MyArticleCard
                                key={article.id}
                                {...article}
                                status="published"
                                onDelete={() => handleDeletePublished(article.id)}
                            />
                        ))
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}