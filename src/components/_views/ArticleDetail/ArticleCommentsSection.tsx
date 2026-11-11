"use client";

import React, { useState } from "react";
import { MessageSquare, Send, Reply } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ArticleComment } from "@/services/articles/articles.types";

interface ArticleCommentsSectionProps {
  articleId?: string;
  initialComments?: ArticleComment[];
}

function formatCommentDate(dateString?: string): string {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return dateString;
  }
}

const DUMMY_COMMENTS: ArticleComment[] = [
  {
    id: "c-1",
    articleId: "",
    authorId: "1",
    parentId: null,
    content:
      "Penjelasan yang sangat terstruktur dan mudah dipahami untuk persiapan sidang komprehensif. Terima kasih sudah berbagi!",
    createdAt: "2024-10-09T08:30:00Z",
    updatedAt: "2024-10-09T08:30:00Z",
    author: {
      id: "1",
      displayName: "Aditya Pratama",
      avatarUrl: null,
      avatarColor: "#10B981",
      major: "S1 Informatika",
    },
  },
  {
    id: "c-2",
    articleId: "",
    authorId: "2",
    parentId: "c-1",
    content: "Setuju, bagian tips demo visualisasi metrik sangat membantu!",
    createdAt: "2024-10-09T09:15:00Z",
    updatedAt: "2024-10-09T09:15:00Z",
    author: {
      id: "2",
      displayName: "Farhan Danendra",
      avatarUrl: null,
      avatarColor: "#EA5753",
      major: "S1 Informatika",
    },
  },
];

