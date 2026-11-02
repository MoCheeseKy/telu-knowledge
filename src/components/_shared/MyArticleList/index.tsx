"use client";

import { FileQuestion, Plus } from "lucide-react";
import MyArticleCard from "../MyArticleCard";
import { MyArticleListProps } from "./_types";
import { cn } from "@/lib/utils";

export default function MyArticleList({
    articles = [],
    entityName = "artikel",
    onDeleteArticle,
    onMoreClick,
    onAddClick,
    className = "",
}: MyArticleListProps) {
    if (articles.length === 0) {
        return (
            <div
                className={cn(
                    "flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-[var(--dust)] rounded-xl bg-[var(--background-accent)]/30 my-4",
                    className
                )}
            >
                <div className="w-14 h-14 rounded-full bg-[var(--background-accent)] flex items-center justify-center text-[var(--muted)] mb-3">
                    <FileQuestion className="w-7 h-7" />
                </div>
                <h3 className="font-sans text-[18px] font-semibold text-[var(--foreground)] mb-1">
                    Belum ada data {entityName}
                </h3>
                <p className="font-sans text-[14px] text-[var(--muted)] max-w-md mb-5 leading-relaxed">
                    Daftar {entityName} pada bagian ini masih kosong. Silakan gunakan form input di atas untuk menambahkan {entityName} baru.
                </p>
                {onAddClick && (
                    <button
                        type="button"
                        onClick={onAddClick}
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--primary-hover)] transition-all cursor-pointer shadow-xs"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Tambah {entityName} Baru</span>
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className={cn("flex flex-col m-0", className)}>
            {articles.map((article) => (
                <MyArticleCard
                    key={article.id}
                    id={article.id}
                    title={article.title}
                    description={article.description}
                    readTime={article.readTime}
                    updatedAt={article.updatedAt}
                    imageUrl={article.imageUrl}
                    category={article.category}
                    status={article.status}
                    onDelete={onDeleteArticle ? () => onDeleteArticle(article.id) : undefined}
                    onMoreClick={onMoreClick ? () => onMoreClick(article) : undefined}
                />
            ))}
        </div>
    );
}
