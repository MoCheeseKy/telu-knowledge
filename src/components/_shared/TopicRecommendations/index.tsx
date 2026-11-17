"use client";

import TopicRecommendationCard from "./TopicRecommendationCard";
import { TopicRecommendationsProps, dummyTopics } from "./topic-recommendations.types";
import { cn } from "@/lib/utils";

export default function TopicRecommendations({
    title = "TOPIK PILIHAN",
    topics = dummyTopics,
    className = "",
}: TopicRecommendationsProps) {
    return (
        <section className={cn("flex flex-col w-full", className)}>
            <h3 className="font-sans text-[16px] font-bold uppercase text-[var(--primary-text)] tracking-wider mb-2">
                {title}
            </h3>

            <div className="flex flex-col">
                {topics.map((item) => (
                    <TopicRecommendationCard
                        key={item.id ?? item.title}
                        title={item.title}
                        count={item.count}
                        href={item.href}
                    />
                ))}
            </div>
        </section>
    );
}
