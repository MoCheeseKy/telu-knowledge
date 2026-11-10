"use client";

import MyArticleCard from "@/components/_shared/MyArticleCard";
import {
    dummyDraftArticles,
    dummyPublishedArticles,
    dummyScheduledArticles
} from "@/components/_shared/MyArticleCard/_types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function MyArticlesView() {
    return (
        <div className="w-full flex flex-col py-2 mb-auto">
            {/* 1. JUDUL HALAMAN */}
            <h1 className="font-sans text-[32px] font-bold text-[var(--foreground)] mb-6">
                Artikel Saya
            </h1>

            {/* 2. TABS SHADCN */}
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

                    <TabsTrigger value="terjadwal">
                        Terjadwal
                    </TabsTrigger>

                    <TabsTrigger value="diterbitkan">
                        Diterbitkan
                    </TabsTrigger>

                    <TabsTrigger value="tidak_publik">
                        Tidak Publik
                    </TabsTrigger>
                </TabsList>



                {/* Subheader Kolom (Terbaru, Publikasi, Status) */}
                <div className="flex items-center justify-between text-[13px] text-[var(--muted)] pt-6 pb-2">
                    <span>Terbaru</span>
                    <div className="flex items-center gap-16 mr-10 sm:mr-16">
                        <span>Publikasi</span>
                        <span>Status</span>
                    </div>
                </div>

                {/* 3. LIST ARTIKEL SAAT TAB DRAFT AKTIF */}
                <TabsContent value="draft" className="flex flex-col m-0">
                    {dummyDraftArticles.map((article) => (
                        <MyArticleCard key={article.id} {...article} />
                    ))}
                </TabsContent>
                {/* Tab Terjadwal */}
                <TabsContent value="terjadwal" className="flex flex-col m-0">
                    {dummyScheduledArticles.map((article) => (
                        <MyArticleCard key={article.id} {...article} />
                    ))}
                </TabsContent>
                {/* Tab Diterbitkan */}
                <TabsContent value="diterbitkan" className="flex flex-col m-0">
                    {dummyPublishedArticles.map((article) => (
                        <MyArticleCard key={article.id} {...article} />
                    ))}
                </TabsContent>

                <TabsContent value="tidak_publik" className="py-12 text-center text-[var(--muted)]">
                    Tidak ada artikel private.
                </TabsContent>
            </Tabs>
        </div>
    );
}