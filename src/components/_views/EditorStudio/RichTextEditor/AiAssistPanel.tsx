"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import type { Editor } from "@tiptap/react";
import { computePosition, flip, offset, shift } from "@floating-ui/dom";
import {
  AlertCircle,
  Check,
  CornerDownRight,
  Loader2,
  MessageSquareText,
  Plus,
  RotateCcw,
  SendHorizontal,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { isApiError } from "@/lib/api/errors";
import { cn } from "@/lib/utils";
import { useAiAssist } from "@/services/ai/ai.queries";
import type { AiAssistAction, AiAssistPayload } from "@/services/ai/ai.types";
import { getAiSelectionHighlightRange } from "./ai-selection-highlight";

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

const QUICK_ACTION_CHIPS: ReadonlyArray<{
  label: string;
  action: AiAssistAction;
}> = [
    { label: "Parafrase", action: "paraphrase" },
    { label: "Perpendek", action: "shorten" },
    { label: "Perpanjang", action: "expand" },
    { label: "Perbaiki tata bahasa", action: "fix_grammar" },
  ];

function isAbortError(error: unknown): boolean {
  if (!error) return false;
  if (error instanceof DOMException && error.name === "AbortError") {
    return true;
  }
  if (error instanceof Error && error.name === "AbortError") {
    return true;
  }
  return false;
}

function formatAiErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    if (error.statusCode === 429) {
      return "Layanan AI sedang sibuk atau batas permintaan tercapai. Silakan tunggu sebentar lalu coba lagi.";
    }
    if (error.statusCode === 502 || error.statusCode === 504) {
      return "Layanan AI sedang mengalami kendala koneksi. Silakan coba lagi.";
    }
    return error.message;
  }
  return "Gagal memproses permintaan bantuan AI. Silakan coba lagi.";
}

