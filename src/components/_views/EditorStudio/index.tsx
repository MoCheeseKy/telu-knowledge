"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { JSONContent } from "@tiptap/react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  History,
  RotateCcw,
  X,
} from "lucide-react";
import { useEditorStudio } from "@/components/_layouts/EditorLayout";
import FormAlert from "@/components/_shared/FormAlert";
import { Button } from "@/components/ui/button";
import { isApiError } from "@/lib/api/errors";
import { cn } from "@/lib/utils";
import {
  useArticle,
  usePublishArticle,
} from "@/services/articles/articles.queries";
import type { Article } from "@/services/articles/articles.types";
import TitleField from "./components/TitleField";
import SubtitleField from "./components/SubtitleField";
import CoverImageField from "./components/CoverImageField";
import RichTextEditor, {
  DEFAULT_INITIAL_CONTENT,
  type RichTextEditorHandle,
} from "./RichTextEditor";
import {
  areSnapshotsEqual,
  clearLocalBackup,
  isMeaningfulDraft,
  readLocalBackup,
  useDraftAutosave,
  type EditorDraftSnapshot,
  type EditorLocalBackup,
} from "./hooks/useDraftAutosave";

export interface EditorStudioViewProps {
  articleId?: string;
  onRequestAiHelp?: () => void;
}

interface ToastState {
  variant: "success" | "error";
  message: string;
}

function normalizeArticleContent(raw: unknown): JSONContent {
  if (
    raw &&
    typeof raw === "object" &&
    (raw as { type?: unknown }).type === "doc" &&
    Array.isArray((raw as { content?: unknown }).content)
  ) {
    return raw as JSONContent;
  }
  return DEFAULT_INITIAL_CONTENT;
}

function computeInitialPendingBackup(
  initialArticle: Article | null
): EditorLocalBackup | null {
  if (!initialArticle) {
    const backup = readLocalBackup(null);
    return backup && isMeaningfulDraft(backup) ? backup : null;
  }

  const backup = readLocalBackup(initialArticle.id);
  if (!backup) return null;

  const backupTime = new Date(backup.savedAt).getTime();
  const serverTime = new Date(initialArticle.updatedAt).getTime();
  const serverSnapshot: EditorDraftSnapshot = {
    title: initialArticle.title ?? "",
    subtitle: initialArticle.subtitle ?? "",
    coverImageUrl: initialArticle.coverImageUrl ?? null,
    content: normalizeArticleContent(initialArticle.content),
  };

  if (
    !Number.isNaN(backupTime) &&
    !Number.isNaN(serverTime) &&
    backupTime > serverTime &&
    !areSnapshotsEqual(backup, serverSnapshot)
  ) {
    return backup;
  }

  clearLocalBackup(initialArticle.id);
  return null;
}

function EditorStudioSkeleton() {
  return (
    <div
      role="status"
      aria-label="Memuat artikel"
      className="w-full max-w-[920px] mx-auto py-4 sm:py-6"
    >
      <div className="w-full pl-12 sm:pl-16 flex flex-col gap-6 animate-pulse">
        <div className="flex flex-col gap-3">
          <div className="h-11 sm:h-12 w-3/4 rounded-lg bg-[var(--background-accent)]" />
          <div className="h-6 w-1/2 rounded-lg bg-[var(--background-accent)]" />
        </div>
        <div className="h-56 sm:h-72 w-full rounded-xl bg-[var(--background-accent)]" />
        <div className="flex flex-col gap-3 pt-2">
          <div className="h-5 w-full rounded-md bg-[var(--background-accent)]" />
          <div className="h-5 w-11/12 rounded-md bg-[var(--background-accent)]" />
          <div className="h-5 w-4/5 rounded-md bg-[var(--background-accent)]" />
        </div>
      </div>
    </div>
  );
}

interface EditorStudioCanvasProps {
  initialArticle: Article | null;
  onRequestAiHelp?: () => void;
}

