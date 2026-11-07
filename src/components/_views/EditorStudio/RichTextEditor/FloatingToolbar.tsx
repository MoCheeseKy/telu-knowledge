"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { useEditorState, type Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { NodeSelection } from "@tiptap/pm/state";
import {
  Check,
  Link2,
  MessageSquare,
  Sparkles,
  Unlink,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { aiSelectionHighlightPluginKey } from "./ai-selection-highlight";

export interface FloatingToolbarProps {
  editor: Editor;
  onRequestAiHelp?: () => void;
  isAiPanelOpen?: boolean;
}

const SCHEME_REGEX = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;
const ALLOWED_PROTOCOLS = new Set(["http:", "https:", "mailto:"]);

/**
 * Menormalisasi dan memvalidasi URL tautan.
 * - Menambahkan https:// bila pengguna belum menyertakan skema.
 * - Menolak skema berbahaya seperti javascript:, data:, vbscript:, file:.
 * - Hanya mengizinkan http:, https:, dan mailto:.
 */
export function normalizeAndValidateLinkUrl(
  rawUrl: string
): { ok: true; url: string } | { ok: false; error: string } {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return { ok: false, error: "URL tautan tidak boleh kosong." };
  }

  // Tolak karakter kontrol atau spasi di dalam URL
  if (/[\s\u0000-\u001F\u007F]/.test(trimmed)) {
    return { ok: false, error: "Format URL tidak valid." };
  }

  let candidate = trimmed;

  if (SCHEME_REGEX.test(trimmed)) {
    const scheme = trimmed.slice(0, trimmed.indexOf(":") + 1).toLowerCase();
    if (!ALLOWED_PROTOCOLS.has(scheme)) {
      return {
        ok: false,
        error:
          "Skema URL tidak diizinkan. Gunakan https://, http://, atau mailto:.",
      };
    }
  } else if (trimmed.startsWith("//")) {
    candidate = `https:${trimmed}`;
  } else {
    candidate = `https://${trimmed}`;
  }

  try {
    const parsed = new URL(candidate);
    const protocol = parsed.protocol.toLowerCase();
    if (!ALLOWED_PROTOCOLS.has(protocol)) {
      return {
        ok: false,
        error:
          "Skema URL tidak diizinkan. Gunakan https://, http://, atau mailto:.",
      };
    }

    if (protocol === "http:" || protocol === "https:") {
      if (
        !parsed.hostname ||
        (!parsed.hostname.includes(".") && parsed.hostname !== "localhost")
      ) {
        return {
          ok: false,
          error: "Masukkan alamat domain yang valid (contoh: telkomuniversity.ac.id).",
        };
      }
    }

    return { ok: true, url: parsed.toString() };
  } catch {
    return { ok: false, error: "Format URL tidak valid." };
  }
}

