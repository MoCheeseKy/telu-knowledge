export interface ForumItem {
    id?: string | number;
    title: string;
    description: string;
    activeMemberCount: string | number;
    isFollowing?: boolean;
    href?: string;
}

export const dummyForums: ForumItem[] = [
    {
        id: 1,
        title: "Kuliner Telkom",
        description: "Cari Kulineran Telkom yang wa...",
        activeMemberCount: "128.000 Anggota",
        isFollowing: false,
        href: "/communities/1",
    },
    {
        id: 2,
        title: "Wisata Telkom",
        description: "Cari Kulineran Telkom yang wa...",
        activeMemberCount: "128.000 Anggota",
        isFollowing: false,
        href: "/communities/2",
    },
    {
        id: 3,
        title: "Game Dev +++",
        description: "Cari Kulineran Telkom yang wa...",
        activeMemberCount: "128.000 Anggota",
        isFollowing: true,
        href: "/communities/3",
    },
];

export interface ActiveForumRecommendationCardProps {
    title?: string;
    description?: string;
    activeMemberCount?: string | number;
    isFollowing?: boolean;
    onFollowToggle?: () => void;
    href?: string;
    className?: string;
}

export interface ActiveForumRecommendationsProps {
    title?: string;
    forums?: ForumItem[];
    className?: string;
}
