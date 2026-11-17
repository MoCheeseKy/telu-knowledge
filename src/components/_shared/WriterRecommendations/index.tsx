"use client";

import WriterRecommendationCard from "./WriterRecommendationCard";
import { WriterRecommendationsProps, dummyWriters } from "./writer-recommendations.types";
import { cn } from "@/lib/utils";

export default function WriterRecommendations({
    title = "TOP PENULIS",
    writers = dummyWriters,
    className = "",
}: WriterRecommendationsProps) {
    return (
        <section className={cn("flex flex-col w-full", className)}>
            <h3 className="font-sans text-[16px] font-bold uppercase text-[var(--primary-text)] tracking-wider mb-3">
                {title}
            </h3>

            <div className="flex flex-col space-y-3">
                {writers.map((writer, index) => (
                    <WriterRecommendationCard
                        key={writer.id ?? `${writer.name}-${index}`}
                        name={writer.name}
                        avatarUrl={writer.avatarUrl}
                        avatarColor={writer.avatarColor}
                        isFollowing={writer.isFollowing}
                    />
                ))}
            </div>
        </section>
    );
}
