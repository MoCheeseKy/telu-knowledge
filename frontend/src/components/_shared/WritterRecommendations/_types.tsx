export interface WriterItem {
    id?: string | number;
    name: string;
    avatarUrl?: string;
    isFollowing?: boolean;
    username?: string;
}

export const dummyWriters: WriterItem[] = [
    { id: 1, name: "mocheeseky", isFollowing: false },
    { id: 2, name: "mocheeseky", isFollowing: false },
    { id: 3, name: "mocheeseky", isFollowing: false },
];

export interface WritterRecommendationCardProps {
    name?: string;
    avatarUrl?: string;
    isFollowing?: boolean;
    onFollowToggle?: () => void;
    className?: string;
}

export interface WritterRecommendationsProps {
    title?: string;
    writers?: WriterItem[];
    className?: string;
}
