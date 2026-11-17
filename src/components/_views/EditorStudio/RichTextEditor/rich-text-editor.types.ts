import type { Editor, JSONContent } from "@tiptap/react";
import type { DecorationSet } from "@tiptap/pm/view";
import type { LucideIcon } from "lucide-react";

export interface AiHighlightRange {
  from: number;
  to: number;
}

export interface AiHighlightPluginState {
  range: AiHighlightRange | null;
  decorations: DecorationSet;
}

export interface AiSession {
  from: number;
  to: number;
  text: string;
  contextBefore?: string;
  contextAfter?: string;
}

export interface AiAssistPanelProps {
  editor: Editor;
  session: AiSession;
  onClose: (restoreSelection?: boolean) => void;
}

export interface FloatingToolbarProps {
  editor: Editor;
  onRequestAiHelp?: () => void;
  isAiPanelOpen?: boolean;
}

export interface InsertMenuAction {
  id: string;
  label: string;
  icon: LucideIcon;
  run: () => void;
}

export interface InsertMenuProps {
  editor: Editor;
  onSelectImage: () => void;
  disabled?: boolean;
}

export interface RichTextEditorProps {
  initialContent?: JSONContent;
  onUpdate?: (json: JSONContent) => void;
  onEditorReady?: (editor: Editor | null) => void;
  onRequestAiHelp?: () => void;
  className?: string;
  ariaLabel?: string;
}

export interface RichTextEditorHandle {
  focusStart: () => void;
  setContent: (content: JSONContent) => void;
  getEditor: () => Editor | null;
}
