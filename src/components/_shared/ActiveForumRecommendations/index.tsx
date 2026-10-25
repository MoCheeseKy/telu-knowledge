"use client";

import ActiveForumRecommendationCard from "./ActiveForumRecommendationCard";
import { ActiveForumRecommendationsProps, dummyForums } from "./_types";
import { cn } from "@/lib/utils";

export default function ActiveForumRecommendations({
    title = "KOMUNITAS AKTIF",
    forums = dummyForums,
    className = "",
}: ActiveForumRecommendationsProps) {
    return (
        <section className={cn("flex flex-col w-full", className)}>
            <h3 className="font-sans text-[16px] font-bold uppercase text-[var(--primary-text)] tracking-wider mb-2">
                {title}
            </h3>

            <div className="flex flex-col">
                {forums.map((forum, index) => (
                    <ActiveForumRecommendationCard
                        key={forum.id ?? `${forum.title}-${index}`}
                        title={forum.title}
                        description={forum.description}
                        activeMemberCount={forum.activeMemberCount}
                        isFollowing={forum.isFollowing}
                        href={forum.href}
                    />
                ))}
            </div>
        </section>
    );
}
