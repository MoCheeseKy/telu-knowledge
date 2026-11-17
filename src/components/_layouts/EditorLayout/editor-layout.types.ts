import { ReactNode } from "react";

export type EditorSaveStatus = "idle" | "saving" | "saved" | "error";

export default interface EditorLayoutProps {
  children: ReactNode;
  className?: string;
  authorName?: string;
}

export interface EditorStudioActions {
  saveDraft?: () => void | Promise<void>;
  publish?: () => void | Promise<void>;
  unpublish?: () => void | Promise<void>;
  retrySave?: () => void | Promise<void>;
}

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

export interface EditorHeaderProps {
  authorName?: string;
}
