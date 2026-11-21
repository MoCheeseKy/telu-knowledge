"use client";

import { useQueryClient } from "@tanstack/react-query";
import WriterRecommendationCard from "./WriterRecommendationCard";
import { WriterRecommendationsProps, dummyWriters } from "./writer-recommendations.types";
import { useToggleProfileFollow } from "@/services/articles/articles.queries";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

/**
 * Bagian sidebar rekomendasi penulis unggulan beserta daftar kartunya.
 */
export default function WriterRecommendations({
    title = "TOP PENULIS",
    writers = dummyWriters,
    className = "",
}: WriterRecommendationsProps) {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const toggleFollow = useToggleProfileFollow();

    const handleToggle = (id?: string | number) => {
        if (id === undefined) return;
        toggleFollow.mutate(String(id), {
            onError: () => {
                toast.error("Gagal memperbarui status ikuti penulis.");
                // Kembalikan tampilan ke status asli dari server
                void queryClient.invalidateQueries({ queryKey: ["recommendations", "writers"] });
            },
        });
    };

    return (
        <section className={cn("flex flex-col w-full", className)}>
            <h3 className="font-sans text-[16px] font-bold uppercase text-[var(--primary-text)] tracking-wider mb-3">
                {title}
            </h3>

            <div className="flex flex-col space-y-3">
                {writers.map((writer, index) => (
                    <WriterRecommendationCard
                        // key memuat isFollowing agar kartu ter-reset saat data server berubah
                        key={`${writer.id ?? `${writer.name}-${index}`}-${writer.isFollowing}`}
                        name={writer.name}
                        avatarUrl={writer.avatarUrl}
                        avatarColor={writer.avatarColor}
                        isFollowing={writer.isFollowing}
                        onFollowToggle={() => handleToggle(writer.id)}
                    />
                ))}
            </div>
        </section>
    );
}