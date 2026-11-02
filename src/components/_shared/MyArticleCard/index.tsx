"use client";

import { MoreHorizontal, Trash2 } from "lucide-react";
import { MyArticleCardProps } from "./_types";
import { cn } from "@/lib/utils";

export default function MyArticleCard({
    id,
    title,
    description,
    readTime,
    updatedAt,
    imageUrl,
    category,
    className = "",
    onMoreClick,
    onDelete,
}: MyArticleCardProps) {
    return (
        <div
            className={cn(
                "flex items-center justify-between py-4 border-b border-[var(--dust)]/40 gap-4 group transition-colors hover:bg-[var(--background-accent)]/20 px-2 rounded-md",
                className
            )}
        >
            <div className="flex items-center gap-4 flex-1 min-w-0">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-[100px] h-[70px] sm:w-[120px] sm:h-[80px] rounded-[6px] object-cover shrink-0 bg-[#D9D9D9]"
                    />
                ) : (
                    <div className="w-[100px] h-[70px] sm:w-[120px] sm:h-[80px] rounded-[6px] bg-gradient-to-br from-[var(--dust)]/60 to-[var(--dust)] flex items-center justify-center text-[var(--muted)] shrink-0 font-medium text-xs">
                        TelU
                    </div>
                )}

                <div className="flex flex-col gap-1 min-w-0 flex-1">
                    {category && (
                        <span className="text-[11px] font-semibold text-[var(--primary)] uppercase tracking-wider">
                            {category}
                        </span>
                    )}
                    <h3 className="font-sans text-[16px] font-bold text-[var(--foreground)] truncate group-hover:text-[var(--primary)] transition-colors">
                        {title}
                    </h3>
                    <p className="font-sans text-[13px] text-[var(--muted)] truncate">
                        {description}
                    </p>
                    <span className="font-sans text-[12px] text-[var(--muted)] mt-0.5">
                        {readTime} &bull; {updatedAt}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
                {onDelete && id !== undefined && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(id);
                        }}
                        className="p-2 rounded-full hover:bg-[var(--failed-soft)] text-[var(--muted)] hover:text-[var(--failed)] transition-colors"
                        title="Hapus artikel ini"
                        aria-label="Hapus artikel"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
                <button
                    type="button"
                    onClick={onMoreClick}
                    className="p-2 rounded-full hover:bg-[var(--background-accent)] text-[var(--foreground)] transition-colors"
                    aria-label="Opsi lainnya"
                >
                    <MoreHorizontal className="w-5 h-5 text-[var(--foreground)]" />
                </button>
            </div>
        </div>
    );
}