function EditorStudioCanvas({
  initialArticle,
  onRequestAiHelp,
}: EditorStudioCanvasProps) {
  const router = useRouter();
  const { registerActions, setSaveStatus } = useEditorStudio();
  const publishMutation = usePublishArticle();

  const [title, setTitle] = useState<string>(() => initialArticle?.title ?? "");
  const [subtitle, setSubtitle] = useState<string>(
    () => initialArticle?.subtitle ?? ""
  );
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(
    () => initialArticle?.coverImageUrl ?? null
  );
  const [content, setContent] = useState<JSONContent>(() =>
    initialArticle
      ? normalizeArticleContent(initialArticle.content)
      : DEFAULT_INITIAL_CONTENT
  );

  const [pendingBackup, setPendingBackup] = useState<EditorLocalBackup | null>(
    () => computeInitialPendingBackup(initialArticle)
  );
  const [publishErrors, setPublishErrors] = useState<string[]>([]);
  const [toast, setToast] = useState<ToastState | null>(null);

  const subtitleRef = useRef<HTMLTextAreaElement | null>(null);
  const editorRef = useRef<RichTextEditorHandle | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((nextToast: ToastState) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast(nextToast);
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 3500);
  }, []);

  useEffect(() => {
    setSaveStatus(initialArticle ? "saved" : "idle");
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, [initialArticle, setSaveStatus]);

  const currentSnapshot = useMemo<EditorDraftSnapshot>(
    () => ({
      title,
      subtitle,
      coverImageUrl,
      content,
    }),
    [title, subtitle, coverImageUrl, content]
  );

  const {
    activeArticleId,
    isSessionExpired,
    saveError,
    setSaveError,
    setIsSessionExpired,
    flushSave,
  } = useDraftAutosave({
    initialArticleId: initialArticle?.id ?? null,
    draft: currentSnapshot,
    enabled: true,
  });

  const handleRestoreBackup = () => {
    if (!pendingBackup) return;
    setTitle(pendingBackup.title);
    setSubtitle(pendingBackup.subtitle);
    setCoverImageUrl(pendingBackup.coverImageUrl);
    setContent(pendingBackup.content);
    editorRef.current?.setContent(pendingBackup.content);
    setPendingBackup(null);
    showToast({
      variant: "success",
      message: "Cadangan lokal berhasil dipulihkan.",
    });
  };

  const handleDiscardBackup = () => {
    clearLocalBackup(activeArticleId);
    setPendingBackup(null);
  };

  const handleRetrySave = useCallback(async () => {
    setPublishErrors([]);
    try {
      await flushSave({ forceCreateIfEmpty: false });
      setIsSessionExpired(false);
      setSaveError(null);
      showToast({
        variant: "success",
        message: "Perubahan berhasil disimpan.",
      });
    } catch {
      // Error sudah ditangani oleh useDraftAutosave
    }
  }, [flushSave, setIsSessionExpired, setSaveError, showToast]);

  const handleSaveDraft = useCallback(async () => {
    setPublishErrors([]);
    try {
      await flushSave({ forceCreateIfEmpty: true });
      showToast({
        variant: "success",
        message: "Draft tulisan berhasil disimpan.",
      });
    } catch {
      showToast({
        variant: "error",
        message: "Gagal menyimpan draft tulisan.",
      });
    }
  }, [flushSave, showToast]);

  const handlePublish = useCallback(async () => {
    setPublishErrors([]);
    try {
      const savedArticle = await flushSave({ forceCreateIfEmpty: true });
      const targetId = savedArticle?.id ?? activeArticleId;

      if (!targetId) {
        setPublishErrors(["Gagal menyiapkan draft artikel untuk publikasi."]);
        return;
      }

      setSaveStatus("saving");
      await publishMutation.mutateAsync(targetId);

      clearLocalBackup(targetId);
      setSaveStatus("saved");
      showToast({
        variant: "success",
        message: "Artikel berhasil dipublikasikan!",
      });
      router.push("/my-articles");
    } catch (err) {
      setSaveStatus("error");
      if (isApiError(err)) {
        if (err.statusCode === 401) {
          setIsSessionExpired(true);
          setSaveError(
            "Sesi berakhir, login ulang di tab baru lalu coba lagi"
          );
          return;
        }
        setPublishErrors(err.messages);
      } else {
        setPublishErrors([
          "Gagal mempublikasikan artikel. Silakan coba beberapa saat lagi.",
        ]);
      }
    }
  }, [
    activeArticleId,
    flushSave,
    publishMutation,
    router,
    setIsSessionExpired,
    setSaveError,
    setSaveStatus,
    showToast,
  ]);

  useEffect(() => {
    return registerActions({
      saveDraft: handleSaveDraft,
      publish: handlePublish,
      retrySave: handleRetrySave,
    });
  }, [handlePublish, handleRetrySave, handleSaveDraft, registerActions]);

  const handleTitleEnter = () => {
    subtitleRef.current?.focus();
  };

  const handleSubtitleEnter = () => {
    editorRef.current?.focusStart();
  };

  const handleRequestAiHelp = useCallback(() => {
    onRequestAiHelp?.();
  }, [onRequestAiHelp]);

  return (
    <div className="w-full max-w-[920px] mx-auto py-4 sm:py-6">
      {/* Toast Notifikasi */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            "fixed bottom-6 right-6 z-50 max-w-sm rounded-xl border px-4 py-3 shadow-lg flex items-center gap-2.5 text-xs sm:text-sm font-medium transition-all",
            toast.variant === "success"
              ? "border-[var(--success)] bg-[var(--success-soft)] text-[var(--success-text)]"
              : "border-[var(--failed)] bg-[var(--failed-soft)] text-[var(--failed-text)]"
          )}
        >
          {toast.variant === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          )}
          <span className="flex-1">{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Tutup notifikasi"
            className="p-0.5 rounded-md hover:bg-[var(--background)]/50 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="w-full pl-12 sm:pl-16 flex flex-col gap-5 sm:gap-6">
        {/* Banner 401: Sesi Berakhir */}
        {isSessionExpired && (
          <div
            role="alert"
            className="rounded-xl border border-[var(--warning)] bg-[var(--warning-soft)] p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-[var(--warning-text)]"
          >
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>
                Sesi berakhir, login ulang di tab baru lalu coba lagi
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <Button
                asChild
                variant="secondary"
                size="sm"
                className="h-8 px-3 text-xs font-medium gap-1.5 rounded-lg bg-[var(--background)] text-[var(--foreground)] border border-[var(--dust)]"
              >
                <a href="/login" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Login di Tab Baru</span>
                </a>
              </Button>

              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => void handleRetrySave()}
                className="h-8 px-3 text-xs font-medium gap-1.5 rounded-lg"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Coba lagi</span>
              </Button>
            </div>
          </div>
        )}

        {/* Banner Pemulihan Cadangan Lokal (localStorage) */}
        {pendingBackup && (
          <div
            role="alert"
            className="rounded-xl border border-[var(--information)] bg-[var(--information-soft)] p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-[var(--information-text)]"
          >
            <div className="flex items-start gap-2.5">
              <History className="w-5 h-5 shrink-0 mt-0.5" />
              <span>
                Ditemukan cadangan lokal yang lebih baru di perangkat ini.
                Apakah Anda ingin memulihkan perubahan tersebut?
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleDiscardBackup}
                className="h-8 px-3 text-xs font-medium rounded-lg bg-[var(--background)] text-[var(--foreground)] border border-[var(--dust)]"
              >
                Abaikan
              </Button>

              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleRestoreBackup}
                className="h-8 px-3 text-xs font-medium rounded-lg"
              >
                Pulihkan Cadangan
              </Button>
            </div>
          </div>
        )}

        {/* Banner Error Validasi Publikasi (message array dari backend) */}
        {publishErrors.length > 0 && (
          <FormAlert variant="error" messages={publishErrors} />
        )}

        {/* Banner Error Simpan Non-401 + Tombol Coba Lagi */}
        {saveError && !isSessionExpired && (
          <FormAlert variant="error" messages={saveError}>
            <div className="pt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => void handleRetrySave()}
                className="h-7 px-2.5 text-xs font-medium gap-1.5 rounded-lg bg-[var(--background)] text-[var(--foreground)] border border-[var(--dust)]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Coba lagi</span>
              </Button>
            </div>
          </FormAlert>
        )}

        <div className="flex flex-col gap-3">
          <TitleField
            value={title}
            onChange={(val) => {
              setTitle(val);
              if (publishErrors.length > 0) setPublishErrors([]);
            }}
            onEnterPress={handleTitleEnter}
          />

          <SubtitleField
            ref={subtitleRef}
            value={subtitle}
            onChange={setSubtitle}
            onEnterPress={handleSubtitleEnter}
          />
        </div>

        <CoverImageField
          value={coverImageUrl}
          onChange={setCoverImageUrl}
        />

        <RichTextEditor
          ref={editorRef}
          initialContent={content}
          onUpdate={(json) => {
            setContent(json);
            if (publishErrors.length > 0) setPublishErrors([]);
          }}
          onRequestAiHelp={handleRequestAiHelp}
        />
      </div>
    </div>
  );
}

