"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { Tag, X } from "lucide-react";
import type { JSONContent } from "@tiptap/react";
import RichTextEditor, {
  DEFAULT_INITIAL_CONTENT,
  type RichTextEditorHandle,
} from "@/components/_views/EditorStudio/RichTextEditor";
import { useMe } from "@/services/auth/auth.queries";
import { cn } from "@/lib/utils";
import PostGuidelinesSidebar from "./PostGuidelinesSidebar";
import {
  clearCommunityDraft,
  getDraftPresenceSnapshot,
  getEmptyDraftPresence,
  loadCommunityDraft,
  saveCommunityDraft,
  saveCommunityPost,
  subscribeCommunityDrafts,
} from "./storage";
import type { CommunityDetail, CommunityPost } from "../CommunityDetail/types";

interface CommunityPostCreateViewProps {
  community: CommunityDetail;
}

const TITLE_MAX_LENGTH = 300;

const FLAIR_OPTIONS = [
  "Diskusi",
  "Rekomendasi",
  "Pertanyaan",
  "Showcase",
  "Info",
  "Tips",
];

function extractEditorText(node: JSONContent): string {
  if (node.type === "hardBreak") {
    return "\n";
  }

  if (typeof node.text === "string") {
    return node.text;
  }

  if (!Array.isArray(node.content)) {
    return "";
  }

  const separator =
    node.type === "doc" ||
    node.type === "bulletList" ||
    node.type === "orderedList"
      ? "\n"
      : "";

  return node.content.map(extractEditorText).join(separator);
}

