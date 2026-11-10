"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import {
  EditorContent,
  useEditor,
  type Editor,
  type JSONContent,
} from "@tiptap/react";
import type { Node as PmNode } from "@tiptap/pm/model";
import { TextSelection, type Transaction } from "@tiptap/pm/state";
import FormAlert from "@/components/_shared/FormAlert";
import { isApiError } from "@/lib/api/errors";
import { cn } from "@/lib/utils";
import { useUploadArticleImage } from "@/services/articles/articles.queries";
import { getAiSelectionHighlightRange } from "./ai-selection-highlight";
import AiAssistPanel, { type AiSession } from "./AiAssistPanel";
import { editorExtensions } from "./extensions";
import FloatingToolbar from "./FloatingToolbar";
import InsertMenu, { UPLOAD_PLACEHOLDER_TEXT } from "./InsertMenu";

export const DEFAULT_INITIAL_CONTENT: JSONContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
    },
  ],
};

const MAX_IMAGE_SIZE_BYTES = 4 * 1024 * 1024;
const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);
const ALLOWED_IMAGE_EXT_REGEX = /\.(png|jpe?g|webp|gif)$/i;
const ACCEPTED_IMAGE_INPUT = "image/png,image/jpeg,image/webp,image/gif";

/**
 * Memvalidasi ukuran dan tipe file gambar di sisi klien sebelum diunggah.
 */
export function validateArticleImageFile(file: File): string | null {
  if (!file || file.size === 0) {
    return "File gambar kosong atau tidak valid.";
  }

  const isMimeAllowed = ALLOWED_IMAGE_MIME_TYPES.has(file.type.toLowerCase());
  const isExtAllowed = ALLOWED_IMAGE_EXT_REGEX.test(file.name);

  if (!isMimeAllowed && !isExtAllowed) {
    return "Format gambar tidak didukung. Gunakan file PNG, JPEG, WEBP, atau GIF.";
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return "Ukuran file terlalu besar. Maksimal ukuran file adalah 4MB.";
  }

  return null;
}