export default function EditorStudioView({
  articleId,
  onRequestAiHelp,
}: EditorStudioViewProps = {}) {
  const isEditRoute = Boolean(articleId);
  const articleQuery = useArticle(articleId);

  if (isEditRoute && articleQuery.isLoading) {
    return <EditorStudioSkeleton />;
  }

  if (isEditRoute && (articleQuery.isError || !articleQuery.data)) {
    const err = articleQuery.error;
    const isNotFound =
      isApiError(err) && (err.statusCode === 404 || err.statusCode === 400);

    return (
      <div className="w-full max-w-[640px] mx-auto py-16 px-4 flex flex-col items-center text-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[var(--failed-soft)] text-[var(--failed-text)] flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h1 className="font-newsreader font-bold text-2xl sm:text-3xl text-[var(--foreground)]">
          {isNotFound ? "Artikel Tidak Ditemukan" : "Gagal Memuat Artikel"}
        </h1>

        <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
          {isNotFound
            ? "Artikel yang Anda cari tidak ditemukan atau Anda tidak memiliki akses untuk menyunting artikel ini."
            : isApiError(err)
              ? err.message
              : "Terjadi kesalahan saat mengambil data artikel dari server."}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button asChild variant="primaryOutline" size="sm">
            <Link href="/my-articles" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Artikel Saya</span>
            </Link>
          </Button>

          {isNotFound ? (
            <Button asChild variant="default" size="sm">
              <Link href="/editor-studio">Buat Tulisan Baru</Link>
            </Button>
          ) : (
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() => void articleQuery.refetch()}
              className="gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Coba Lagi</span>
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <EditorStudioCanvas
      key={articleId ?? "new"}
      initialArticle={isEditRoute ? (articleQuery.data ?? null) : null}
      onRequestAiHelp={onRequestAiHelp}
    />
  );
}
