"use client";
import { useMemo, useState } from "react";

type Community = {
    id: number;
    name: string;
    description: string;
    author: string;
    members: string;
    discussions: string;
    image: string;
};

const communities: Community[] = [
    {
        id: 1,
        name: "Komunitas Gamer Persona Telkom University Bandung",
        description:
            "Struktur kontainer berorientasi kurasi akademik dengan hierarki tipografi berlapis Persona 5.",
        author: "Rifky Muhammad Prayudhi",
        members: "16,2k",
        discussions: "16,2k",
        image:
            "/images/persona-c4.jpg",
    },
    {
        id: 2,
        name: "Komunitas Gamer Persona Telkom University Bandung",
        description:
            "Struktur kontainer berorientasi kurasi akademik dengan hierarki tipografi berlapis Persona 5.",
        author: "Rifky Muhammad Prayudhi",
        members: "16,2k",
        discussions: "16,2k",
        image:
            "/images/persona-c4.jpg",
    },
    {
        id: 3,
        name: "Komunitas Gamer Persona Telkom University Bandung",
        description:
            "Struktur kontainer berorientasi kurasi akademik dengan hierarki tipografi berlapis Persona 5.",
        author: "Rifky Muhammad Prayudhi",
        members: "16,2k",
        discussions: "16,2k",
        image:
            "/images/persona-c4.jpg",
    },
    {
        id: 4,
        name: "Komunitas Gamer Persona Telkom University Bandung",
        description:
            "Struktur kontainer berorientasi kurasi akademik dengan hierarki tipografi berlapis Persona 5.",
        author: "Rifky Muhammad Prayudhi",
        members: "16,2k",
        discussions: "16,2k",
        image:
            "/images/persona-c4.jpg",
    },
    {
        id: 5,
        name: "Komunitas Gamer Persona Telkom University Bandung",
        description:
            "Struktur kontainer berorientasi kurasi akademik dengan hierarki tipografi berlapis Persona 5.",
        author: "Rifky Muhammad Prayudhi",
        members: "16,2k",
        discussions: "16,2k",
        image:
            "/images/persona-c4.jpg",
    },
    {
        id: 6,
        name: "Komunitas Gamer Persona Telkom University Bandung",
        description:
            "Struktur kontainer berorientasi kurasi akademik dengan hierarki tipografi berlapis Persona 5.",
        author: "Rifky Muhammad Prayudhi",
        members: "16,2k",
        discussions: "16,2k",
        image:
            "/images/persona-c4.jpg",
    },
    {
        id: 7,
        name: "Komunitas Gamer Persona Telkom University Bandung",
        description:
            "Struktur kontainer berorientasi kurasi akademik dengan hierarki tipografi berlapis Persona 5.",
        author: "Rifky Muhammad Prayudhi",
        members: "16,2k",
        discussions: "16,2k",
        image:
            "/images/persona-c4.jpg",
    },
    {
        id: 8,
        name: "Komunitas Gamer Persona Telkom University Bandung",
        description:
            "Struktur kontainer berorientasi kurasi akademik dengan hierarki tipografi berlapis Persona 5.",
        author: "Rifky Muhammad Prayudhi",
        members: "16,2k",
        discussions: "16,2k",
        image:
            "/images/persona-c4.jpg",
    },
    {
        id: 9,
        name: "Komunitas Gamer Persona Telkom University Bandung",
        description:
            "Struktur kontainer berorientasi kurasi akademik dengan hierarki tipografi berlapis Persona 5.",
        author: "Rifky Muhammad Prayudhi",
        members: "16,2k",
        discussions: "16,2k",
        image:
            "/images/persona-c4.jpg",
    },
    {
        id: 10,
        name: "Komunitas Gamer Persona Telkom University Bandung",
        description:
            "Struktur kontainer berorientasi kurasi akademik dengan hierarki tipografi berlapis Persona 5.",
        author: "Rifky Muhammad Prayudhi",
        members: "16,2k",
        discussions: "16,2k",
        image: "/images/persona-c4.jpg",
    },
];

function SearchIcon() {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
        </svg>
    );
}

function PlusIcon() {
    return (
        <svg
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v8M8 12h8" />
        </svg>
    );
}

