"use client";

import { useState } from "react";
import MyArticleHeader from "@/components/_shared/MyArticleHeader";
import MyArticleStats from "@/components/_shared/MyArticleStats";
import MyArticleForm from "@/components/_shared/MyArticleForm";
import MyArticleList from "@/components/_shared/MyArticleList";
import {
    initialArticles,
    MyArticleItem,
    ArticleStatus,
} from "@/components/_shared/MyArticleCard/_types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Trash2 } from "lucide-react";

export default function MyArticlesView() {
    const [articles, setArticles] = useState<MyArticleItem[]>(initialArticles);
    const [activeTab, setActiveTab] = useState<string>("draft");
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

    const draftArticles = articles.filter((a) => a.status === "draft");
    const scheduledArticles = articles.filter((a) => a.status === "terjadwal");
    const publishedArticles = articles.filter((a) => a.status === "diterbitkan");
    const privateArticles = articles.filter((a) => a.status === "tidak_publik");

    const handleAddArticle = (newArticleData: Omit<MyArticleItem, "id">) => {
        const newArticle: MyArticleItem = {
            ...newArticleData,
            id: Date.now(),
        };

        setArticles((prev) => [newArticle, ...prev]);

        if (newArticle.status) {
            setActiveTab(newArticle.status);
        }

        setIsFormOpen(false);
    };

    const handleDeleteArticle = (id: string | number) => {
        setArticles((prev) => prev.filter((item) => item.id !== id));
    };

    const handleClearCurrentTab = () => {
        setArticles((prev) => prev.filter((item) => item.status !== activeTab));
    };

    return (
        <div className="w-full flex flex-col py-2 mb-auto max-w-[960px] mx-auto">
            <MyArticleHeader
                title="Artikel Saya"
                subtitle="Kelola draf tulisan, artikel terjadwal, dan publikasi Anda di platform TelU Knowledge."
                isFormOpen={isFormOpen}
                onToggleForm={() => setIsFormOpen((prev) => !prev)}
            />

            <MyArticleStats
                totalDraft={draftArticles.length}
                totalScheduled={scheduledArticles.length}
                totalPublished={publishedArticles.length}
                totalPrivate={privateArticles.length}
                activeTab={activeTab}
                onSelectTab={(tab) => setActiveTab(tab)}
            />

            {isFormOpen && (
                <div className="animate-in fade-in duration-200">
                    <MyArticleForm
                        defaultStatus={activeTab as ArticleStatus}
                        onSubmit={handleAddArticle}
                        onCancel={() => setIsFormOpen(false)}
                    />
                </div>
            )}

            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full mt-4"
            >
                <TabsList
                    variant="line"
                    className="bg-transparent border-b border-[var(--dust)]/60 rounded-none w-full justify-start h-auto p-0 gap-6"
                >
                    <TabsTrigger value="draft" className="text-sm font-medium pb-2">
                        Draft
                    </TabsTrigger>
                    <TabsTrigger value="terjadwal" className="text-sm font-medium pb-2">
                        Terjadwal
                    </TabsTrigger>
                    <TabsTrigger value="diterbitkan" className="text-sm font-medium pb-2">
                        Diterbitkan
                    </TabsTrigger>
                    <TabsTrigger value="tidak_publik" className="text-sm font-medium pb-2">
                        Tidak Publik
                    </TabsTrigger>
                </TabsList>

                <div className="flex items-center justify-between text-[13px] text-[var(--muted)] pt-5 pb-2">
                    <span>Terbaru</span>
                    <div className="flex items-center gap-6 mr-3">
                        <button
                            type="button"
                            onClick={handleClearCurrentTab}
                            className="text-xs text-[var(--muted)] hover:text-[var(--failed)] transition-colors flex items-center gap-1 cursor-pointer"
                            title="Kosongkan artikel di tab ini untuk menguji teks 'Belum ada data'"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Kosongkan Tab Ini</span>
                        </button>
                        <span className="hidden sm:inline">Aksi / Opsi</span>
                    </div>
                </div>

                <TabsContent value="draft" className="mt-0">
                    <MyArticleList
                        articles={draftArticles}
                        entityName="artikel draft"
                        onDeleteArticle={handleDeleteArticle}
                        onAddClick={() => setIsFormOpen(true)}
                    />
                </TabsContent>

                <TabsContent value="terjadwal" className="mt-0">
                    <MyArticleList
                        articles={scheduledArticles}
                        entityName="artikel terjadwal"
                        onDeleteArticle={handleDeleteArticle}
                        onAddClick={() => setIsFormOpen(true)}
                    />
                </TabsContent>

                <TabsContent value="diterbitkan" className="mt-0">
                    <MyArticleList
                        articles={publishedArticles}
                        entityName="artikel diterbitkan"
                        onDeleteArticle={handleDeleteArticle}
                        onAddClick={() => setIsFormOpen(true)}
                    />
                </TabsContent>

                <TabsContent value="tidak_publik" className="mt-0">
                    <MyArticleList
                        articles={privateArticles}
                        entityName="artikel tidak publik"
                        onDeleteArticle={handleDeleteArticle}
                        onAddClick={() => setIsFormOpen(true)}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
