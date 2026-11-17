export interface DiscoverArticleItem {
  id: string | number;
  category: string;
  author: string;
  date: string;
  title: string;
  description: string;
  likes: string;
  comments: string;
  image: string;
  isBookmarked?: boolean;
}
