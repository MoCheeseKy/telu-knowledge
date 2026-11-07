"use client";

import React, { useState } from "react";
import { ThumbsUp } from "lucide-react";
import { ForumComment } from "./types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ForumCommentsThreadProps {
  initialComments: ForumComment[];
}

function CommentItem({
  comment,
  onReplySubmit,
}: {
  comment: ForumComment;
  onReplySubmit: (parentId: string | number, text: string) => void;
}) {
  const [isLiked, setIsLiked] = useState(comment.userVote === 1);
  const [likesCount, setLikesCount] = useState(comment.score);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleToggleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onReplySubmit(comment.id, replyText);
    setReplyText("");
    setIsReplying(false);
  };

  return (
    <div className="flex flex-col py-4 border-b border-[var(--dust)]/40 last:border-b-0">
      {/* Penulis & Waktu */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-[3px] bg-[var(--primary)] text-white text-[11px] font-bold flex items-center justify-center shrink-0 select-none">
          {comment.author.initial}
        </div>
        <span className="font-sans text-xs font-semibold text-[var(--foreground)]">
          {comment.author.name}
        </span>
        {comment.author.badge && (
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[var(--background-accent)] text-[var(--muted)]">
            {comment.author.badge}
          </span>
        )}
        <span className="text-[11px] text-[var(--muted)]">
          • {comment.createdAt}
        </span>
      </div>

      {/* Konten komentar */}
      <p className="font-sans text-[14px] text-[var(--foreground)] leading-relaxed mt-2 pl-8 whitespace-pre-line">
        {comment.content}
      </p>

      {/* Aksi Suka & Balas */}
      <div className="flex items-center gap-3 mt-2 pl-8">
        <button
          type="button"
          onClick={handleToggleLike}
          className="flex items-center gap-1.5 text-xs font-semibold text-[var(--muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
        >
          <ThumbsUp
            className={cn(
              "w-3.5 h-3.5 transition-colors",
              isLiked ? "fill-[var(--primary-text)] text-[var(--primary-text)]" : ""
            )}
          />
          <span className={cn(isLiked && "text-[var(--primary-text)]")}>
            {likesCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setIsReplying(!isReplying)}
          className="text-xs font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
        >
          Balas
        </button>
      </div>

      {/* Form Balasan Inline */}
      {isReplying && (
        <form onSubmit={handleSendReply} className="mt-3 pl-8 flex flex-col gap-2">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`Balas komentar ${comment.author.name}...`}
            rows={2}
            autoFocus
            className="w-full text-xs p-3 rounded-lg border border-[var(--dust)] bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--foreground)] resize-none"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsReplying(false)}
              className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] px-2 py-1 cursor-pointer"
            >
              Batal
            </button>
            <Button
              type="submit"
              size="sm"
              disabled={!replyText.trim()}
              className="h-7 px-3 text-xs bg-[var(--foreground)] hover:bg-[var(--foreground)]/90 text-white rounded-md font-semibold cursor-pointer"
            >
              Kirim
            </Button>
          </div>
        </form>
      )}

      {/* Balasan bersarang (Nested replies) */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="pl-6 mt-3 flex flex-col gap-2 border-l border-[var(--dust)]/40 ml-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReplySubmit={onReplySubmit}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ForumCommentsThread({
  initialComments,
}: ForumCommentsThreadProps) {
  const [comments, setComments] = useState<ForumComment[]>(initialComments);
  const [newCommentText, setNewCommentText] = useState("");

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: ForumComment = {
      id: Date.now(),
      author: {
        name: "Sofia Manar",
        initial: "S",
        department: "S1 Software Engineering",
      },
      createdAt: "Baru saja",
      content: newCommentText.trim(),
      score: 0,
      userVote: 0,
      replies: [],
    };

    setComments((prev) => [newComment, ...prev]);
    setNewCommentText("");
  };

  const handleReplySubmit = (parentId: string | number, text: string) => {
    const newReply: ForumComment = {
      id: Date.now(),
      author: {
        name: "Sofia Manar",
        initial: "S",
        department: "S1 Software Engineering",
      },
      createdAt: "Baru saja",
      content: text.trim(),
      score: 0,
      userVote: 0,
      replies: [],
    };

    const addRecursive = (list: ForumComment[]): ForumComment[] => {
      return list.map((item) => {
        if (item.id === parentId) {
          return {
            ...item,
            replies: [...(item.replies || []), newReply],
          };
        }
        if (item.replies && item.replies.length > 0) {
          return {
            ...item,
            replies: addRecursive(item.replies),
          };
        }
        return item;
      });
    };

    setComments((prev) => addRecursive(prev));
  };

  return (
    <section id="komentar" className="mt-10 flex flex-col w-full">
      <h3 className="font-sans text-[16px] font-bold uppercase text-[var(--primary-text)] tracking-wider mb-4">
        Tanggapan & Diskusi ({comments.length})
      </h3>

      {/* Input komentar baru */}
      <form onSubmit={handleAddComment} className="flex flex-col gap-2.5 mb-6">
        <textarea
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder="Tulis tanggapan atau komentar Anda..."
          rows={3}
          className="w-full text-sm p-3.5 rounded-lg border border-[var(--dust)] bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--foreground)] resize-none"
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!newCommentText.trim()}
            className="h-8 px-4 text-xs font-semibold bg-[var(--foreground)] hover:bg-[var(--foreground)]/90 text-white rounded-md cursor-pointer disabled:opacity-40"
          >
            Kirim Komentar
          </Button>
        </div>
      </form>

      {/* Daftar komentar */}
      <div className="flex flex-col">
        {comments.length === 0 ? (
          <p className="py-8 text-center text-xs text-[var(--muted)]">
            Belum ada tanggapan. Jadilah yang pertama memulai diskusi!
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReplySubmit={handleReplySubmit}
            />
          ))
        )}
      </div>
    </section>
  );
}
