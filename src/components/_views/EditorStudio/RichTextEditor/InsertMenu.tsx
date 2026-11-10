"use client";

import {
  useEffect,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import type { Editor } from "@tiptap/react";
import { FloatingMenu } from "@tiptap/react/menus";
import { ImagePlus, Plus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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

export const UPLOAD_PLACEHOLDER_TEXT = "Mengunggah…";

export default function InsertMenu({
  editor,
  onSelectImage,
  disabled = false,
}: InsertMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Tutup deretan aksi ketika posisi kursor atau isi dokumen berubah
  useEffect(() => {
    const handleUpdate = () => {
      setIsOpen(false);
    };

    editor.on("selectionUpdate", handleUpdate);
    editor.on("update", handleUpdate);
    return () => {
      editor.off("selectionUpdate", handleUpdate);
      editor.off("update", handleUpdate);
    };
  }, [editor]);

  const actions: InsertMenuAction[] = [
    {
      id: "image",
      label: "Gambar",
      icon: ImagePlus,
      run: () => {
        setIsOpen(false);
        onSelectImage();
      },
    },
  ];

  const handleMouseDownPreventDefault = (
    e: ReactMouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
  };

  return (
    <FloatingMenu
      editor={editor}
      updateDelay={0}
      options={{
        placement: "right-start",
        offset: 0,
        flip: false,
        shift: false,
      }}
      shouldShow={({ editor: currentEditor, view, state }) => {
        if (!currentEditor.isEditable) {
          return false;
        }
        const { selection } = state;
        const { $anchor, empty } = selection;
        if (!empty) {
          return false;
        }

        // Hanya tampil pada paragraf kosong di level root dokumen
        const isRootParagraph =
          $anchor.depth === 1 && $anchor.parent.type.name === "paragraph";
        const isEmptyParagraph =
          $anchor.parent.childCount === 0 &&
          $anchor.parent.textContent.trim().length === 0;

        if (!isRootParagraph || !isEmptyParagraph) {
          return false;
        }

        return view.hasFocus();
      }}
      className="z-30 flex items-center select-none pointer-events-auto"
    >
      <div className="flex items-center gap-2.5 mt-8 sm:mt-0 sm:-ml-10 md:-ml-12">
        <button
          type="button"
          disabled={disabled}
          onMouseDown={handleMouseDownPreventDefault}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Tutup menu sisipan" : "Tambah blok konten"}
          aria-expanded={isOpen}
          title={isOpen ? "Tutup" : "Sisipkan konten"}
          className={cn(
            "w-8 h-8 rounded-full border border-[var(--primary)] bg-[var(--background)] text-[var(--primary)]",
            "hover:bg-[var(--primary-soft)] flex items-center justify-center transition-colors cursor-pointer shadow-2xs",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <Plus
            className={cn(
              "w-4 h-4 transition-transform duration-200",
              isOpen && "rotate-45"
            )}
          />
        </button>

        {isOpen && (
          <div
            role="menu"
            aria-label="Pilihan sisipan konten"
            className="flex items-center gap-2 bg-[var(--background)] pr-2 py-0.5 rounded-full"
          >
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  type="button"
                  role="menuitem"
                  disabled={disabled}
                  onMouseDown={handleMouseDownPreventDefault}
                  onClick={action.run}
                  aria-label={action.label}
                  className={cn(
                    "h-8 px-3 rounded-full border border-[var(--primary)] bg-[var(--background)] text-[var(--primary-text)]",
                    "hover:bg-[var(--primary-soft)] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  <Icon className="w-3.5 h-3.5 text-[var(--primary)]" />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </FloatingMenu>
  );
}

