"use client";

import Link from "next/link";
import { TopicRecommendationCardProps, dummyTopics } from "./_types";
import { cn } from "@/lib/utils";

export { dummyTopics };

export default function TopicRecommenndationCard({
    title = "Game Development",
    count = "32 Artikel",
    href,
    className = "",
    onClick,
}: TopicRecommendationCardProps) {
    const content = (
        <div
            onClick={onClick}
            className={cn(
                "flex items-center justify-between py-2 border-b border-[var(--dust)]/40 hover:opacity-80 transition-opacity cursor-pointer group",
                className
            )}
        >
            <span className="font-sans text-[16px] font-bold text-[var(--foreground)] group-hover:text-[var(--primary-text)] transition-colors">
                {title}
            </span>
            <span className="font-sans text-[16px] font-normal text-[var(--primary-text)] shrink-0">
                {count}
            </span>
        </div>
    );

    if (href) {
        return (
            <Link href={href} className="block">
                {content}
            </Link>
        );
    }

    return content;
}
