import type { Article } from "@/services/articles/articles.types";

/**
 * Properti untuk komponen utama tampilan Editor Studio.
 */
export interface EditorStudioViewProps {
  articleId?: string;
  onRequestAiHelp?: () => void;
}

/**
 * Representasi notifikasi toast internal di dalam Editor Studio.
 */
export interface ToastState {
  variant: "success" | "error";
  message: string;
}

/**
 * Properti untuk komponen kanvas penyuntingan artikel di Editor Studio.
 */
export interface EditorStudioCanvasProps {
  initialArticle: Article | null;
  onRequestAiHelp?: () => void;
}

/**
 * Properti untuk komponen pengunggah dan penampil gambar sampul artikel.
 */
export interface CoverImageFieldProps {
  value: string | null;
  onChange: (url: string | null) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Properti untuk komponen input subjudul artikel.
 */
export interface SubtitleFieldProps {
  value: string;
  onChange: (value: string) => void;
  onEnterPress?: () => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  className?: string;
}

/**
 * Properti untuk komponen input judul artikel.
 */
export interface TitleFieldProps {
  value: string;
  onChange: (value: string) => void;
  onEnterPress?: () => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  className?: string;
}
