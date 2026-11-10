export interface TopicItem {
    id?: string | number;
    title: string;
    count: string | number;
    href?: string;
}

export const dummyTopics: TopicItem[] = [
    { id: 1, title: "Game Development", count: "32 Artikel", href: "/discovers-articles?topic=game-development" },
    { id: 2, title: "Frontend Website", count: "32 Artikel", href: "/discovers-articles?topic=frontend-website" },
    { id: 3, title: "Backend Security", count: "32 Artikel", href: "/discovers-articles?topic=backend-security" },
    { id: 4, title: "Startup", count: "32 Artikel", href: "/discovers-articles?topic=startup" },
];

export interface TopicRecommendationCardProps {
    title?: string;
    count?: string | number;
    href?: string;
    className?: string;
    onClick?: () => void;
}

export interface TopicRecommendationsProps {
    title?: string;
    topics?: TopicItem[];
    className?: string;
}
