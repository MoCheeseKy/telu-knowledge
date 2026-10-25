"use client";

import WritterRecommendationCard from "./WritterRecommendationCard";
import { WritterRecommendationsProps, dummyWriters } from "./_types";
import { cn } from "@/lib/utils";

export default function WritterRecommendations({
    title = "TOP PENULIS",
    writers = dummyWriters,
    className = "",
}: WritterRecommendationsProps) {
    return (
        <section className={cn("flex flex-col w-full", className)}>
            <h3 className="font-sans text-[16px] font-bold uppercase text-[var(--primary-text)] tracking-wider mb-3">
                {title}
            </h3>

            <div className="flex flex-col space-y-3">
                {writers.map((writer, index) => (
                    <WritterRecommendationCard
                        key={writer.id ?? `${writer.name}-${index}`}
                        name={writer.name}
                        avatarUrl={writer.avatarUrl}
                        isFollowing={writer.isFollowing}
                    />
                ))}
            </div>
        </section>
    );
}
