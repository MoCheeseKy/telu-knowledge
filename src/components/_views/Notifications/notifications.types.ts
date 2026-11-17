/** Kategori jenis aktivitas notifikasi. */
export type NotificationType = "like" | "comment" | "mention" | "follow" | "forum";

/** Struktur data satu item notifikasi pada halaman notifikasi. */
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

/** Kunci tab filter yang tersedia pada halaman notifikasi. */
export type NotificationTabKey = "semua" | "belum_dibaca" | "komentar" | "forum";