function findPlaceholderRange(
  doc: PmNode,
  hintPos: number
): { pos: number; size: number } | null {
  if (hintPos >= 0 && hintPos < doc.content.size) {
    const nodeAtHint = doc.nodeAt(hintPos);
    if (
      nodeAtHint &&
      nodeAtHint.type.name === "paragraph" &&
      nodeAtHint.textContent === UPLOAD_PLACEHOLDER_TEXT
    ) {
      return { pos: hintPos, size: nodeAtHint.nodeSize };
    }
  }

  let found: { pos: number; size: number } | null = null;
  doc.descendants((node, pos) => {
    if (found) return false;
    if (
      node.type.name === "paragraph" &&
      node.textContent === UPLOAD_PLACEHOLDER_TEXT
    ) {
      found = { pos, size: node.nodeSize };
      return false;
    }
    return true;
  });

  return found;
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

const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(
  function RichTextEditor(
    {
      initialContent,
      onUpdate,
      onEditorReady,
      onRequestAiHelp,
      className,
      ariaLabel = "Isi artikel",
    },
    ref
  ) {
    const onUpdateRef = useRef(onUpdate);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const editorInstanceRef = useRef<Editor | null>(null);
    const uploadHandlerRef = useRef<
      (file: File, targetPos?: number) => Promise<void>
    >(async () => {});

    const [uploadError, setUploadError] = useState<string | null>(null);
    const [aiSession, setAiSession] = useState<AiSession | null>(null);
    const uploadMutation = useUploadArticleImage();

    useEffect(() => {
      onUpdateRef.current = onUpdate;
    }, [onUpdate]);

    const handleImageFileUpload = useCallback(
      async (file: File, targetPos?: number) => {
        const currentEditor = editorInstanceRef.current;
        if (!currentEditor || currentEditor.isDestroyed) return;

        setUploadError(null);

        const validationError = validateArticleImageFile(file);
        if (validationError) {
          setUploadError(validationError);
          return;
        }

        const { state } = currentEditor;
        const { schema } = state;
        const paragraphType = schema.nodes.paragraph;
        const imageType = schema.nodes.image;
        if (!paragraphType || !imageType) return;

        const placeholderNode = paragraphType.create(
          null,
          schema.text(UPLOAD_PLACEHOLDER_TEXT)
        );

        const resolvedPos =
          typeof targetPos === "number"
            ? state.doc.resolve(
                Math.min(Math.max(0, targetPos), state.doc.content.size)
              )
            : state.selection.$from;

        const isRootEmptyParagraph =
          resolvedPos.depth >= 1 &&
          resolvedPos.node(1).type.name === "paragraph" &&
          resolvedPos.node(1).childCount === 0 &&
          resolvedPos.node(1).textContent.trim().length === 0;

        let trackedPos = 0;
        let replacedEmptyParagraph = false;

        if (isRootEmptyParagraph) {
          replacedEmptyParagraph = true;
          const blockPos = resolvedPos.before(1);
          const blockNode = resolvedPos.node(1);
          trackedPos = blockPos;
          const tr = state.tr.replaceWith(
            blockPos,
            blockPos + blockNode.nodeSize,
            placeholderNode
          );
          currentEditor.view.dispatch(tr);
        } else {
          const insertPos =
            resolvedPos.depth >= 1
              ? resolvedPos.after(1)
              : state.doc.content.size;
          trackedPos = insertPos;
          const tr = state.tr.insert(insertPos, placeholderNode);
          currentEditor.view.dispatch(tr);
        }

        const handleTransaction = ({
          transaction,
        }: {
          transaction: Transaction;
        }) => {
          if (transaction.docChanged) {
            trackedPos = transaction.mapping.map(trackedPos, 1);
          }
        };

        currentEditor.on("transaction", handleTransaction);

        try {
          const res = await uploadMutation.mutateAsync(file);
          currentEditor.off("transaction", handleTransaction);

          if (currentEditor.isDestroyed) return;

          const uploadedUrl = res?.data?.url;
          if (!uploadedUrl) {
            throw new Error("URL gambar tidak ditemukan dari respons server.");
          }

          const latestState = currentEditor.state;
          const placeholderRange = findPlaceholderRange(
            latestState.doc,
            trackedPos
          );

          const imageNode = imageType.create({
            src: uploadedUrl,
            alt: file.name,
          });
          const trailingParagraph = paragraphType.create();

          if (placeholderRange) {
            const { pos, size } = placeholderRange;
            const tr = latestState.tr.replaceWith(pos, pos + size, [
              imageNode,
              trailingParagraph,
            ]);
            const nextCursorPos = Math.min(
              pos + imageNode.nodeSize + 1,
              tr.doc.content.size
            );
            tr.setSelection(
              TextSelection.near(tr.doc.resolve(nextCursorPos))
            );
            currentEditor.view.dispatch(tr.scrollIntoView());
            currentEditor.commands.focus();
          } else {
            const endPos = latestState.doc.content.size;
            const tr = latestState.tr.insert(endPos, [
              imageNode,
              trailingParagraph,
            ]);
            currentEditor.view.dispatch(tr.scrollIntoView());
            currentEditor.commands.focus();
          }
        } catch (err) {
          currentEditor.off("transaction", handleTransaction);

          if (!currentEditor.isDestroyed) {
            const latestState = currentEditor.state;
            const placeholderRange = findPlaceholderRange(
              latestState.doc,
              trackedPos
            );

            if (placeholderRange) {
              const { pos, size } = placeholderRange;
              if (
                replacedEmptyParagraph ||
                latestState.doc.childCount <= 1
              ) {
                const emptyParagraph = paragraphType.create();
                const tr = latestState.tr.replaceWith(
                  pos,
                  pos + size,
                  emptyParagraph
                );
                const restoreCursorPos = Math.min(
                  pos + 1,
                  tr.doc.content.size
                );
                tr.setSelection(
                  TextSelection.near(tr.doc.resolve(restoreCursorPos))
                );
                currentEditor.view.dispatch(tr);
              } else {
                const tr = latestState.tr.delete(pos, pos + size);
                currentEditor.view.dispatch(tr);
              }
            }
          }

          if (isApiError(err)) {
            setUploadError(err.message);
          } else {
            setUploadError(
              "Gagal mengunggah gambar artikel. Silakan coba lagi."
            );
          }
        }
      },
      [uploadMutation]
    );

    useEffect(() => {
      uploadHandlerRef.current = handleImageFileUpload;
    }, [handleImageFileUpload]);

    const editor = useEditor({
      immediatelyRender: false,
      extensions: editorExtensions,
      content: initialContent ?? DEFAULT_INITIAL_CONTENT,
      editorProps: {
        attributes: {
          class: "editor-content focus:outline-none min-h-[280px] w-full",
          "aria-label": ariaLabel,
        },
        handleDrop: (view, event, _slice, moved) => {
          if (moved) return false;
          const files = event.dataTransfer?.files;
          if (!files || files.length === 0) return false;

          const file = files[0];
          if (!file) return false;

          event.preventDefault();
          const dropCoords = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          });
          void uploadHandlerRef.current(file, dropCoords?.pos);
          return true;
        },
        handlePaste: (_view, event) => {
          const items = event.clipboardData?.items;
          if (!items) return false;

          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item && item.kind === "file" && item.type.startsWith("image/")) {
              const file = item.getAsFile();
              if (file) {
                event.preventDefault();
                void uploadHandlerRef.current(file);
                return true;
              }
            }
          }

          const files = event.clipboardData?.files;
          if (files && files.length > 0 && files[0]) {
            event.preventDefault();
            void uploadHandlerRef.current(files[0]);
            return true;
          }

          return false;
        },
      },
      onUpdate: ({ editor: currentEditor }) => {
        if (findPlaceholderRange(currentEditor.state.doc, -1)) {
          return;
        }
        onUpdateRef.current?.(currentEditor.getJSON());
      },
    });

    useEffect(() => {
      editorInstanceRef.current = editor;
      onEditorReady?.(editor);
    }, [editor, onEditorReady]);

    useImperativeHandle(
      ref,
      () => ({
        focusStart: () => {
          editor?.commands.focus("start");
        },
        setContent: (nextContent: JSONContent) => {
          editor?.commands.setContent(nextContent, { emitUpdate: false });
        },
        getEditor: () => editor,
      }),
      [editor]
    );

    const handleTriggerImageSelect = useCallback(() => {
      if (uploadMutation.isPending) return;
      fileInputRef.current?.click();
    }, [uploadMutation.isPending]);

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;
      void handleImageFileUpload(file);
    };

    const handleOpenAiAssist = useCallback(() => {
      if (!editor || editor.isDestroyed) return;
      const { state } = editor;
      const { from, to } = state.selection;
      if (from === to) return;

      const selectedText = state.doc.textBetween(from, to, "\n").trim();
      if (!selectedText) return;

      const contextBefore = state.doc
        .textBetween(Math.max(0, from - 600), from, "\n")
        .trim()
        .slice(-1000);
      const contextAfter = state.doc
        .textBetween(
          to,
          Math.min(state.doc.content.size, to + 600),
          "\n"
        )
        .trim()
        .slice(0, 1000);

      editor.commands.setAiSelectionHighlight({ from, to });
      setAiSession({
        from,
        to,
        text: selectedText,
        contextBefore: contextBefore || undefined,
        contextAfter: contextAfter || undefined,
      });

      onRequestAiHelp?.();
    }, [editor, onRequestAiHelp]);

    const handleCloseAiAssist = useCallback(
      (restoreSelection = true) => {
        if (editor && !editor.isDestroyed) {
          const highlightRange =
            getAiSelectionHighlightRange(editor) ??
            (aiSession
              ? { from: aiSession.from, to: aiSession.to }
              : null);

          editor.commands.clearAiSelectionHighlight();

          if (restoreSelection && highlightRange) {
            const docSize = editor.state.doc.content.size;
            const safeFrom = Math.min(
              Math.max(0, highlightRange.from),
              docSize
            );
            const safeTo = Math.min(
              Math.max(safeFrom, highlightRange.to),
              docSize
            );
            editor
              .chain()
              .focus()
              .setTextSelection({ from: safeFrom, to: safeTo })
              .run();
          }
        }
        setAiSession(null);
      },
      [aiSession, editor]
    );

    return (
      <div className={cn("relative w-full flex flex-col gap-3", className)}>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_IMAGE_INPUT}
          onChange={handleFileInputChange}
          disabled={uploadMutation.isPending}
          className="hidden"
          aria-label="Pilih gambar untuk disisipkan ke artikel"
        />

        {uploadError && (
          <FormAlert variant="error" messages={uploadError} />
        )}

        <div className="relative w-full">
          {editor && (
            <>
              <FloatingToolbar
                editor={editor}
                onRequestAiHelp={handleOpenAiAssist}
                isAiPanelOpen={Boolean(aiSession)}
              />
              <InsertMenu
                editor={editor}
                onSelectImage={handleTriggerImageSelect}
                disabled={uploadMutation.isPending}
              />
              {aiSession && (
                <AiAssistPanel
                  editor={editor}
                  session={aiSession}
                  onClose={handleCloseAiAssist}
                />
              )}
            </>
          )}
          <EditorContent editor={editor} className="w-full" />
        </div>
      </div>
    );
  }
);

export default RichTextEditor;
