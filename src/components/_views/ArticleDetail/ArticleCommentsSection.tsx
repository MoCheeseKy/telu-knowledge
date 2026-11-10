"use client";

import React, { useState } from "react";
import { MessageSquare, Send, Reply } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateArticleComment } from "@/services/articles/articles.queries";
import type { ArticleComment } from "@/services/articles/articles.types";

interface ArticleCommentsSectionProps {
  articleId: string;
  initialComments: ArticleComment[];
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

function CommentItem({
  comment,
  replies = [],
  onReplySubmit,
  isSubmitting,
}: {
  comment: ArticleComment;
  replies?: ArticleComment[];
  onReplySubmit: (parentId: string, content: string) => void;
  isSubmitting: boolean;
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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--muted)] hover:text-[var(--primary-text)] transition-colors cursor-pointer"
        >
          <Reply className="w-3.5 h-3.5" />
          <span>Balas</span>
        </button>
      </div>

      {/* Form balasan komentar inline */}
      {isReplying && (
        <form onSubmit={handleSendReply} className="mt-3 pl-9 flex flex-col gap-2">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`Balas ${author.displayName}...`}
            rows={2}
            className="w-full text-xs sm:text-sm p-3 rounded-lg border border-[var(--dust)] focus:border-[var(--primary-text)] focus:outline-none bg-transparent resize-none"
          />
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsReplying(false)}
              className="text-xs h-7 px-2.5 cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!replyText.trim() || isSubmitting}
              className="text-xs h-7 px-3 bg-[var(--primary-text)] hover:bg-[var(--primary-hover)] text-white cursor-pointer"
            >
              Kirim Balasan
            </Button>
          </div>
        </form>
      )}

      {/* Daftar balasan berulang (nested replies) */}
      {replies.length > 0 && (
        <div className="mt-3 pl-9 space-y-3 border-l-2 border-[var(--dust)]/40 ml-3.5">
          {replies.map((reply) => {
            const rAuthor = reply.author;
            const rInitial = (rAuthor.displayName || "U").charAt(0).toUpperCase();
            return (
              <div key={reply.id} className="pt-2 pl-4 flex flex-col">
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
                      style={{ backgroundColor: rAuthor.avatarColor || "var(--primary)" }}
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

export default function ArticleCommentsSection({
  articleId,
  initialComments = [],
}: ArticleCommentsSectionProps) {
  const [commentText, setCommentText] = useState("");
  const createCommentMutation = useCreateArticleComment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    createCommentMutation.mutate(
      {
        articleId,
        payload: { content: commentText.trim() },
      },
      {
        onSuccess: () => {
          setCommentText("");
        },
      }
    );
  };

  const handleReplySubmit = (parentId: string, content: string) => {
    createCommentMutation.mutate({
      articleId,
      payload: { content, parent_id: parentId },
    });
  };

  // Pisahkan root comments (tanpa parent_id) dan replies (berdasarkan parent_id)
  const rootComments = initialComments.filter((c) => !c.parentId);
  const repliesMap = initialComments.reduce<Record<string, ArticleComment[]>>(
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
          Komentar & Diskusi ({initialComments.length})
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
          placeholder="Tulis tanggapan atau perspektif Anda mengenai artikel ini..."
          rows={3}
          className="w-full text-sm p-2 bg-transparent focus:outline-none resize-none placeholder:text-[var(--muted)]"
        />
        <div className="flex items-center justify-between pt-2 border-t border-[var(--dust)]/40">
          <p className="text-[11px] text-[var(--muted)]">
            Berkomentar sebagai civitas akademika Telkom University
          </p>
          <Button
            type="submit"
            size="sm"
            disabled={!commentText.trim() || createCommentMutation.isPending}
            className="h-8 px-4 gap-1.5 bg-[var(--primary-text)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>
              {createCommentMutation.isPending ? "Mengirim..." : "Kirim Komentar"}
            </span>
          </Button>
        </div>
      </form>

      {/* Daftar Komentar */}
      <div className="mt-6 flex flex-col">
        {rootComments.length === 0 ? (
          <div className="py-8 text-center text-sm text-[var(--muted)] border border-dashed rounded-xl border-[var(--dust)]">
            Belum ada tanggapan. Jadilah yang pertama memberikan ulasan!
          </div>
        ) : (
          rootComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              replies={repliesMap[comment.id]}
              onReplySubmit={handleReplySubmit}
              isSubmitting={createCommentMutation.isPending}
            />
          ))
        )}
      </div>
    </section>
  );
}

