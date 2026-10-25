"use client";

import { MoreHorizontal } from "lucide-react";
import { MyArticleCardProps } from "./_types";
import { cn } from "@/lib/utils";

export default function MyArticleCard({
    title,
    description,
    readTime,
    updatedAt,
    imageUrl,
    className = "",
    onMoreClick,
}: MyArticleCardProps) {
    return (
        <div
            className={cn(
                "flex items-center justify-between py-4 border-b border-[var(--dust)]/40 gap-4 group",
                className
            )}
        >
            {/* 1. BAGIAN KIRI: Kotak Thumbnail & Teks Info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Gambar / Kotak Abu-abu */}
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-[100px] h-[70px] sm:w-[120px] sm:h-[80px] rounded-[4px] object-cover shrink-0 bg-[#D9D9D9]"
                    />
                ) : (
                    <div className="w-[100px] h-[70px] sm:w-[120px] sm:h-[80px] rounded-[4px] bg-[#D9D9D9] shrink-0" />
                )}

                {/* Teks Judul, Deskripsi, dan Waktu Baca */}
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <h3 className="font-sans text-[16px] font-bold text-[var(--foreground)] truncate">
                        {title}
                    </h3>
                    <p className="font-sans text-[13px] text-[var(--muted)] truncate">
                        {description}
                    </p>
                    <span className="font-sans text-[12px] text-[var(--muted)] mt-1">
                        {readTime} &bull; {updatedAt}
                    </span>
                </div>
            </div>

            {/* 2. BAGIAN KANAN: Tombol Aksi Titik Tiga (...) */}
            <button
                type="button"
                onClick={onMoreClick}
                className="p-2 rounded-full hover:bg-[var(--background-accent)] text-[var(--foreground)] transition-colors shrink-0"
                aria-label="Opsi lainnya"
            >
                <MoreHorizontal className="w-5 h-5 text-[var(--foreground)]" />
            </button>
        </div>
    );
}
