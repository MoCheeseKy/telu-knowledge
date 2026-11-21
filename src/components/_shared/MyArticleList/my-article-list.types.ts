/**
 * Representasi item reading list milik pengguna.
 */
export interface MyListItem {
    id?: string | number;
    ownerName: string;
    ownerAvatarUrl?: string;
    title: string;
    storiesCount: string | number;
    isPrivate: boolean;
    coverUrl: string;
    coverAlt: string;
    href?: string;
}

export const dummyMyLists: MyListItem[] = [
    {
        id: 1,
        ownerName: "Nau",
        title: "Skripsi & Riset",
        storiesCount: 4,
        isPrivate: true,
        coverUrl: "/images/persona-c4.jpg",
        coverAlt: "Skripsi & Riset",
    },
    {
        id: 2,
        ownerName: "Nau",
        title: "Skripsi & Riset",
        storiesCount: 4,
        isPrivate: true,
        coverUrl: "/images/persona-c4.jpg",
        coverAlt: "Skripsi & Riset",
    },
    {
        id: 3,
        ownerName: "Nau",
        title: "Skripsi & Riset",
        storiesCount: 4,
        isPrivate: true,
        coverUrl: "/images/persona-c4.jpg",
        coverAlt: "Skripsi & Riset",
    },
    {
        id: 4,
        ownerName: "Nau",
        title: "Skripsi & Riset",
        storiesCount: 4,
        isPrivate: true,
        coverUrl: "/images/persona-c4.jpg",
        coverAlt: "Skripsi & Riset",
    },
];

/**
 * Properti untuk komponen {@link MyArticleListCard}.
 */
export interface MyArticleListCardProps {
    ownerName: string;
    ownerAvatarUrl?: string;
    title: string;
    storiesCount: string | number;
    isPrivate: boolean;
    coverUrl: string;
    coverAlt: string;
    href: string;
    onClick?: () => void;
    className?: string;
}

/**
 * Properti untuk komponen {@link MyArticleList}.
 */
export interface MyArticleListProps {
    items?: MyListItem[];
    className?: string;
}