export default function FloatingToolbar({
  editor,
  onRequestAiHelp,
  isAiPanelOpen = false,
}: FloatingToolbarProps) {
  const [isLinkInputOpen, setIsLinkInputOpen] = useState(false);
  const [linkValue, setLinkValue] = useState("");
  const [linkError, setLinkError] = useState<string | null>(null);

  const isLinkInputOpenRef = useRef(false);
  const isAiPanelOpenRef = useRef(isAiPanelOpen);
  const linkInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    isLinkInputOpenRef.current = isLinkInputOpen;
  }, [isLinkInputOpen]);

  useEffect(() => {
    isAiPanelOpenRef.current = isAiPanelOpen;
  }, [isAiPanelOpen]);

  const editorState = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) => ({
      isBold: currentEditor.isActive("bold"),
      isItalic: currentEditor.isActive("italic"),
      isLink: currentEditor.isActive("link"),
      linkHref:
        (currentEditor.getAttributes("link").href as string | undefined) ?? "",
      isH2: currentEditor.isActive("heading", { level: 2 }),
      isH3: currentEditor.isActive("heading", { level: 3 }),
      isBlockquote: currentEditor.isActive("blockquote"),
    }),
  });

  const openLinkInput = useCallback(() => {
    const currentHref =
      (editor.getAttributes("link").href as string | undefined) ?? "";
    setLinkValue(currentHref);
    setLinkError(null);
    setIsLinkInputOpen(true);
    requestAnimationFrame(() => {
      linkInputRef.current?.focus();
      linkInputRef.current?.select();
    });
  }, [editor]);

  const closeLinkInput = useCallback(
    (restoreEditorFocus = true) => {
      setIsLinkInputOpen(false);
      setLinkError(null);
      if (restoreEditorFocus) {
        editor.commands.focus();
      }
    },
    [editor]
  );

  // Tutup mode input link otomatis apabila seleksi teks menjadi kosong
  useEffect(() => {
    const handleSelectionUpdate = () => {
      const { state } = editor;
      if (state.selection.empty) {
        setIsLinkInputOpen(false);
        setLinkError(null);
      }
    };

    editor.on("selectionUpdate", handleSelectionUpdate);
    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
    };
  }, [editor]);

  // Shortcut Ctrl+K / Cmd+K untuk membuka input link saat ada seleksi teks non-kosong
  useEffect(() => {
    const dom = editor.view.dom;

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        const { state } = editor;
        const { from, to } = state.selection;
        if (
          from !== to &&
          !state.selection.empty &&
          !(state.selection instanceof NodeSelection) &&
          !editor.isActive("image") &&
          state.doc.textBetween(from, to, " ").trim().length > 0
        ) {
          event.preventDefault();
          openLinkInput();
        }
      }
    };

    dom.addEventListener("keydown", handleKeyDown);
    return () => {
      dom.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor, openLinkInput]);

  const handleMouseDownPreventDefault = (
    e: ReactMouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
  };

  const handleApplyLink = () => {
    const trimmed = linkValue.trim();

    if (!trimmed) {
      if (editorState.isLink) {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
        closeLinkInput(true);
        return;
      }
      setLinkError("URL tautan tidak boleh kosong.");
      return;
    }

    const validation = normalizeAndValidateLinkUrl(trimmed);
    if (!validation.ok) {
      setLinkError(validation.error);
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: validation.url })
      .run();
    closeLinkInput(true);
  };

  const handleRemoveLink = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    closeLinkInput(true);
  };

  const handleLinkInputKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleApplyLink();
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeLinkInput(true);
    }
  };

  const handleAiHelpClick = () => {
    onRequestAiHelp?.();
  };

  return (
    <BubbleMenu
      editor={editor}
      updateDelay={0}
      options={{
        placement: "top",
        offset: 10,
      }}
      shouldShow={({ editor: currentEditor, element, state, from, to }) => {
        if (!currentEditor.isEditable) {
          return false;
        }
        if (
          isAiPanelOpenRef.current ||
          aiSelectionHighlightPluginKey.getState(state)?.range !== null
        ) {
          return false;
        }
        if (from === to || state.selection.empty) {
          return false;
        }
        if (
          currentEditor.isActive("image") ||
          state.selection instanceof NodeSelection
        ) {
          return false;
        }
        const selectedText = state.doc.textBetween(from, to, " ");
        if (selectedText.trim().length === 0) {
          return false;
        }
        const activeEl =
          typeof document !== "undefined" ? document.activeElement : null;
        return (
          currentEditor.view.hasFocus() ||
          (activeEl !== null && element.contains(activeEl)) ||
          isLinkInputOpenRef.current
        );
      }}
      className="z-40 flex flex-col items-center gap-2 select-none"
    >
      {/* Bar Utama Floating Toolbar */}
      <div
        role="toolbar"
        aria-label="Pemformatan teks"
        className={cn(
          "flex flex-col rounded-2xl bg-[var(--background)] border border-[var(--foreground)] ring-1 ring-[var(--primary)] shadow-lg px-2.5 py-1.5"
        )}
      >
        {isLinkInputOpen ? (
          <div className="flex flex-col gap-1 min-w-[260px] sm:min-w-[320px] px-1 py-0.5">
            <div className="flex items-center gap-1.5">
              <Link2 className="w-4 h-4 text-[var(--primary)] shrink-0" />
              <input
                ref={linkInputRef}
                type="text"
                value={linkValue}
                onChange={(e) => {
                  setLinkValue(e.target.value);
                  if (linkError) setLinkError(null);
                }}
                onKeyDown={handleLinkInputKeyDown}
                placeholder="Tempel atau ketik URL tautan…"
                aria-label="Input URL tautan"
                className="flex-1 bg-transparent text-xs sm:text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none"
              />
              <button
                type="button"
                onMouseDown={handleMouseDownPreventDefault}
                onClick={handleApplyLink}
                aria-label="Terapkan tautan"
                title="Terapkan tautan (Enter)"
                className="p-1.5 rounded-lg text-[var(--success-text)] hover:bg-[var(--success-soft)] transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" />
              </button>
              {editorState.isLink && (
                <button
                  type="button"
                  onMouseDown={handleMouseDownPreventDefault}
                  onClick={handleRemoveLink}
                  aria-label="Hapus tautan"
                  title="Hapus tautan"
                  className="p-1.5 rounded-lg text-[var(--failed-text)] hover:bg-[var(--failed-soft)] transition-colors cursor-pointer"
                >
                  <Unlink className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onMouseDown={handleMouseDownPreventDefault}
                onClick={() => closeLinkInput(true)}
                aria-label="Batalkan tautan"
                title="Batal (Esc)"
                className="p-1.5 rounded-lg text-[var(--muted)] hover:bg-[var(--background-accent)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {linkError && (
              <span
                role="alert"
                className="text-[11px] font-medium text-[var(--failed-text)] pl-5"
              >
                {linkError}
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* 1. Bold */}
            <button
              type="button"
              onMouseDown={handleMouseDownPreventDefault}
              onClick={() => editor.chain().focus().toggleBold().run()}
              aria-label="Tebal"
              aria-pressed={editorState.isBold}
              title="Tebal (Ctrl+B)"
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center font-newsreader font-bold text-[17px] leading-none transition-colors cursor-pointer",
                editorState.isBold
                  ? "bg-[var(--primary-soft)] text-[var(--primary-text)]"
                  : "text-[var(--primary)] hover:bg-[var(--background-accent)]"
              )}
            >
              B
            </button>

            {/* 2. Italic */}
            <button
              type="button"
              onMouseDown={handleMouseDownPreventDefault}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              aria-label="Miring"
              aria-pressed={editorState.isItalic}
              title="Miring (Ctrl+I)"
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center font-newsreader italic font-semibold text-[18px] leading-none transition-colors cursor-pointer",
                editorState.isItalic
                  ? "bg-[var(--primary-soft)] text-[var(--primary-text)]"
                  : "text-[var(--primary)] hover:bg-[var(--background-accent)]"
              )}
            >
              i
            </button>

            {/* 3. Link */}
            <button
              type="button"
              onMouseDown={handleMouseDownPreventDefault}
              onClick={openLinkInput}
              aria-label="Tautan"
              aria-pressed={editorState.isLink}
              title="Tautan (Ctrl+K)"
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer",
                editorState.isLink
                  ? "bg-[var(--primary-soft)] text-[var(--primary-text)]"
                  : "text-[var(--primary)] hover:bg-[var(--background-accent)]"
              )}
            >
              <Link2 className="w-4 h-4 -rotate-45" />
            </button>

            {/* 4. H2 (T Besar) */}
            <button
              type="button"
              onMouseDown={handleMouseDownPreventDefault}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              aria-label="Judul Bagian (H2)"
              aria-pressed={editorState.isH2}
              title="Judul Bagian (H2)"
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center font-newsreader font-bold text-[19px] leading-none transition-colors cursor-pointer",
                editorState.isH2
                  ? "bg-[var(--primary-soft)] text-[var(--primary-text)]"
                  : "text-[var(--primary)] hover:bg-[var(--background-accent)]"
              )}
            >
              T
            </button>

            {/* 5. H3 (T Kecil) */}
            <button
              type="button"
              onMouseDown={handleMouseDownPreventDefault}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              aria-label="Subjudul Bagian (H3)"
              aria-pressed={editorState.isH3}
              title="Subjudul Bagian (H3)"
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center font-newsreader font-bold text-[14px] leading-none transition-colors cursor-pointer",
                editorState.isH3
                  ? "bg-[var(--primary-soft)] text-[var(--primary-text)]"
                  : "text-[var(--primary)] hover:bg-[var(--background-accent)]"
              )}
            >
              T
            </button>

            {/* 6. Blockquote */}
            <button
              type="button"
              onMouseDown={handleMouseDownPreventDefault}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              aria-label="Kutipan"
              aria-pressed={editorState.isBlockquote}
              title="Kutipan"
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center font-newsreader font-bold text-[22px] leading-none pt-1.5 transition-colors cursor-pointer",
                editorState.isBlockquote
                  ? "bg-[var(--primary-soft)] text-[var(--primary-text)]"
                  : "text-[var(--primary)] hover:bg-[var(--background-accent)]"
              )}
            >
              “
            </button>

            {/* 7. Komentar (disabled + tooltip "Segera hadir") */}
            <div className="relative group flex items-center">
              <button
                type="button"
                disabled
                onMouseDown={handleMouseDownPreventDefault}
                aria-label="Komentar (Segera hadir)"
                aria-pressed={false}
                title="Segera hadir"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--primary)]/50 cursor-not-allowed"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
              <span
                role="tooltip"
                className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[var(--foreground)] px-2 py-0.5 text-[11px] font-medium text-[var(--background)] opacity-0 group-hover:opacity-100 transition-opacity shadow-xs"
              >
                Segera hadir
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Pill "Bantuan AI" dengan caret kecil di bawahnya */}
      <div className="flex flex-col items-center">
        <button
          type="button"
          onMouseDown={handleMouseDownPreventDefault}
          onClick={handleAiHelpClick}
          aria-label="Bantuan AI"
          className="rounded-full bg-[var(--background)] border border-[var(--dust)]/80 shadow-md px-4 py-1.5 flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[var(--foreground)] hover:bg-[var(--background-accent)] transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
          <span>Bantuan AI</span>
        </button>
        <div
          aria-hidden="true"
          className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[var(--foreground)]"
        />
      </div>
    </BubbleMenu>
  );
}

