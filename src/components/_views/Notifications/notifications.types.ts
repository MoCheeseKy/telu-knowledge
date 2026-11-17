export type NotificationType = "like" | "comment" | "mention" | "follow" | "forum";

export interface NotificationItem {
  id: number;
  type: NotificationType;
  actor: string;
  avatarUrl?: string;
  message: string;
  target?: string;
  time: string;
  isRead?: boolean;
  href?: string;
  imageUrl?: string;
}

export type NotificationTabKey = "semua" | "belum_dibaca" | "komentar" | "forum";
