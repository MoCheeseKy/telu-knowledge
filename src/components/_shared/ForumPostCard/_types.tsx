export default interface ForumPostCardProps {
  id?: string | number;
  topic: string;
  publisher: string;
  postDate: string;
  avatarUrl?: string;
  title: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
  likesCount?: string | number;
  commentsCount?: string | number;
  repostsCount?: string | number;
  isLiked?: boolean;
  className?: string;
  onClick?: () => void;
}