export default function AiAssistPanel({
  editor,
  session,
  onClose,
}: AiAssistPanelProps) {
  const [instruction, setInstruction] = useState("");
  const [resultText, setResultText] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<AiAssistAction | null>(null);
  const [lastRequest, setLastRequest] = useState<{
    action: AiAssistAction;
    customInstruction?: string;
  } | null>(null);
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const aiMutation = useAiAssist();
  const isLoading = aiMutation.isPending;

  const getCurrentRange = useCallback(() => {
    return (
      getAiSelectionHighlightRange(editor) ?? {
        from: session.from,
        to: session.to,
      }
    );
  }, [editor, session.from, session.to]);

  const updatePanelPosition = useCallback(() => {
    const panelEl = panelRef.current;
    if (!panelEl || editor.isDestroyed) return;

    const range = getCurrentRange();
    const docSize = editor.state.doc.content.size;
    const safeFrom = Math.min(Math.max(0, range.from), docSize);
    const safeTo = Math.min(Math.max(safeFrom, range.to), docSize);

    let startCoords: { left: number; right: number; top: number; bottom: number };
    let endCoords: { left: number; right: number; top: number; bottom: number };

    try {
      startCoords = editor.view.coordsAtPos(safeFrom);
      endCoords = editor.view.coordsAtPos(safeTo);
    } catch {
      return;
    }

    const virtualElement = {
      getBoundingClientRect: () => {
        const top = Math.min(startCoords.top, endCoords.top);
        const bottom = Math.max(startCoords.bottom, endCoords.bottom);
        const left = Math.min(startCoords.left, endCoords.left);
        const right = Math.max(startCoords.right, endCoords.right, left + 24);
        return new DOMRect(left, top, right - left, bottom - top);
      },
    };

    void computePosition(virtualElement, panelEl, {
      strategy: "fixed",
      placement: "bottom-start",
      middleware: [
        offset(12),
        flip({ padding: 16 }),
        shift({ padding: 16 }),
      ],
    }).then(({ x, y }) => {
      setCoords({ x, y });
    });
  }, [editor, getCurrentRange]);

  useEffect(() => {
    updatePanelPosition();

    const handleScrollOrResize = () => {
      updatePanelPosition();
    };

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [updatePanelPosition, resultText, errorMessage, isLoading]);

  // Fokus otomatis ke textarea saat panel dibuka & abort request saat unmount
  useEffect(() => {
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });

    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // Pintasan Escape untuk menutup panel dan mengembalikan seleksi
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        abortControllerRef.current?.abort();
        onClose(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const adjustTextareaHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [instruction, adjustTextareaHeight]);

  const executeAiRequest = useCallback(
    async (action: AiAssistAction, customInstruction?: string) => {
      const trimmedInstruction = customInstruction?.trim();
      if (action === "custom" && !trimmedInstruction) {
        return;
      }

      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setLastRequest({ action, customInstruction: trimmedInstruction });
      setActiveAction(action);
      setErrorMessage(null);

      const payload: AiAssistPayload = {
        action,
        selectedText: session.text.slice(0, 4000),
        ...(action === "custom" && trimmedInstruction
          ? { instruction: trimmedInstruction.slice(0, 500) }
          : {}),
        ...(session.contextBefore
          ? { contextBefore: session.contextBefore.slice(0, 1000) }
          : {}),
        ...(session.contextAfter
          ? { contextAfter: session.contextAfter.slice(0, 1000) }
          : {}),
      };

      try {
        const res = await aiMutation.mutateAsync({
          ...payload,
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;

        const output = res?.data?.text?.trim();
        if (!output) {
          setErrorMessage(
            "Telu tidak menghasilkan teks. Silakan coba lagi dengan instruksi lain."
          );
          return;
        }
        setResultText(output);
      } catch (err) {
        if (controller.signal.aborted || isAbortError(err)) {
          return;
        }
        setErrorMessage(formatAiErrorMessage(err));
      }
    },
    [aiMutation, session.contextAfter, session.contextBefore, session.text]
  );

  const handleSubmitCustom = () => {
    if (isLoading || !instruction.trim()) return;
    void executeAiRequest("custom", instruction);
  };

  const handleTextareaKeyDown = (
    e: ReactKeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitCustom();
    }
  };

  const handleRetry = () => {
    if (!lastRequest || isLoading) return;
    const { action, customInstruction } = lastRequest;
    void executeAiRequest(action, customInstruction);
  };

  const handleReplaceSelection = () => {
    if (!resultText) return;
    const range = getCurrentRange();
    const docSize = editor.state.doc.content.size;
    const from = Math.min(Math.max(0, range.from), docSize);
    const to = Math.min(Math.max(from, range.to), docSize);

    abortControllerRef.current?.abort();
    editor.commands.clearAiSelectionHighlight();
    editor.chain().focus().insertContentAt({ from, to }, resultText).run();
    onClose(false);
  };

  const handleInsertBelow = () => {
    if (!resultText) return;
    const range = getCurrentRange();
    const docSize = editor.state.doc.content.size;
    const safeTo = Math.min(Math.max(0, range.to), docSize);
    const $to = editor.state.doc.resolve(safeTo);
    const insertPos = $to.depth >= 1 ? $to.after(1) : safeTo;

    const paragraphs = resultText
      .split(/\n{2,}/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => ({
        type: "paragraph",
        content: [{ type: "text", text: line }],
      }));

    abortControllerRef.current?.abort();
    editor.commands.clearAiSelectionHighlight();
    editor
      .chain()
      .focus()
      .insertContentAt(
        insertPos,
        paragraphs.length > 0
          ? paragraphs
          : [{ type: "paragraph", content: [{ type: "text", text: resultText }] }]
      )
      .run();
    onClose(false);
  };

  const handleDiscard = () => {
    abortControllerRef.current?.abort();
    onClose(true);
  };

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Panel Bantuan AI Telu"
      style={{
        position: "fixed",
        left: coords ? `${coords.x}px` : "-9999px",
        top: coords ? `${coords.y}px` : "-9999px",
      }}
      className={cn(
        "z-50 w-[min(92vw,680px)] rounded-2xl bg-[var(--background)] border border-[var(--dust)] shadow-xl p-4 sm:p-5 flex flex-col gap-3.5 transition-opacity",
        coords ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      {/* Kartu Preview Teks Terpilih + Chip Selection (sesuai FLOATING_AI_HELP.png) */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="w-fit max-w-[260px] rounded-2xl border border-[var(--dust)] bg-[var(--background-accent)]/60 p-3 flex flex-col justify-between gap-3">
          <p className="text-xs leading-relaxed text-[var(--muted)] line-clamp-2">
            {session.text}
          </p>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--foreground)]">
            <MessageSquareText className="w-3.5 h-3.5 text-[var(--foreground)]" />
            <span>Selection</span>
          </div>
        </div>

        {/* Chip Aksi Cepat */}
        <div
          role="group"
          aria-label="Aksi cepat AI"
          className="flex flex-wrap items-center gap-1.5"
        >
          {QUICK_ACTION_CHIPS.map((chip) => {
            const isChipActive = isLoading && activeAction === chip.action;
            return (
              <button
                key={chip.action}
                type="button"
                disabled={isLoading}
                onClick={() => void executeAiRequest(chip.action)}
                className={cn(
                  "h-7 px-3 rounded-full border text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  isChipActive
                    ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary-text)]"
                    : "border-[var(--dust)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--background-accent)] hover:border-[var(--primary)]/50"
                )}
              >
                <Sparkles className="w-3 h-3 text-[var(--primary)]" />
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TODO(design): Sesuaikan tampilan bagian loading, error, dan hasil generasi AI bila desain final tersedia */}
      {isLoading && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-xl border border-[var(--dust)] bg-[var(--background-accent)]/50 px-3.5 py-3 flex items-center gap-2.5 text-xs sm:text-sm text-[var(--muted)]"
        >
          <Loader2 className="w-4 h-4 animate-spin text-[var(--primary)] shrink-0" />
          <span>Telu sedang mengolah teks terpilih…</span>
        </div>
      )}

      {errorMessage && !isLoading && (
        <div
          role="alert"
          className="rounded-xl border border-[var(--failed)] bg-[var(--failed-soft)] px-3.5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs sm:text-sm text-[var(--failed-text)]"
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
          {lastRequest && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleRetry}
              className="h-7 px-2.5 text-xs font-medium gap-1.5 rounded-lg bg-[var(--background)] text-[var(--foreground)] border border-[var(--dust)] shrink-0 self-end sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Coba lagi</span>
            </Button>
          )}
        </div>
      )}

      {resultText && !isLoading && (
        <div className="rounded-xl border border-[var(--dust)] bg-[var(--background-accent)]/45 p-3.5 flex flex-col gap-3">
          <div className="max-h-[220px] overflow-y-auto text-sm leading-relaxed text-[var(--foreground)] whitespace-pre-wrap">
            {resultText}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-[var(--dust)]/60">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleDiscard}
              className="h-8 px-3 text-xs font-medium gap-1.5 rounded-lg"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Buang</span>
            </Button>

            <Button
              type="button"
              variant="primaryOutline"
              size="sm"
              onClick={handleInsertBelow}
              className="h-8 px-3 text-xs font-medium gap-1.5 rounded-lg"
            >
              <CornerDownRight className="w-3.5 h-3.5" />
              <span>Sisipkan di bawah</span>
            </Button>

            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleReplaceSelection}
              className="h-8 px-3 text-xs font-medium gap-1.5 rounded-lg"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Ganti teks</span>
            </Button>
          </div>
        </div>
      )}

      {/* Input Area "Ask Telu…" + Tombol + (disabled) & Tombol Kirim Merah */}
      <div className="flex flex-col gap-2 pt-1">
        <textarea
          ref={textareaRef}
          rows={1}
          value={instruction}
          onChange={(e) => setInstruction(e.target.value.slice(0, 500))}
          onKeyDown={handleTextareaKeyDown}
          disabled={isLoading}
          placeholder="Ask Telu…"
          aria-label="Instruksi untuk asisten AI Telu"
          className="w-full resize-none overflow-y-auto bg-transparent border-0 p-0 text-sm sm:text-base text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-0"
        />

        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            disabled
            aria-label="Tambah konteks (Segera hadir)"
            title="Segera hadir"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--foreground)]/50 cursor-not-allowed -ml-1.5"
          >
            <Plus className="w-5 h-5" />
          </button>

          <button
            type="button"
            disabled={isLoading || instruction.trim().length === 0}
            onClick={handleSubmitCustom}
            aria-label="Kirim instruksi ke Telu"
            title="Kirim (Enter)"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--primary)] hover:text-[var(--primary-hover)] hover:bg-[var(--primary-soft)] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <SendHorizontal className="w-5 h-5 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
}
