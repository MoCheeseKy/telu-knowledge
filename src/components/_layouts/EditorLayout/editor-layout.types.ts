import { ReactNode } from "react";

/** Status proses penyimpanan draf artikel pada editor studio. */
export type EditorSaveStatus = "idle" | "saving" | "saved" | "error";

/** Properti untuk komponen layout utama halaman editor artikel. */
export default interface EditorLayoutProps {
  children: ReactNode;
  className?: string;
  authorName?: string;
}

/** Kumpulan handler aksi editor yang dapat didaftarkan oleh halaman editor aktif. */
export interface EditorStudioActions {
  saveDraft?: () => void | Promise<void>;
  publish?: () => void | Promise<void>;
  unpublish?: () => void | Promise<void>;
  retrySave?: () => void | Promise<void>;
}

/** Nilai context EditorStudio untuk membaca status dan memicu aksi editor. */
export interface EditorStudioContextValue {
  saveStatus: EditorSaveStatus;
  setSaveStatus: (status: EditorSaveStatus) => void;
  articleStatus: "draft" | "published";
  setArticleStatus: (status: "draft" | "published") => void;
  registerActions: (actions: EditorStudioActions) => () => void;
  saveDraft: () => void;
  publish: () => void;
  unpublish: () => void;
  retrySave: () => void;
}

/** Properti untuk komponen header pada EditorLayout. */
export interface EditorHeaderProps {
  authorName?: string;
}
