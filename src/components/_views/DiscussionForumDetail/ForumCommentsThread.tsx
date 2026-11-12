"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ThumbsUp } from "lucide-react";
import { ForumComment } from "./types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { forumCommentsApi } from "@/services/forum-comments/forum-comments.api";
import type { ForumComment as ApiForumComment } from "@/services/forum-comments/forum-comments.types";

const DEFAULT_CURRENT_USER_ID = "10000000-0000-4000-8000-000000000001";

interface ForumCommentsThreadProps {
  postId?: string;
  currentUserId?: string;
}

function formatCommentDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function buildCommentTree(items: ApiForumComment[]): ForumComment[] {
  const nodes = new Map<string, ForumComment>();

  items.forEach((item) => {
    const displayName = item.author?.displayName ?? "Anggota Tel-U";
    nodes.set(item.id, {
      id: item.id,
      authorId: item.authorId,
      author: {
        name: displayName,
        avatarUrl: item.author?.avatarUrl ?? undefined,
        initial: (displayName.trim()[0] ?? "U").toUpperCase(),
      },
      createdAt: formatCommentDate(item.createdAt),
      content: item.content,
      score: item.score,
      userVote: item.isLiked ? 1 : 0,
      replies: [],
    });
  });

  const roots: ForumComment[] = [];

  items.forEach((item) => {
    const node = nodes.get(item.id);
    if (!node) return;
    const parent = item.parentId ? nodes.get(item.parentId) : undefined;
    if (parent && parent.replies) {
      parent.replies.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

function CommentItem({
  comment,
  currentUserId,
  onReplySubmit,
  onDelete,
  onUpdate,
}: {
  comment: ForumComment;
  currentUserId: string;
  onReplySubmit: (parentId: string | number, text: string) => void;
  onDelete: (id: string | number) => void;
  onUpdate: (id: string | number, newContent: string) => void;
}) {
  const [isLiked, setIsLiked] = useState(comment.userVote === 1);
  const [likesCount, setLikesCount] = useState(comment.score);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const canManage = comment.authorId === currentUserId;

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

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editContent.trim()) return;
    onUpdate(comment.id, editContent);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col py-4 border-b border-[var(--dust)]/40 last:border-b-0">
      <div className="flex items-center justify-between">
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

        {canManage && (
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setEditContent(comment.content);
                setIsEditing(!isEditing);
              }}
              className="text-[var(--muted)] hover:text-[var(--foreground)] cursor-pointer"
            >
              {isEditing ? "Batal" : "Edit"}
            </button>
            <button
              type="button"
              onClick={() => onDelete(comment.id)}
              className="text-red-500 hover:text-red-700 cursor-pointer"
            >
              Hapus
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSaveEdit} className="mt-2 pl-8 flex flex-col gap-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={2}
            className="w-full text-xs p-3 rounded-lg border border-[var(--dust)] bg-transparent text-[var(--foreground)] focus:outline-none focus:border-[var(--foreground)] resize-none"
          />
          <div className="flex justify-end gap-2">
            <Button
              type="submit"
              size="sm"
              className="h-7 px-3 text-xs bg-[var(--foreground)] text-white rounded-md font-semibold cursor-pointer"
            >
              Simpan
            </Button>
          </div>
        </form>
      ) : (
        <p className="font-sans text-[14px] text-[var(--foreground)] leading-relaxed mt-2 pl-8 whitespace-pre-line">
          {comment.content}
        </p>
      )}

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

      {comment.replies && comment.replies.length > 0 && (
        <div className="pl-6 mt-3 flex flex-col gap-2 border-l border-[var(--dust)]/40 ml-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              onReplySubmit={onReplySubmit}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ForumCommentsThread({
  postId,
  currentUserId = DEFAULT_CURRENT_USER_ID,
}: ForumCommentsThreadProps) {
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [newCommentText, setNewCommentText] = useState("");

  const loadComments = useCallback(async () => {
    if (!postId) {
      setComments([]);
      setTotalCount(0);
      setLoading(false);
      return;
    }

    try {
      const response = await forumCommentsApi.listForumComments(postId);
      const items = response.data ?? [];
      setComments(buildCommentTree(items));
      setTotalCount(items.length);
    } catch (error) {
      console.error("Gagal memuat komentar:", error);
      setComments([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    setLoading(true);
    void loadComments();
  }, [loadComments]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postId || !newCommentText.trim()) return;

    try {
      await forumCommentsApi.createForumComment(postId, {
        content: newCommentText.trim(),
      });
      setNewCommentText("");
      await loadComments();
    } catch (error) {
      console.error("Gagal mengirim komentar:", error);
    }
  };

  const handleReplySubmit = async (parentId: string | number, text: string) => {
    if (!postId) return;

    try {
      await forumCommentsApi.createForumComment(postId, {
        content: text.trim(),
        parentId: String(parentId),
      });
      await loadComments();
    } catch (error) {
      console.error("Gagal membalas komentar:", error);
    }
  };

  const handleUpdateComment = async (id: string | number, newContent: string) => {
    try {
      await forumCommentsApi.updateForumComment(String(id), {
        content: newContent.trim(),
      });
      await loadComments();
    } catch (error) {
      console.error("Gagal mengubah komentar:", error);
    }
  };

  const handleDeleteComment = async (id: string | number) => {
    if (!window.confirm("Yakin ingin menghapus komentar ini?")) return;

    try {
      await forumCommentsApi.deleteForumComment(String(id));
      await loadComments();
    } catch (error) {
      console.error("Gagal menghapus komentar:", error);
    }
  };

  if (loading) {
    return (
      <div className="py-8 text-center text-xs text-[var(--muted)]">
        Memuat komentar...
      </div>
    );
  }

  return (
    <section id="komentar" className="mt-10 flex flex-col w-full">
      <h3 className="font-sans text-[16px] font-bold uppercase text-[var(--primary-text)] tracking-wider mb-4">
        Tanggapan & Diskusi ({totalCount})
      </h3>

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
              currentUserId={currentUserId}
              onReplySubmit={handleReplySubmit}
              onDelete={handleDeleteComment}
              onUpdate={handleUpdateComment}
            />
          ))
        )}
      </div>
    </section>
  );
}