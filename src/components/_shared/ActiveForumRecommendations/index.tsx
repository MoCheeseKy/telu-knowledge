"use client";

import { useState } from "react";
import ActiveForumRecommendationCard from "./ActiveForumRecommendationCard";
import { ActiveForumRecommendationsProps, dummyForums } from "./active-forum-recommendations.types";
import { useJoinedForumIds, useToggleJoinForum } from "@/services/communities/forum.queries";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

/**
 * Seksi daftar rekomendasi forum atau komunitas aktif.
 */
export default function ActiveForumRecommendations({
    title = "KOMUNITAS AKTIF",
    forums = dummyForums,
    className = "",
}: ActiveForumRecommendationsProps) {
    const joinedIds = useJoinedForumIds();
    const toggleJoin = useToggleJoinForum();
    const { toast } = useToast();
    const [resetKey, setResetKey] = useState(0);

    const handleToggle = (id?: string | number) => {
        if (id === undefined) return;
        const forumId = String(id);
        toggleJoin.mutate(
            { forumId, join: !joinedIds.has(forumId) },
            {
                onError: () => {
                    toast.error("Gagal memperbarui keanggotaan forum.");
                    setResetKey((k) => k + 1);
                },
            }
        );
    };

    return (
        <section className={cn("flex flex-col w-full", className)}>
            <h3 className="font-sans text-[16px] font-bold uppercase text-[var(--primary-text)] tracking-wider mb-2">
                {title}
            </h3>

            <div className="flex flex-col">
                {forums.map((forum, index) => {
                    const isFollowing =
                        forum.id !== undefined
                            ? joinedIds.has(String(forum.id))
                            : Boolean(forum.isFollowing);
                    return (
                        <ActiveForumRecommendationCard
                            key={`${forum.id ?? `${forum.title}-${index}`}-${isFollowing}-${resetKey}`}
                            title={forum.title}
                            description={forum.description}
                            activeMemberCount={forum.activeMemberCount}
                            isFollowing={isFollowing}
                            href={forum.href}
                            onFollowToggle={() => handleToggle(forum.id)}
                        />
                    );
                })}
            </div>
        </section>
    );
}