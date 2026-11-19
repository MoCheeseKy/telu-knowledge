import type { Editor, JSONContent } from "@tiptap/react";
import type { DecorationSet } from "@tiptap/pm/view";
import type { LucideIcon } from "lucide-react";

/**
 * Rentang posisi seleksi dokumen untuk highlight Bantuan AI.
 */
export interface AiHighlightRange {
  from: number;
  to: number;
}

/**
 * State plugin ProseMirror yang menyimpan rentang seleksi dan dekorasi highlight AI.
 */
export interface AiHighlightPluginState {
  range: AiHighlightRange | null;
  decorations: DecorationSet;
}

/**
 * Data sesi aktif Bantuan AI yang mencakup posisi seleksi, teks terpilih, dan konteks sekitarnya.
 */
export interface AiSession {
  from: number;
  to: number;
  text: string;
  contextBefore?: string;
  contextAfter?: string;
}

/**
 * Properti untuk panel mengambang Bantuan AI Telu.
 */
export interface AiAssistPanelProps {
  editor: Editor;
  session: AiSession;
  onClose: (restoreSelection?: boolean) => void;
}

/**
 * Properti untuk toolbar pemformatan teks mengambang (BubbleMenu).
 */
export interface FloatingToolbarProps {
  editor: Editor;
  onRequestAiHelp?: () => void;
  isAiPanelOpen?: boolean;
}

/**
 * Definisi item aksi pada menu sisipan blok konten di editor.
 */
export interface InsertMenuAction {
  id: string;
  label: string;
  icon: LucideIcon;
  run: () => void;
}

/**
 * Properti untuk menu sisipan blok konten mengambang (FloatingMenu).
 */
export interface InsertMenuProps {
  editor: Editor;
  onSelectImage: () => void;
  disabled?: boolean;
}

/**
 * Properti untuk komponen utama RichTextEditor berbasis Tiptap.
 */
export interface RichTextEditorProps {
  initialContent?: JSONContent;
  onUpdate?: (json: JSONContent) => void;
  onEditorReady?: (editor: Editor | null) => void;
  onRequestAiHelp?: () => void;
  className?: string;
  ariaLabel?: string;
}

/**
 * Method imperatif yang diekspos oleh RichTextEditor melalui ref.
 */
export interface RichTextEditorHandle {
  focusStart: () => void;
  setContent: (content: JSONContent) => void;
  getEditor: () => Editor | null;
}