function CommentItem({
  comment,
  replies = [],
  onReplySubmit,
}: {
  comment: ArticleComment;
  replies?: ArticleComment[];
  onReplySubmit: (parentId: string, content: string) => void;
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const author = comment.author;
  const initial = (author.displayName || "U").charAt(0).toUpperCase();

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onReplySubmit(comment.id, replyText.trim());
    setReplyText("");
    setIsReplying(false);
  };

  return (
    <div className="flex flex-col py-4 border-b border-[var(--dust)]/40 last:border-b-0">
      {/* Baris identitas penulis komentar */}
      <div className="flex items-center gap-2.5">
        {author.avatarUrl ? (
          <img
            src={author.avatarUrl}
            alt={author.displayName}
            className="w-7 h-7 rounded-[4px] object-cover shrink-0"
          />
        ) : (
          <div
            aria-hidden="true"
            style={{ backgroundColor: author.avatarColor || "var(--primary)" }}
            className="w-7 h-7 rounded-[4px] text-white text-xs font-bold flex items-center justify-center shrink-0 select-none shadow-xs"
          >
            {initial}
          </div>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-sans text-xs sm:text-sm font-semibold text-[var(--foreground)]">
            {author.displayName}
          </span>
          {author.major && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[var(--background-accent)] text-[var(--muted)]">
              {author.major}
            </span>
          )}
          <span className="text-[11px] text-[var(--muted)]">
            • {formatCommentDate(comment.createdAt)}
          </span>
        </div>
      </div>

      {/* Isi teks komentar */}
      <p className="font-sans text-[14px] sm:text-[15px] leading-relaxed text-[#2B2725] mt-2.5 pl-9">
        {comment.content}
      </p>

      {/* Aksi balas komentar */}
      <div className="mt-2 pl-9 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsReplying(!isReplying)}
          className="inline-flex items-center gap-1 text-xs text-[var(--muted)] hover:text-[var(--primary-text)] font-medium transition-colors cursor-pointer"
        >
          <Reply className="w-3.5 h-3.5" />
          <span>Balas</span>
        </button>
      </div>

      {/* Form balasan komentar jika tombol balas diklik */}
      {isReplying && (
        <form
          onSubmit={handleSendReply}
          className="mt-3 pl-9 flex flex-col gap-2"
        >
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`Balas komentar ${author.displayName}...`}
            rows={2}
            className="w-full p-2.5 rounded-lg border border-[var(--dust)] text-xs font-sans text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] resize-none bg-[var(--background)]"
          />
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsReplying(false);
                setReplyText("");
              }}
              className="text-xs h-7 px-2.5 cursor-pointer text-[var(--muted)]"
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!replyText.trim()}
              className="text-xs h-7 px-3 bg-[var(--primary-text)] hover:opacity-90 text-white cursor-pointer"
            >
              Kirim Balasan
            </Button>
          </div>
        </form>
      )}

      {/* Daftar balasan (nested replies) */}
      {replies.length > 0 && (
        <div className="mt-3 pl-6 border-l-2 border-[var(--dust)]/50 flex flex-col gap-3">
          {replies.map((reply) => {
            const rAuthor = reply.author;
            const rInitial = (rAuthor.displayName || "U")
              .charAt(0)
              .toUpperCase();
            return (
              <div key={reply.id} className="flex flex-col py-1">
                <div className="flex items-center gap-2">
                  {rAuthor.avatarUrl ? (
                    <img
                      src={rAuthor.avatarUrl}
                      alt={rAuthor.displayName}
                      className="w-6 h-6 rounded-[3px] object-cover shrink-0"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      style={{
                        backgroundColor: rAuthor.avatarColor || "var(--primary)",
                      }}
                      className="w-6 h-6 rounded-[3px] text-white text-[10px] font-bold flex items-center justify-center shrink-0 select-none"
                    >
                      {rInitial}
                    </div>
                  )}
                  <span className="font-sans text-xs font-semibold text-[var(--foreground)]">
                    {rAuthor.displayName}
                  </span>
                  <span className="text-[11px] text-[var(--muted)]">
                    • {formatCommentDate(reply.createdAt)}
                  </span>
                </div>
                <p className="font-sans text-[13px] sm:text-[14px] leading-relaxed text-[#2B2725] mt-1.5 pl-8">
                  {reply.content}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Komponen Slicing UI Komentar Artikel.
 * Catatan: Integrasi API komentar tidak dilakukan di sini karena dikerjakan oleh rekan tim.
 */
export default function ArticleCommentsSection({
  initialComments,
}: ArticleCommentsSectionProps) {
  const [comments, setComments] = useState<ArticleComment[]>(
    initialComments && initialComments.length > 0
      ? initialComments
      : DUMMY_COMMENTS
  );
  const [commentText, setCommentText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    // Simulasi penambahan komentar lokal (dummy UI slicing)
    const newComment: ArticleComment = {
      id: `local-${Date.now()}`,
      articleId: "",
      authorId: "me",
      parentId: null,
      content: commentText.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: "me",
        displayName: "Pengguna",
        avatarUrl: null,
        avatarColor: "#EA5753",
      },
    };

    setComments((prev) => [newComment, ...prev]);
    setCommentText("");
  };

  const handleReplySubmit = (parentId: string, content: string) => {
    // Simulasi penambahan balasan lokal (dummy UI slicing)
    const newReply: ArticleComment = {
      id: `local-reply-${Date.now()}`,
      articleId: "",
      authorId: "me",
      parentId,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: "me",
        displayName: "Pengguna",
        avatarUrl: null,
        avatarColor: "#EA5753",
      },
    };

    setComments((prev) => [...prev, newReply]);
  };

  // Pisahkan root comments (tanpa parent_id) dan replies (berdasarkan parent_id)
  const rootComments = comments.filter((c) => !c.parentId);
  const repliesMap = comments.reduce<Record<string, ArticleComment[]>>(
    (acc, c) => {
      if (c.parentId) {
        if (!acc[c.parentId]) acc[c.parentId] = [];
        acc[c.parentId].push(c);
      }
      return acc;
    },
    {}
  );

  return (
    <section id="komentar" className="mt-10 flex flex-col w-full scroll-mt-24">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-[var(--primary-text)]" />
        <h3 className="font-sans text-lg font-bold text-[var(--foreground)]">
          Komentar & Diskusi ({comments.length})
        </h3>
      </div>

      {/* Form tambah komentar baru */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2.5 p-4 rounded-xl border border-[var(--dust)] bg-[var(--background)] shadow-2xs"
      >
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Tulis tanggapan atau pertanyaan Anda terkait artikel ini..."
          rows={3}
          className="w-full p-3 rounded-lg border border-[var(--dust)] text-xs sm:text-sm font-sans text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] resize-none bg-[var(--background)]"
        />

        <div className="flex items-center justify-end">
          <Button
            type="submit"
            size="sm"
            disabled={!commentText.trim()}
            className="gap-1.5 text-xs font-semibold px-4 py-2 bg-[var(--primary-text)] hover:opacity-90 text-white rounded-lg cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim Komentar</span>
          </Button>
        </div>
      </form>

      {/* Daftar komentar */}
      <div className="mt-6 flex flex-col">
        {rootComments.length === 0 ? (
          <p className="py-8 text-center text-xs text-[var(--muted)] font-sans">
            Belum ada komentar pada artikel ini. Jadilah yang pertama memberikan
            tanggapan!
          </p>
        ) : (
          rootComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              replies={repliesMap[comment.id] || []}
              onReplySubmit={handleReplySubmit}
            />
          ))
        )}
      </div>
    </section>
  );
}
