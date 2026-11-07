"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { JSONContent } from "@tiptap/react";
import { useEditorStudio } from "@/components/_layouts/EditorLayout";
import { isApiError } from "@/lib/api/errors";
import {
  useCreateArticle,
  useUpdateArticle,
} from "@/services/articles/articles.queries";
import { hasNonEmptyTiptapText } from "@/services/articles/articles.schemas";
import type {
  Article,
  CreateArticlePayload,
  UpdateArticlePayload,
} from "@/services/articles/articles.types";

const AUTOSAVE_DEBOUNCE_MS = 1500;
const BACKUP_DEBOUNCE_MS = 1000;

export interface EditorDraftSnapshot {
  title: string;
  subtitle: string;
  coverImageUrl: string | null;
  content: JSONContent;
}

export interface EditorLocalBackup extends EditorDraftSnapshot {
  savedAt: string;
}

export function getBackupStorageKey(articleId: string | null): string {
  return `telu:editor-backup:${articleId ?? "new"}`;
}

export function readLocalBackup(
  articleId: string | null
): EditorLocalBackup | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(getBackupStorageKey(articleId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<EditorLocalBackup>;
    if (
      typeof parsed.title !== "string" ||
      typeof parsed.subtitle !== "string" ||
      typeof parsed.savedAt !== "string" ||
      !parsed.content ||
      typeof parsed.content !== "object"
    ) {
      return null;
    }
    return {
      title: parsed.title,
      subtitle: parsed.subtitle,
      coverImageUrl:
        typeof parsed.coverImageUrl === "string" ? parsed.coverImageUrl : null,
      content: parsed.content as JSONContent,
      savedAt: parsed.savedAt,
    };
  } catch {
    return null;
  }
}

export function writeLocalBackup(
  articleId: string | null,
  snapshot: EditorDraftSnapshot
): void {
  if (typeof window === "undefined") return;
  try {
    const payload: EditorLocalBackup = {
      ...snapshot,
      savedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(
      getBackupStorageKey(articleId),
      JSON.stringify(payload)
    );
  } catch {
    // Abaikan error quota localStorage
  }
}

export function clearLocalBackup(articleId: string | null): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(getBackupStorageKey(articleId));
  } catch {
    // Abaikan error localStorage
  }
}

function hasImageNode(node: unknown): boolean {
  if (!node || typeof node !== "object") return false;
  const rec = node as Record<string, unknown>;
  if (rec.type === "image" && rec.attrs && typeof rec.attrs === "object") {
    return true;
  }
  if (Array.isArray(rec.content)) {
    return rec.content.some((child) => hasImageNode(child));
  }
  return false;
}

export function isMeaningfulDraft(snapshot: EditorDraftSnapshot): boolean {
  return (
    snapshot.title.trim().length > 0 ||
    snapshot.subtitle.trim().length > 0 ||
    Boolean(snapshot.coverImageUrl) ||
    hasNonEmptyTiptapText(snapshot.content) ||
    hasImageNode(snapshot.content)
  );
}

export function areSnapshotsEqual(
  a: EditorDraftSnapshot,
  b: EditorDraftSnapshot
): boolean {
  return (
    a.title === b.title &&
    a.subtitle === b.subtitle &&
    a.coverImageUrl === b.coverImageUrl &&
    JSON.stringify(a.content) === JSON.stringify(b.content)
  );
}

function computeChangedPayload(
  current: EditorDraftSnapshot,
  lastSaved: EditorDraftSnapshot
): UpdateArticlePayload | null {
  const payload: UpdateArticlePayload = {};
  let changed = false;

  if (current.title !== lastSaved.title) {
    payload.title = current.title;
    changed = true;
  }

  if (current.subtitle !== lastSaved.subtitle) {
    payload.subtitle = current.subtitle.trim() ? current.subtitle : null;
    changed = true;
  }

  if (current.coverImageUrl !== lastSaved.coverImageUrl) {
    payload.coverImageUrl = current.coverImageUrl;
    changed = true;
  }

  if (JSON.stringify(current.content) !== JSON.stringify(lastSaved.content)) {
    payload.content = current.content;
    changed = true;
  }

  return changed ? payload : null;
}

