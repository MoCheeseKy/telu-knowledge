import { Extension, type Editor } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

export interface AiHighlightRange {
  from: number;
  to: number;
}

export interface AiHighlightPluginState {
  range: AiHighlightRange | null;
  decorations: DecorationSet;
}

type AiHighlightMeta =
  | { type: "set"; from: number; to: number }
  | { type: "clear" };

export const aiSelectionHighlightPluginKey =
  new PluginKey<AiHighlightPluginState>("aiSelectionHighlight");

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    aiSelectionHighlight: {
      /**
       * Menandai rentang teks terpilih dengan dekorasi inline agar tetap terlihat
       * ketika fokus berpindah ke panel Bantuan AI.
       */
      setAiSelectionHighlight: (range: AiHighlightRange) => ReturnType;
      /**
       * Menghapus dekorasi highlight Bantuan AI.
       */
      clearAiSelectionHighlight: () => ReturnType;
    };
  }
}

export function getAiSelectionHighlightRange(
  editor: Editor
): AiHighlightRange | null {
  return aiSelectionHighlightPluginKey.getState(editor.state)?.range ?? null;
}

export const AiSelectionHighlight = Extension.create({
  name: "aiSelectionHighlight",

  addCommands() {
    return {
      setAiSelectionHighlight:
        (range: AiHighlightRange) =>
        ({ tr, dispatch }) => {
          if (dispatch) {
            const meta: AiHighlightMeta = {
              type: "set",
              from: range.from,
              to: range.to,
            };
            dispatch(tr.setMeta(aiSelectionHighlightPluginKey, meta));
          }
          return true;
        },
      clearAiSelectionHighlight:
        () =>
        ({ tr, dispatch }) => {
          if (dispatch) {
            const meta: AiHighlightMeta = { type: "clear" };
            dispatch(tr.setMeta(aiSelectionHighlightPluginKey, meta));
          }
          return true;
        },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin<AiHighlightPluginState>({
        key: aiSelectionHighlightPluginKey,
        state: {
          init(): AiHighlightPluginState {
            return {
              range: null,
              decorations: DecorationSet.empty,
            };
          },
          apply(tr, prev, _oldState, newState): AiHighlightPluginState {
            const meta = tr.getMeta(aiSelectionHighlightPluginKey) as
              | AiHighlightMeta
              | undefined;

            if (meta?.type === "clear") {
              return {
                range: null,
                decorations: DecorationSet.empty,
              };
            }

            if (meta?.type === "set") {
              const maxPos = newState.doc.content.size;
              const from = Math.min(Math.max(0, meta.from), maxPos);
              const to = Math.min(Math.max(from, meta.to), maxPos);

              if (from < to) {
                const deco = Decoration.inline(from, to, {
                  class: "ai-selection-highlight",
                });
                return {
                  range: { from, to },
                  decorations: DecorationSet.create(newState.doc, [deco]),
                };
              }

              return {
                range: null,
                decorations: DecorationSet.empty,
              };
            }

            if (prev.range && tr.docChanged) {
              const from = tr.mapping.map(prev.range.from, 1);
              const to = tr.mapping.map(prev.range.to, -1);

              if (from < to) {
                const deco = Decoration.inline(from, to, {
                  class: "ai-selection-highlight",
                });
                return {
                  range: { from, to },
                  decorations: DecorationSet.create(newState.doc, [deco]),
                };
              }

              return {
                range: null,
                decorations: DecorationSet.empty,
              };
            }

            return prev;
          },
        },
        props: {
          decorations(state) {
            return (
              aiSelectionHighlightPluginKey.getState(state)?.decorations ??
              DecorationSet.empty
            );
          },
        },
      }),
    ];
  },
});

export default AiSelectionHighlight;

