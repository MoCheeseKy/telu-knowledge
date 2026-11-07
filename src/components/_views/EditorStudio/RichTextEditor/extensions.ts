import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import AiSelectionHighlight from "./ai-selection-highlight";

/**
 * Daftar ekstensi Tiptap untuk Editor Studio.
 * StarterKit v3 sudah menyertakan Link dan Underline secara bawaan,
 * sehingga tidak didaftarkan ulang agar bebas duplikasi.
 */
export const editorExtensions = [
  StarterKit.configure({
    heading: {
      levels: [2, 3],
    },
    link: {
      openOnClick: false,
      autolink: true,
    },
  }),
  Placeholder.configure({
    placeholder: "Masukkan sesuatu…",
  }),
  Image.configure({
    inline: false,
    allowBase64: false,
  }),
  AiSelectionHighlight,
];
