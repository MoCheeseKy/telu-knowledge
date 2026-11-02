import { MyArticleItem, ArticleStatus } from "../MyArticleCard/_types";

export interface MyArticleFormData {
    title: string;
    description: string;
    readTime: string;
    status: ArticleStatus;
    category?: string;
    imageUrl?: string;
}

export interface MyArticleFormProps {
    onSubmit: (articleData: Omit<MyArticleItem, "id">) => void;
    onCancel?: () => void;
    defaultStatus?: ArticleStatus;
    className?: string;
}

