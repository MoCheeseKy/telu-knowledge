"use client";

import { useState } from "react";
import { WritterRecommendationCardProps, dummyWriters } from "./_types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export { dummyWriters };

export default function WritterRecommendationCard({
    name = "mocheeseky",
    avatarUrl,
    isFollowing: initialFollowing = false,
    onFollowToggle,
    className = "",
}: WritterRecommendationCardProps) {
    const [following, setFollowing] = useState(initialFollowing);

    const handleFollow = () => {
        setFollowing(!following);
        if (onFollowToggle) onFollowToggle();
    };

    return (
        <div
            className={cn(
                "flex items-center justify-between gap-[16px] py-1.5 w-full",
                className
            )}
        >
            <div className="flex items-center gap-3 min-w-0">
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt={name}
                        className="w-8 h-8 rounded-[8px] object-cover shrink-0"
                    />
                ) : (
                    <div
                        aria-hidden="true"
                        className="w-8 h-8 rounded-[8px] bg-[var(--primary)] shrink-0"
                    />
                )}
                <span className="font-sans text-[16px] font-bold text-[var(--foreground)] truncate">
                    {name}
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
                        ? "border border-[var(--dust)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-accent)]"
                        : "bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-xs"
                )}
            >
                {following ? "Mengikuti" : "+ Ikuti"}
            </Button>
        </div>
    );
}
