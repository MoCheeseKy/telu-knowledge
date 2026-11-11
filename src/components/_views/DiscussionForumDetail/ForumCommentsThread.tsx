"use client";

import React, { useState } from "react";
import { ThumbsUp, Pencil, Trash2, Loader2 } from "lucide-react";
import { ForumComment, buildForumCommentTree } from "./types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { MOCK_VIEWER_ID } from "@/services/community-posts/community-posts.types";
import {
  useForumPostComments,
  useCreateForumComment,
  useUpdateForumComment,
  useDeleteForumComment,
} from "@/services/community-posts/community-posts.queries";

interface ForumCommentsThreadProps {
  postId?: string | number;
  initialComments?: ForumComment[];
}

function CommentItem({
  comment,
  postId,
  onReplySubmit,
  onEditSubmit,
  onDeleteSubmit,
}: {
  comment: ForumComment;
  postId?: string;
  onReplySubmit: (parentId: string | number, text: string) => Promise<void>;
  onEditSubmit: (commentId: string | number, text: string) => Promise<void>;
  onDeleteSubmit: (commentId: string | number) => Promise<void>;
}) {
  const [isLiked, setIsLiked] = useState(comment.userVote === 1);
  const [likesCount, setLikesCount] = useState(comment.score);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Mode sunting
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  // Konfirmasi hapus
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isMine = comment.authorId === MOCK_VIEWER_ID;

  const handleToggleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || isSubmittingReply) return;
    setIsSubmittingReply(true);
    try {
      await onReplySubmit(comment.id, replyText);
      setReplyText("");
      setIsReplying(false);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editText.trim() || isSubmittingEdit) return;
    setIsSubmittingEdit(true);
    try {
      await onEditSubmit(comment.id, editText);
      setIsEditing(false);
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await onDeleteSubmit(comment.id);
      setIsConfirmingDelete(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col py-4 border-b border-[var(--dust)]/40 last:border-b-0">
      {/* Penulis & Waktu */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {comment.author.avatarUrl ? (
            <img
              src={comment.author.avatarUrl}
              alt={comment.author.name}
              className="w-6 h-6 rounded-[3px] object-cover shrink-0"
            />
          ) : (
            <div
              aria-hidden="true"
              style={{
                backgroundColor:
                  comment.author.avatarColor || "var(--primary)",
              }}
              className="w-6 h-6 rounded-[3px] text-white text-[11px] font-bold flex items-center justify-center shrink-0 select-none"
            >
              {comment.author.initial}
            </div>
          )}
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

        {/* Tombol aksi Sunting & Hapus untuk komentar milik sendiri */}
        {isMine && !isEditing && !isConfirmingDelete && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setEditText(comment.content);
                setIsEditing(true);
              }}
              className="p-1 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer rounded"
              title="Sunting komentar"
              aria-label="Sunting komentar"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsConfirmingDelete(true)}
              className="p-1 text-[var(--muted)] hover:text-[var(--failed)] transition-colors cursor-pointer rounded"
              title="Hapus komentar"
              aria-label="Hapus komentar"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Konfirmasi Hapus Komentar */}
      {isConfirmingDelete && (
        <div className="mt-2.5 pl-8 p-3 bg-[var(--failed-soft)]/50 border border-[var(--failed)]/40 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <p className="text-xs text-[var(--failed-text)] font-medium">
            Hapus komentar ini beserta seluruh balasannya?
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => setIsConfirmingDelete(false)}
              className="text-xs px-2.5 py-1 text-[var(--muted)] hover:text-[var(--foreground)] cursor-pointer"
            >
              Batal
            </button>
            <Button
              type="button"
              size="sm"
              disabled={isDeleting}
              onClick={handleConfirmDelete}
              className="h-7 px-3 text-xs bg-[var(--failed)] hover:bg-[var(--failed)]/90 text-white rounded-md font-semibold cursor-pointer"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin mr-1" />
                  Menghapus...
                </>
              ) : (
                "Hapus"
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Mode Edit vs Konten Normal */}
      {isEditing ? (
        <form onSubmit={handleSaveEdit} className="mt-3 pl-8 flex flex-col gap-2">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={2}
            autoFocus
            disabled={isSubmittingEdit}
            className="w-full text-xs p-3 rounded-lg border border-[var(--dust)] bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--foreground)] resize-none"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              disabled={isSubmittingEdit}
              onClick={() => {
                setIsEditing(false);
                setEditText(comment.content);
              }}
              className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] px-2 py-1 cursor-pointer"
            >
              Batal
            </button>
            <Button
              type="submit"
              size="sm"
              disabled={!editText.trim() || isSubmittingEdit}
              className="h-7 px-3 text-xs bg-[var(--foreground)] hover:bg-[var(--foreground)]/90 text-white rounded-md font-semibold cursor-pointer"
            >
              {isSubmittingEdit ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin mr-1" />
                  Menyimpan...
                </>
              ) : (
                "Simpan"
              )}
            </Button>
          </div>
        </form>
      ) : (
        <>
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
                  isLiked
                    ? "fill-[var(--primary-text)] text-[var(--primary-text)]"
                    : ""
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
        </>
      )}

      {/* Form Balasan Inline */}
      {isReplying && (
        <form onSubmit={handleSendReply} className="mt-3 pl-8 flex flex-col gap-2">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`Balas komentar ${comment.author.name}...`}
            rows={2}
            autoFocus
            disabled={isSubmittingReply}
            className="w-full text-xs p-3 rounded-lg border border-[var(--dust)] bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--foreground)] resize-none"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              disabled={isSubmittingReply}
              onClick={() => setIsReplying(false)}
              className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] px-2 py-1 cursor-pointer"
            >
              Batal
            </button>
            <Button
              type="submit"
              size="sm"
              disabled={!replyText.trim() || isSubmittingReply}
              className="h-7 px-3 text-xs bg-[var(--foreground)] hover:bg-[var(--foreground)]/90 text-white rounded-md font-semibold cursor-pointer"
            >
              {isSubmittingReply ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin mr-1" />
                  Mengirim...
                </>
              ) : (
                "Kirim"
              )}
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
              postId={postId}
              onReplySubmit={onReplySubmit}
              onEditSubmit={onEditSubmit}
              onDeleteSubmit={onDeleteSubmit}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ForumCommentsThread({
  postId,
  initialComments = [],
}: ForumCommentsThreadProps) {
  const { toast } = useToast();
  const [newCommentText, setNewCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const postIdStr = postId ? String(postId) : "";

  // 1. Get Forum Post Comments dari mock server
  const {
    data: commentDtos,
    isLoading,
    isError,
    refetch,
  } = useForumPostComments(postIdStr);

  // 2. Mutasi Create, Update, Delete Comment
  const createCommentMutation = useCreateForumComment();
  const updateCommentMutation = useUpdateForumComment();
  const deleteCommentMutation = useDeleteForumComment();

  // Susun data komentar berstruktur pohon (tree) jika data dari API tersedia
  const comments: ForumComment[] = commentDtos
    ? buildForumCommentTree(commentDtos)
    : initialComments;

  const totalComments = commentDtos ? commentDtos.length : comments.length;

  // Handler Buat Komentar Utama
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = newCommentText.trim();
    if (!content || isSubmitting) return;

    if (!postIdStr) {
      toast.error("ID postingan tidak ditemukan.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createCommentMutation.mutateAsync({
        postId: postIdStr,
        payload: { content },
      });
      setNewCommentText("");
      toast.success("Komentar berhasil dikirim!");
    } catch {
      toast.error("Gagal mengirim komentar. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler Balas Komentar (Nested Reply)
  const handleReplySubmit = async (parentId: string | number, text: string) => {
    const content = text.trim();
    if (!content) return;

    if (!postIdStr) {
      toast.error("ID postingan tidak ditemukan.");
      return;
    }

    try {
      await createCommentMutation.mutateAsync({
        postId: postIdStr,
        payload: { content, parentId: String(parentId) },
      });
      toast.success("Balasan berhasil dikirim!");
    } catch {
      toast.error("Gagal mengirim balasan. Silakan coba lagi.");
    }
  };

  // Handler Sunting Komentar (Update Comment)
  const handleEditSubmit = async (
    commentId: string | number,
    text: string
  ) => {
    const content = text.trim();
    if (!content) return;

    if (!postIdStr) {
      toast.error("ID postingan tidak ditemukan.");
      return;
    }

    try {
      await updateCommentMutation.mutateAsync({
        postId: postIdStr,
        commentId: String(commentId),
        payload: { content },
      });
      toast.success("Komentar berhasil diperbarui!");
    } catch {
      toast.error("Gagal memperbarui komentar. Silakan coba lagi.");
    }
  };

  // Handler Hapus Komentar (Delete Comment)
  const handleDeleteSubmit = async (commentId: string | number) => {
    if (!postIdStr) {
      toast.error("ID postingan tidak ditemukan.");
      return;
    }

    try {
      await deleteCommentMutation.mutateAsync({
        postId: postIdStr,
        commentId: String(commentId),
      });
      toast.success("Komentar berhasil dihapus!");
    } catch {
      toast.error("Gagal menghapus komentar. Silakan coba lagi.");
    }
  };

  return (
    <section id="komentar" className="mt-10 flex flex-col w-full">
      <h3 className="font-sans text-[16px] font-bold uppercase text-[var(--primary-text)] tracking-wider mb-4">
        Tanggapan & Diskusi ({totalComments})
      </h3>

      {/* Input komentar baru */}
      <form onSubmit={handleAddComment} className="flex flex-col gap-2.5 mb-6">
        <textarea
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder="Tulis tanggapan atau komentar Anda..."
          rows={3}
          disabled={isSubmitting}
          className="w-full text-sm p-3.5 rounded-lg border border-[var(--dust)] bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--foreground)] resize-none"
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!newCommentText.trim() || isSubmitting}
            className="h-8 px-4 text-xs font-semibold bg-[var(--foreground)] hover:bg-[var(--foreground)]/90 text-white rounded-md cursor-pointer disabled:opacity-40"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                Mengirim...
              </>
            ) : (
              "Kirim Komentar"
            )}
          </Button>
        </div>
      </form>

      {/* Daftar komentar / Status pemuatan */}
      <div className="flex flex-col">
        {postIdStr && isLoading ? (
          <div className="flex flex-col gap-4 py-4 animate-pulse">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-[3px] bg-[var(--dust)]/40" />
              <div className="h-4 w-32 bg-[var(--dust)]/40 rounded" />
              <div className="h-3 w-20 bg-[var(--dust)]/30 rounded" />
            </div>
            <div className="h-4 w-full bg-[var(--dust)]/30 rounded pl-8" />
            <div className="h-4 w-4/5 bg-[var(--dust)]/30 rounded pl-8" />
          </div>
        ) : postIdStr && isError ? (
          <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed rounded-xl border-[var(--dust)] my-4">
            <p className="text-xs text-[var(--foreground)] font-medium mb-2">
              Gagal memuat komentar forum.
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="px-3 py-1 text-xs font-semibold text-[var(--primary-text)] border border-[var(--dust)] rounded-md hover:bg-[var(--background-accent)] cursor-pointer"
            >
              Coba Lagi
            </button>
          </div>
        ) : comments.length === 0 ? (
          <p className="py-8 text-center text-xs text-[var(--muted)]">
            Belum ada tanggapan. Jadilah yang pertama memulai diskusi!
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postIdStr}
              onReplySubmit={handleReplySubmit}
              onEditSubmit={handleEditSubmit}
              onDeleteSubmit={handleDeleteSubmit}
            />
          ))
        )}
      </div>
    </section>
  );
}
