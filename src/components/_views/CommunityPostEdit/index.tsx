"use client";

import Link from "next/link";
import { useCommunityPost } from "@/services/community-posts/community-posts.queries";
import { MOCK_VIEWER_ID } from "@/services/community-posts/community-posts.types";
import CommunityPostCreateView from "../CommunityPostCreate";
import type { CommunityDetail } from "../CommunityDetail/types";

interface CommunityPostEditViewProps {
  community: CommunityDetail;
  postId: string;
}

export default function CommunityPostEditView({
  community,
  postId,
}: CommunityPostEditViewProps) {
  const {
    data: post,
    isLoading,
    isError,
    refetch,
  } = useCommunityPost(community.id, postId);

  if (isLoading) {
    return (
      <div className="w-full max-w-[679px] animate-pulse py-6">
        <div className="h-11 w-56 rounded-full bg-[var(--dust)]/40" />
        <div className="mt-8 h-9 w-full bg-[var(--dust)]/40 rounded" />
        <div className="mt-6 h-9 w-44 bg-[var(--dust)]/30 rounded-full" />
        <div className="mt-6 h-40 w-full bg-[var(--dust)]/30 rounded-xl" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="mt-8 flex min-h-[200px] w-full max-w-[679px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[var(--dust)]/70 text-center">
        <p className="font-sans text-sm font-semibold text-[var(--foreground)]">
          Postingan tidak ditemukan
        </p>
        <p className="font-sans text-[13px] text-[var(--muted)]">
          Postingan mungkin sudah dihapus atau tautannya tidak valid.
        </p>
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => void refetch()}
            className="inline-flex h-9 items-center rounded-lg border border-[var(--dust)] px-4 font-sans text-[13px] font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--background-accent)] cursor-pointer"
          >
            Coba lagi
          </button>
          <Link
            href={`/communities/${community.id}`}
            className="inline-flex h-9 items-center rounded-lg bg-[var(--primary)] px-4 font-sans text-[13px] font-semibold text-white transition-colors hover:bg-[var(--primary-hover)]"
          >
            Kembali ke komunitas
          </Link>
        </div>
      </div>
    );
  }

  // Kepemilikan postingan di sisi UI — konsisten dengan otorisasi mock
  // (lihat docs/integrasi-community-posts/README.md bagian "Identitas Penulis di Mock").
  // Backend asli nantinya memverifikasi lewat user token, bukan flag ini.
  if (post.authorId !== MOCK_VIEWER_ID) {
    return (
      <div className="mt-8 flex min-h-[200px] w-full max-w-[679px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[var(--dust)]/70 text-center">
        <p className="font-sans text-sm font-semibold text-[var(--foreground)]">
          Hanya penulis yang dapat menyunting postingan ini
        </p>
        <p className="font-sans text-[13px] text-[var(--muted)]">
          Postingan ini ditulis oleh {post.author.displayName}.
        </p>
        <Link
          href={`/communities/${community.id}`}
          className="mt-2 inline-flex h-9 items-center rounded-lg bg-[var(--primary)] px-4 font-sans text-[13px] font-semibold text-white transition-colors hover:bg-[var(--primary-hover)]"
        >
          Kembali ke komunitas
        </Link>
      </div>
    );
  }

  return (
    <CommunityPostCreateView
      community={community}
      mode="edit"
      initialPost={post}
    />
  );
}