export interface UseDraftAutosaveOptions {
  initialArticleId: string | null;
  draft: EditorDraftSnapshot;
  enabled: boolean;
}

export interface FlushSaveOptions {
  forceCreateIfEmpty?: boolean;
}

export function useDraftAutosave({
  initialArticleId,
  draft,
  enabled,
}: UseDraftAutosaveOptions) {
  const { setSaveStatus } = useEditorStudio();
  const createMutation = useCreateArticle();
  const updateMutation = useUpdateArticle();

  const [activeArticleId, setActiveArticleId] = useState<string | null>(
    initialArticleId
  );
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const articleIdRef = useRef<string | null>(initialArticleId);
  const latestDraftRef = useRef<EditorDraftSnapshot>(draft);
  const lastSavedRef = useRef<EditorDraftSnapshot>(draft);
  const lastSavedArticleRef = useRef<Article | null>(null);

  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const backupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlightPromiseRef = useRef<Promise<Article | null> | null>(null);
  const hasQueuedChangesRef = useRef(false);

  useEffect(() => {
    latestDraftRef.current = draft;
  }, [draft]);

  /**
   * Menginisialisasi ulang baseline server ketika artikel dari backend selesai dimuat.
   */
  const resetBaseline = useCallback(
    (snapshot: EditorDraftSnapshot, article?: Article | null) => {
      lastSavedRef.current = snapshot;
      latestDraftRef.current = snapshot;
      if (article) {
        lastSavedArticleRef.current = article;
        articleIdRef.current = article.id;
        setActiveArticleId(article.id);
      }
      setIsDirty(false);
    },
    []
  );

  const performSaveLoop = useCallback(
    async (forceCreateIfEmpty = false): Promise<Article | null> => {
      // Jika sudah ada request yang sedang berjalan, tandai antrean dan tunggu hingga selesai
      if (inFlightPromiseRef.current) {
        hasQueuedChangesRef.current = true;
        return inFlightPromiseRef.current;
      }

      const runSequentialSave = async (): Promise<Article | null> => {
        let latestResult: Article | null = lastSavedArticleRef.current;

        while (true) {
          hasQueuedChangesRef.current = false;
          const snapshotToSave = latestDraftRef.current;
          const currentId = articleIdRef.current;

          if (!currentId) {
            if (!forceCreateIfEmpty && !isMeaningfulDraft(snapshotToSave)) {
              setIsDirty(false);
              break;
            }

            setSaveStatus("saving");
            setSaveError(null);

            const createPayload: CreateArticlePayload = {
              ...(snapshotToSave.title ? { title: snapshotToSave.title } : {}),
              ...(snapshotToSave.subtitle.trim()
                ? { subtitle: snapshotToSave.subtitle }
                : {}),
              ...(snapshotToSave.coverImageUrl
                ? { coverImageUrl: snapshotToSave.coverImageUrl }
                : {}),
              content: snapshotToSave.content,
            };

            const res = await createMutation.mutateAsync(createPayload);
            const created = res.data;

            articleIdRef.current = created.id;
            lastSavedArticleRef.current = created;
            lastSavedRef.current = snapshotToSave;
            latestResult = created;
            setActiveArticleId(created.id);

            // Pindahkan URL ke /editor-studio/[id] tanpa me-remount komponen editor
            if (typeof window !== "undefined") {
              window.history.replaceState(
                null,
                "",
                `/editor-studio/${created.id}`
              );
            }

            clearLocalBackup(null);
            setIsSessionExpired(false);
            setSaveStatus("saved");
          } else {
            const diffPayload = computeChangedPayload(
              snapshotToSave,
              lastSavedRef.current
            );

            if (!diffPayload) {
              setIsDirty(false);
              break;
            }

            setSaveStatus("saving");
            setSaveError(null);

            const res = await updateMutation.mutateAsync({
              id: currentId,
              payload: diffPayload,
            });
            const updated = res.data;

            lastSavedArticleRef.current = updated;
            lastSavedRef.current = snapshotToSave;
            latestResult = updated;

            setIsSessionExpired(false);
            setSaveStatus("saved");
          }

          // Cek apakah selama request in-flight tadi ada ketikan baru dari pengguna
          const stillDiffers = !areSnapshotsEqual(
            latestDraftRef.current,
            lastSavedRef.current
          );

          if (!stillDiffers && !hasQueuedChangesRef.current) {
            clearLocalBackup(articleIdRef.current);
            setIsDirty(false);
            break;
          }
        }

        return latestResult;
      };

      const promise = runSequentialSave()
        .catch((err: unknown) => {
          setSaveStatus("error");
          writeLocalBackup(articleIdRef.current, latestDraftRef.current);

          if (isApiError(err) && err.statusCode === 401) {
            setIsSessionExpired(true);
            setSaveError(
              "Sesi berakhir, login ulang di tab baru lalu coba lagi"
            );
          } else if (isApiError(err)) {
            setSaveError(err.message);
          } else {
            setSaveError(
              "Gagal menyimpan perubahan artikel. Silakan coba lagi."
            );
          }
          throw err;
        })
        .finally(() => {
          inFlightPromiseRef.current = null;
        });

      inFlightPromiseRef.current = promise;
      return promise;
    },
    [createMutation, setSaveStatus, updateMutation]
  );

  // Efek debounce autosave (1500ms) dan cadangan localStorage (1000ms)
  useEffect(() => {
    if (!enabled) return;

    const hasUnsavedChanges = !areSnapshotsEqual(draft, lastSavedRef.current);
    const shouldTrack =
      articleIdRef.current !== null
        ? hasUnsavedChanges
        : hasUnsavedChanges && isMeaningfulDraft(draft);

    setIsDirty(shouldTrack);

    if (!shouldTrack) {
      return;
    }

    if (backupTimerRef.current) {
      clearTimeout(backupTimerRef.current);
    }
    backupTimerRef.current = setTimeout(() => {
      writeLocalBackup(articleIdRef.current, latestDraftRef.current);
    }, BACKUP_DEBOUNCE_MS);

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }
    autosaveTimerRef.current = setTimeout(() => {
      void performSaveLoop(false).catch(() => {
        // Error sudah ditangani pada state saveStatus & saveError
      });
    }, AUTOSAVE_DEBOUNCE_MS);

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
      if (backupTimerRef.current) {
        clearTimeout(backupTimerRef.current);
      }
    };
  }, [draft, enabled, performSaveLoop]);

  /**
   * Menyimpan seluruh perubahan tertunda secara langsung (digunakan untuk
   * tombol "Draft Tulisan", "Publikasi", dan "Coba lagi").
   */
  const flushSave = useCallback(
    async (options?: FlushSaveOptions): Promise<Article | null> => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
        autosaveTimerRef.current = null;
      }
      return performSaveLoop(Boolean(options?.forceCreateIfEmpty));
    },
    [performSaveLoop]
  );

  // Peringatan beforeunload saat terdapat perubahan yang belum tersimpan ke server
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const dirtyNow = !areSnapshotsEqual(
        latestDraftRef.current,
        lastSavedRef.current
      );
      if (dirtyNow || inFlightPromiseRef.current !== null) {
        writeLocalBackup(articleIdRef.current, latestDraftRef.current);
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [enabled]);

  return {
    activeArticleId,
    isDirty,
    isSessionExpired,
    saveError,
    setSaveError,
    setIsSessionExpired,
    flushSave,
    resetBaseline,
  };
}

