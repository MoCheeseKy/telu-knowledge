"use client";

import { useState } from "react";
import Link from "next/link";
import { ActiveForumRecommendationCardProps, dummyForums } from "./_types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export { dummyForums };

export default function ActiveForumRecommendationCard({
    title = "Kuliner Telkom",
    description = "Cari Kulineran Telkom yang wa...",
    activeMemberCount = "128.000 Anggota",
    isFollowing: initialFollowing = false,
    onFollowToggle,
    href,
    className = "",
}: ActiveForumRecommendationCardProps) {
    const [following, setFollowing] = useState(initialFollowing);

    const handleFollow = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setFollowing(!following);
        if (onFollowToggle) onFollowToggle();
    };

    return (
        <div
            className={cn(
                "flex items-center justify-between gap-4 py-3 border-b border-[var(--dust)]/40 w-full group",
                className
            )}
        >
            <div className="flex flex-col min-w-0 flex-1 gap-0.5">
                {href ? (
                    <Link
                        href={href}
                        className="font-sans text-[16px] font-bold text-[var(--foreground)] group-hover:text-[var(--primary-text)] transition-colors truncate"
                    >
                        {title}
                    </Link>
                ) : (
                    <h4 className="font-sans text-[16px] font-bold text-[var(--foreground)] group-hover:text-[var(--primary-text)] transition-colors truncate">
                        {title}
                    </h4>
                )}
                <p className="font-sans text-[14px] font-normal text-[var(--muted)] truncate">
                    {description}
                </p>
                <span className="font-sans text-[12px] font-normal text-[var(--muted)]">
                    {activeMemberCount}
                </span>
            </div>

            <Button
                type="button"
                size="sm"
                variant={following ? "ghost" : "default"}
                onClick={handleFollow}
                className={cn(
                    "h-7 px-3 text-xs font-semibold rounded-md shrink-0 transition-all",
                    following
                        ? "border border-[var(--dust)] text-[var(--foreground)] hover:bg-[var(--background-accent)]"
                        : "bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-xs"
                )}
            >
                {following ? "Mengikuti" : "+ Ikuti"}
            </Button>
        </div>
    );
}
