"use client";

import { FileText, Clock, CheckCircle2, Layers } from "lucide-react";
import { MyArticleStatsProps } from "./_types";
import { cn } from "@/lib/utils";

export default function MyArticleStats({
    totalDraft = 0,
    totalScheduled = 0,
    totalPublished = 0,
    totalPrivate = 0,
    activeTab,
    onSelectTab,
    className = "",
}: MyArticleStatsProps) {
    const totalAll = totalDraft + totalScheduled + totalPublished + totalPrivate;

    const stats = [
        {
            key: "draft",
            label: "Draf Tulisan",
            count: totalDraft,
            caption: "Dalam proses",
            icon: FileText,
            color: "text-amber-600 bg-amber-500/10 border-amber-500/20",
        },
        {
            key: "terjadwal",
            label: "Terjadwal",
            count: totalScheduled,
            caption: "Menunggu jadwal",
            icon: Clock,
            color: "text-blue-600 bg-blue-500/10 border-blue-500/20",
        },
        {
            key: "diterbitkan",
            label: "Diterbitkan",
            count: totalPublished,
            caption: "Telah tayang",
            icon: CheckCircle2,
            color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
        },
        {
            key: "all",
            label: "Total Koleksi",
            count: totalAll,
            caption: "Seluruh artikel",
            icon: Layers,
            color: "text-[var(--primary)] bg-[var(--primary-soft)]",
        },
    ];

    return (
        <div className={cn("grid grid-cols-2 lg:grid-cols-4 gap-3 my-4", className)}>
            {stats.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.key;

                return (
                    <div
                        key={item.key}
                        onClick={() => onSelectTab && item.key !== "all" && onSelectTab(item.key)}
                        className={cn(
                            "flex items-center gap-3 p-3.5 rounded-xl border border-[var(--dust)]/50 bg-[var(--background)] transition-all",
                            onSelectTab && item.key !== "all"
                                ? "cursor-pointer hover:border-[var(--primary)] hover:shadow-xs"
                                : "",
                            isActive && "border-[var(--primary)] ring-1 ring-[var(--primary)]/30 bg-[var(--primary-soft)]/20"
                        )}
                    >
                        <div
                            style={
                                item.key === "all"
                                    ? { border: "none", outline: "none", boxShadow: "none" }
                                    : undefined
                            }
                            className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                item.key === "all" ? "" : "border",
                                item.color
                            )}
                        >
                            <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="font-sans text-[20px] font-bold text-[var(--foreground)] leading-tight">
                                {item.count}
                            </span>
                            <span className="font-sans text-[12px] font-medium text-[var(--foreground)] truncate">
                                {item.label}
                            </span>
                            <span className="font-sans text-[11px] text-[var(--muted)]">
                                {item.caption}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
