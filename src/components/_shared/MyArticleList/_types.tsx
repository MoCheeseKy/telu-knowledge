import { MyArticleItem } from "../MyArticleCard/_types";

export interface MyArticleListProps {
    articles: MyArticleItem[];
    entityName?: string;
    onDeleteArticle?: (id: string | number) => void;
    onMoreClick?: (article: MyArticleItem) => void;
    onAddClick?: () => void;
    className?: string;
}

