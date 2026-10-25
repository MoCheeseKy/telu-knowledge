import { Fragment } from "react";
import ForumPostCard from "@/components/_shared/ForumPostCard";
import ActiveForumRecommendations from "@/components/_shared/ActiveForumRecommendations";
import type { ForumItem } from "@/components/_shared/ActiveForumRecommendations/_types";

// TODO: ganti dummy data ini dengan data dari API
const dummyTopCommunities: ForumItem[] = [
    { id: 1, title: "Kuliner Telkom", description: "Cari Kulineran Telkom yang wa...", activeMemberCount: "128.000 Anggota", isFollowing: false, href: "/discussion-forums" },
    { id: 2, title: "Kuliner Telkom", description: "Cari Kulineran Telkom yang wa...", activeMemberCount: "128.000 Anggota", isFollowing: false, href: "/discussion-forums" },
    { id: 3, title: "Kuliner Telkom", description: "Cari Kulineran Telkom yang wa...", activeMemberCount: "128.000 Anggota", isFollowing: false, href: "/discussion-forums" },
    { id: 4, title: "Kuliner Telkom", description: "Cari Kulineran Telkom yang wa...", activeMemberCount: "128.000 Anggota", isFollowing: false, href: "/discussion-forums" },
    { id: 5, title: "Kuliner Telkom", description: "Cari Kulineran Telkom yang wa...", activeMemberCount: "128.000 Anggota", isFollowing: false, href: "/discussion-forums" },
    { id: 6, title: "Game Dev +++", description: "Cari Kulineran Telkom yang wa...", activeMemberCount: "128.000 Anggota", isFollowing: true, href: "/discussion-forums" },
    { id: 7, title: "Game Dev +++", description: "Cari Kulineran Telkom yang wa...", activeMemberCount: "128.000 Anggota", isFollowing: true, href: "/discussion-forums" },
    { id: 8, title: "Wisata Telkom", description: "Cari Kulineran Telkom yang wa...", activeMemberCount: "128.000 Anggota", isFollowing: false, href: "/discussion-forums" },
];

const dummyForumPosts = [1, 2, 3, 4].map((id) => ({
    id,
    topic: "Rekomendasi Kuliner Telkom Community",
    publisher: "Rifky Muhammad Prayudhi",
    postDate: "12 September 2026",
    title: "Game Persona 5 Rilis yang Baru?",
    description:
        "You're going to see these in someone's toolkit next year and wonder why you didn't hear about them first. Here's your head start.",
    imageUrl: "/images/persona-c4.jpg",
    likesCount: "16,2k",
    commentsCount: "16,2k",
    repostsCount: "16,2k",
    isLiked: true,
}));

export default function DiscussionForumsView() {
  return (
    <p>Halaman Forum Diskusi - Tugas Joanne</p>
  );
    return (
        <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-12 xl:gap-16 py-6">
            <div className="flex-1 flex flex-col w-full max-w-[679px]">
                <div className="flex flex-col gap-2 mb-[64px]">
                    <h1 className="font-sans text-[32px] font-bold text-[var(--primary-text)] leading-tight">
                        Temukan Sesuatu Yang Menarik!
                    </h1>
                    <p className="max-w-[300px] font-sans text-[16px] font-normal text-[var(--foreground)] leading-relaxed">
                        Catatan, refleksi proyek, dan ruang diskusi mahasiswa Telkom University.
                    </p>
                </div>

                <div className="flex flex-col gap-10">
                    {dummyForumPosts.map(({ id, ...post }, index) => (
                        <Fragment key={id}>
                            {index > 0 && (
                                <div className="w-full border-t border-[var(--dust)]/40" />
                            )}
                            <ForumPostCard {...post} />
                        </Fragment>
                    ))}
                </div>
            </div>

            <aside className="w-full lg:w-[320px] xl:w-[340px] shrink-0 lg:sticky lg:top-24 flex flex-col gap-[32px] pt-2">
                <ActiveForumRecommendations
                    title="TOP KOMUNITAS AKTIF"
                    forums={dummyTopCommunities}
                />
            </aside>
        </div>
    );
}