import { ReactNode } from "react";

export default interface EditorLayoutProps {
  children: ReactNode;
  className?: string;
  authorName?: string;
  documentType?: string;
  onSaveDraft?: () => void;
  onPublish?: () => void;
}