function UsersIcon() {
    return (
        <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="10" cy="7" r="4" />
            <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

function MessageIcon() {
    return (
        <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8Z" />
        </svg>
    );
}

// COMMUNITY CARD
function CommunityCard({
    community,
    followed,
    onFollow,
}: {
    community: Community;
    followed: boolean;
    onFollow: () => void;
}) {
    return (
        <article className="min-w-0">
            {/* Author and Follow */}
            <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                    <div className="h-[15px] w-[15px] shrink-0 rounded-[3px] bg-[#E9231A]" />

                    <span className="truncate text-[9px] font-medium text-[var(--primary-text)]">
                        Authored by{" "}
                        <span className="font-bold">{community.author}</span>
                    </span>
                </div>

                <button
                    type="button"
                    onClick={onFollow}
                    className={`flex shrink-0 items-center justify-center gap-1 rounded-[4px] px-3 py-[5px] text-[12px] font-medium text-white transition hover:opacity-90 ${followed
                        ? "bg-[#252525]"
                        : "bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
                        }`}
                >
                    {followed ? (
                        "✓ Mengikuti"
                    ) : (
                        <>
                            <span className="text-base leading-none">+</span>
                            Ikuti
                        </>
                    )}
                </button>
            </div>

            {/* Community Content */}
            <div className="flex min-h-[144px] overflow-hidden rounded-[8px] bg-white">
                <div className="h-[144px] w-[144px] shrink-0 overflow-hidden rounded-[8px]">
                    <img
                        src={community.image}
                        alt={community.name}
                        className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    />
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-center px-3 py-3 sm:px-4">
                    <h2 className="mb-2 line-clamp-2 text-[16px] font-bold leading-[1.3] text-[#202020] sm:text-[17px]">
                        {community.name}
                    </h2>

                    <p className="line-clamp-2 text-[11px] leading-[1.55] text-[#333333] sm:text-[12px]">
                        {community.description}
                    </p>

                    {/* Statistics */}
                    <div className="mt-4 flex items-center gap-4">
                        <div className="flex items-center gap-1 text-[var(--primary-text)]">
                            <UsersIcon />
                            <span className="text-[9px] font-medium text-black">
                                {community.members}
                            </span>
                        </div>

                        <div className="flex items-center gap-1 text-[#E9231A]">
                            <MessageIcon />
                            <span className="text-[9px] font-medium text-black">
                                {community.discussions}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default function DiscoverForumsView() {
    const [search, setSearch] = useState("");
    const [followedCommunities, setFollowedCommunities] = useState<number[]>([]);

    // Search community
    const filteredCommunities = useMemo(() => {
        return communities.filter((community) =>
            community.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [search]);

    // Follow / Unfollow community
    const handleFollow = (id: number) => {
        setFollowedCommunities((previous) =>
            previous.includes(id)
                ? previous.filter((item) => item !== id)
                : [...previous, id]
        );
    };

    return (
        <main className="min-h-screen bg-[#FCFAFA] text-[#202020]">

            <section className="mx-auto max-w-[1400px] px-5 pb-20 pt-8 sm:px-8 sm:pt-8 lg:px-10">
                {/* Search and Create Community */}
                <div className="mb-8 flex flex-col items-center justify-between gap-5 sm:flex-row">
                    {/* Search Input */}
                    <div className="flex h-[44px] w-full max-w-[395px] items-center rounded-full border border-[#D3D3D3] bg-white px-4 transition focus-within:border-[var(--primary)]">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari Nama Komunitas Yang Cocok..."
                            className="h-full min-w-0 flex-1 bg-transparent text-[13px] text-[#333333] outline-none placeholder:text-[#A0A4AB]"
                        />

                        <div className="text-[#E9231A]">
                            <SearchIcon />
                        </div>
                    </div>

                    {/* Create Community */}
                    <a
                        href="/communities/create"
                        className="flex h-[44px] w-full items-center justify-center gap-3 rounded-[5px] bg-[var(--primary)] px-5 text-[15px] font-semibold text-white transition hover:bg-[var(--primary-hover)] sm:w-auto"
                    >
                        <PlusIcon />
                        Buat Komunitas Baru
                    </a>
                </div>

                {/* COMMUNITY LIST */}
                {filteredCommunities.length > 0 ? (
                    <div className="grid grid-cols-1 gap-x-7 gap-y-8 md:grid-cols-2 lg:gap-x-8 lg:gap-y-8">
                        {filteredCommunities.map((community) => (
                            <CommunityCard
                                key={community.id}
                                community={community}
                                followed={followedCommunities.includes(community.id)}
                                onFollow={() => handleFollow(community.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                        <div className="mb-4 rounded-full bg-[#FCE9E8] p-5 text-[#E9231A]">
                            <SearchIcon />
                        </div>

                        <h3 className="text-lg font-bold">
                            Komunitas Tidak Ditemukan
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                            Coba gunakan kata kunci pencarian yang berbeda.
                        </p>

                        <button
                            type="button"
                            onClick={() => setSearch("")}
                            className="mt-5 text-sm font-semibold text-[#E9231A] hover:underline"
                        >
                            Reset Pencarian
                        </button>
                    </div>
                )}
            </section>
        </main>
    );
}
