export interface MyArticleStatsProps {
    totalDraft: number;
    totalScheduled: number;
    totalPublished: number;
    totalPrivate?: number;
    activeTab?: string;
    onSelectTab?: (tab: string) => void;
    className?: string;
}

