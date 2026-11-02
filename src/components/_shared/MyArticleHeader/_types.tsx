export interface MyArticleHeaderProps {
    title?: string;
    subtitle?: string;
    totalArticles?: number;
    isFormOpen?: boolean;
    onToggleForm?: () => void;
    onResetData?: () => void;
    className?: string;
}

