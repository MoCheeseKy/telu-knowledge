"use client";

import { useState } from "react";
import MyArticleHeader from "./components/_shared/MyArticleHeader";
import MyArticleStats from "./components/_shared/MyArticleStats";
import MyArticleForm from "./components/_shared/MyArticleForm";
import MyArticleList from "./components/_shared/MyArticleList";
import { initialArticles } from "./components/_shared/MyArticleCard/_types";

export default function App() {
    const [articles, setArticles] = useState(initialArticles);
    const [isFormOpen, setIsFormOpen] = useState(true);

    const handleAddArticle = (newArticleData) => {
        const newArticle = {
            ...newArticleData,
            id: Date.now(),
            updatedAt: newArticleData.updatedAt || "Baru saja",
        };
        setArticles((prev) => [newArticle, ...prev]);
    };

    const handleDeleteArticle = (id) => {
        setArticles((prev) => prev.filter((item) => item.id !== id));
    };

    const handleClearAll = () => {
        setArticles([]);
    };

    const handleResetData = () => {
        setArticles(initialArticles);
    };

    const totalDraft = articles.filter((a) => a.status === "draft").length;
    const totalScheduled = articles.filter((a) => a.status === "terjadwal").length;
    const totalPublished = articles.filter((a) => a.status === "diterbitkan").length;

    return (
        <main className="min-h-screen bg-[var(--background)] p-4 sm:p-8 max-w-[960px] mx-auto flex flex-col gap-4">
            <MyArticleHeader
                title="Artikel Saya"
                subtitle="Aplikasi Manajemen Artikel Mahasiswa Telkom University (TelU Knowledge)"
                isFormOpen={isFormOpen}
                onToggleForm={() => setIsFormOpen((prev) => !prev)}
            />

            <MyArticleStats
                totalDraft={totalDraft}
                totalScheduled={totalScheduled}
                totalPublished={totalPublished}
            />

            <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--background-accent)]/50 border border-[var(--dust)]/40 text-xs">
                <span className="text-[var(--muted)]">
                    Total: <strong className="text-[var(--foreground)]">{articles.length}</strong> artikel terdaftar
                </span>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleClearAll}
                        className="px-2.5 py-1 text-[var(--failed-text)] bg-[var(--failed-soft)] rounded hover:opacity-80 transition-opacity font-medium cursor-pointer"
                        title="Klik untuk menguji tampilan kosong 'Belum ada data artikel'"
                    >
                        Kosongkan Semua Data
                    </button>
                    <button
                        type="button"
                        onClick={handleResetData}
                        className="px-2.5 py-1 text-[var(--foreground)] bg-[var(--background)] border border-[var(--dust)] rounded hover:bg-[var(--dust)]/30 transition-colors font-medium cursor-pointer"
                    >
                        Isi Data Default
                    </button>
                </div>
            </div>

            {isFormOpen && (
                <MyArticleForm
                    onSubmit={handleAddArticle}
                    onCancel={() => setIsFormOpen(false)}
                />
            )}

            <div className="mt-2">
                <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">
                    Daftar Semua Artikel
                </h2>

                {articles.length === 0 ? (
                    <div className="p-8 text-center rounded-xl border border-dashed border-[var(--dust)] bg-[var(--background-accent)]/20">
                        <p className="text-[var(--foreground)] font-semibold text-base mb-1">
                            Belum ada data artikel
                        </p>
                        <p className="text-[var(--muted)] text-sm mb-4">
                            Daftar artikel masih kosong. Silakan gunakan form input di atas untuk menambahkan artikel.
                        </p>
                        <button
                            type="button"
                            onClick={handleResetData}
                            className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-semibold rounded-lg hover:bg-[var(--primary-hover)] transition-colors cursor-pointer"
                        >
                            Muat Contoh Data
                        </button>
                    </div>
                ) : (
                    <MyArticleList
                        articles={articles}
                        entityName="artikel"
                        onDeleteArticle={handleDeleteArticle}
                    />
                )}
            </div>
        </main>
    );
}