export default function CommunityPostCreateView({
  community,
}: CommunityPostCreateViewProps) {
  const router = useRouter();
  const { data: user } = useMe();
  const editorRef = useRef<RichTextEditorHandle | null>(null);
  const contentRef = useRef<JSONContent>(DEFAULT_INITIAL_CONTENT);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [showFlairs, setShowFlairs] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const hasDraft = useSyncExternalStore(
    subscribeCommunityDrafts,
    () => getDraftPresenceSnapshot(community.id),
    getEmptyDraftPresence
  );

  const canSubmit =
    title.trim().length > 0 && body.trim().length > 0 && tags.length > 0;

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 3000);
  };

  const handleEditorUpdate = useCallback((json: JSONContent) => {
    contentRef.current = json;
    setBody(extractEditorText(json).trim());
  }, []);

  const toggleTag = (tag: string) => {
    setTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag]
    );
  };

  const handleSaveDraft = () => {
    saveCommunityDraft(community.id, {
      title,
      body,
      content: contentRef.current,
      tags,
      savedAt: new Date().toISOString(),
    });
    showNotice("Draft berhasil disimpan.");
  };

  const handleRestoreDraft = () => {
    const draft = loadCommunityDraft(community.id);
    if (!draft) {
      showNotice("Belum ada draft yang tersimpan.");
      return;
    }

    setTitle(draft.title);
    setBody(draft.body);
    setTags(draft.tags);
    contentRef.current = draft.content;
    editorRef.current?.setContent(draft.content);
    showNotice("Draft dipulihkan.");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    const publisher = user?.email?.split("@")[0] ?? "Anggota Tel-U";
    const trimmedBody = body.trim();
    const post: CommunityPost = {
      id: Date.now(),
      topic: community.name,
      publisher,
      postDate: new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date()),
      title: title.trim(),
      description:
        trimmedBody.length > 280
          ? `${trimmedBody.slice(0, 280)}…`
          : trimmedBody,
      likesCount: 0,
      commentsCount: 0,
      repostsCount: 0,
      isLiked: false,
    };

    saveCommunityPost(community.id, post);
    clearCommunityDraft(community.id);
    router.push(`/communities/${community.id}`);
  };

  return (
    <div className="grid w-full grid-cols-1 gap-x-10 py-2 sm:py-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-x-12">
      <form onSubmit={handleSubmit} className="min-w-0">
        {/* Komunitas tujuan + draft */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href={`/communities/${community.id}`}
            className="inline-flex h-11 min-w-0 items-center gap-2 rounded-full border border-[var(--dust)] px-3 transition-colors hover:bg-[var(--background-accent)]"
          >
            <img
              src={community.avatarUrl}
              alt=""
              className="h-7 w-7 shrink-0 rounded-full object-cover"
            />
            <span className="min-w-0 max-w-[220px] truncate font-sans text-[13px] font-semibold text-[var(--foreground)]">
              {community.name}
            </span>
          </Link>

          <button
            type="button"
            onClick={handleRestoreDraft}
            title={
              hasDraft
                ? "Ada draft tersimpan untuk komunitas ini"
                : "Belum ada draft tersimpan"
            }
            aria-label={
              hasDraft
                ? "Pulihkan draft tersimpan"
                : "Belum ada draft tersimpan"
            }
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 font-sans text-[13px] font-semibold transition-colors",
              hasDraft
                ? "text-[var(--primary-text)] hover:text-[var(--primary-hover)]"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            )}
          >
            Pulihkan Draft
          </button>
        </div>

        {notice && (
          <div
            role="status"
            className="mt-4 rounded-lg bg-[var(--success-soft)] px-3 py-2 font-sans text-[13px] text-[var(--success-text)]"
          >
            {notice}
          </div>
        )}

        {/* Judul */}
        <div className="mt-6">
          <label htmlFor="post-title" className="sr-only">
            Judul postingan
          </label>
          <input
            id="post-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Judul*"
            maxLength={TITLE_MAX_LENGTH}
            className="w-full border-b border-transparent bg-transparent pb-3 font-sans text-[24px] font-bold text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted)]/70 focus:border-[var(--dust)] sm:text-[28px]"
          />
          <div className="mt-1.5 flex items-center justify-between gap-3">
            <p className="font-sans text-[11px] text-[var(--muted)]">
              Judul postingan wajib diisi.
            </p>
            <span className="shrink-0 font-sans text-[11px] text-[var(--muted)]">
              {title.length}/{TITLE_MAX_LENGTH}
            </span>
          </div>
        </div>

        {/* Flair dan tag */}
        <div className="mt-5">
          <button
            type="button"
            onClick={() => setShowFlairs((current) => !current)}
            aria-expanded={showFlairs}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-full border px-4 font-sans text-[13px] font-semibold transition-colors",
              tags.length > 0
                ? "border-[var(--primary)]/40 bg-[var(--primary-soft)] text-[var(--primary-text)]"
                : "border-[var(--dust)] text-[var(--foreground)] hover:bg-[var(--background-accent)]"
            )}
          >
            <Tag className="h-4 w-4" />
            Tambahkan flair dan tag
            <span className="text-[var(--primary)]" aria-hidden="true">
              *
            </span>
          </button>

          {showFlairs && (
            <div className="mt-3 flex flex-wrap gap-2">
              {FLAIR_OPTIONS.map((flair) => {
                const isSelected = tags.includes(flair);

                return (
                  <button
                    key={flair}
                    type="button"
                    onClick={() => toggleTag(flair)}
                    aria-pressed={isSelected}
                    className={cn(
                      "rounded-full border px-3 py-1.5 font-sans text-[12px] font-medium transition-colors",
                      isSelected
                        ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                        : "border-[var(--dust)] bg-white text-[var(--foreground)] hover:bg-[var(--background-accent)]"
                    )}
                  >
                    {flair}
                  </button>
                );
              })}
            </div>
          )}

          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-[var(--primary-soft)] px-2.5 py-1 font-sans text-[11px] font-semibold text-[var(--primary-text)]"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => toggleTag(tag)}
                    aria-label={`Hapus tag ${tag}`}
                    className="rounded-full p-0.5 transition-colors hover:bg-white/60"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <p className="mt-1.5 font-sans text-[11px] text-[var(--muted)]">
            Wajib pilih minimal satu flair atau tag.
          </p>
        </div>

        {/* Isi postingan */}
        <div className="mt-7">
          <p className="font-sans text-[13px] font-bold text-[var(--foreground)]">
            Isi postingan{" "}
            <span className="text-[var(--primary)]" aria-hidden="true">
              *
            </span>
          </p>

          <div className="mt-2 rounded-xl border border-[var(--dust)]/70 bg-white">
            <div className="px-4 py-3 [&_.editor-content]:text-[15px] [&_.editor-content_blockquote]:text-[15px] [&_.editor-content_blockquote]:leading-relaxed [&_.editor-content_h2]:text-[22px] [&_.editor-content_h3]:text-[18px] [&_.editor-content_li]:text-[15px] [&_.editor-content_li]:leading-relaxed [&_.editor-content_p]:mb-3 [&_.editor-content_p]:text-[15px] [&_.editor-content_p]:leading-relaxed [&_.editor-content_pre]:text-[13px]">
              <RichTextEditor
                ref={editorRef}
                ariaLabel="Isi postingan"
                initialContent={DEFAULT_INITIAL_CONTENT}
                onUpdate={handleEditorUpdate}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--dust)]/50 px-4 py-3">
              <p className="font-sans text-[11px] text-[var(--muted)]">
                Pilih teks untuk memunculkan toolbar format.
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-[var(--dust)] px-4 font-sans text-[13px] font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--background-accent)]"
                >
                  Simpan Draft
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="inline-flex h-9 items-center justify-center rounded-lg bg-[var(--primary)] px-5 font-sans text-[13px] font-semibold text-white transition-colors hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Posting
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      <PostGuidelinesSidebar community={community} />
    </div>
  );
}
