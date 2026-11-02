"use client";

import { Plus, X } from "lucide-react";
import { MyArticleHeaderProps } from "./_types";
import { cn } from "@/lib/utils";

export default function MyArticleHeader({
    title = "Artikel Saya",
    subtitle = "Kelola draf tulisan, jadwal publikasi, dan karya Anda di platform TelU Knowledge.",
    isFormOpen = false,
    onToggleForm,
    className = "",
}: MyArticleHeaderProps) {
    return (
        <div className={cn("w-full flex flex-col gap-3 pb-4", className)}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="font-sans text-[28px] sm:text-[32px] font-bold text-[var(--foreground)] tracking-tight">
                    {title}
                </h1>

                <div className="flex items-center gap-2">
                    {onToggleForm && (
                        <button
                            type="button"
                            onClick={onToggleForm}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all shadow-xs cursor-pointer",
                                isFormOpen
                                    ? "bg-[var(--background-accent)] text-[var(--foreground)] hover:bg-[var(--dust)]/60"
                                    : "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] active:scale-98"
                            )}
                        >
                            {isFormOpen ? (
                                <>
                                    <X className="w-4 h-4" />
                                    <span>Tutup Form</span>
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4" />
                                    <span>Tulis Artikel Baru</span>
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>

            <p className="font-sans text-[14px] text-[var(--muted)] leading-relaxed">
                {subtitle}
            </p>
        </div>
    );
}
