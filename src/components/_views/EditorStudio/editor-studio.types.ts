import type { Article } from "@/services/articles/articles.types";

export interface EditorStudioViewProps {
  articleId?: string;
  onRequestAiHelp?: () => void;
}

export interface ToastState {
  variant: "success" | "error";
  message: string;
}

export interface EditorStudioCanvasProps {
  initialArticle: Article | null;
  onRequestAiHelp?: () => void;
}

export interface CoverImageFieldProps {
  value: string | null;
  onChange: (url: string | null) => void;
  disabled?: boolean;
  className?: string;
}

export interface SubtitleFieldProps {
  value: string;
  onChange: (value: string) => void;
  onEnterPress?: () => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  className?: string;
}

export interface TitleFieldProps {
  value: string;
  onChange: (value: string) => void;
  onEnterPress?: () => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  className?: string;
}
