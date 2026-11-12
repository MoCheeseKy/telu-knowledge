"use client";

import { useRouter } from "next/navigation";
import ForumPostCardProps from "./_types";
import { ThumbsUp, MessageSquareMore, Repeat2, Share2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    useForumPostRepostStatus,
    useToggleForumPostRepost,
} from "@/services/community-posts/community-posts.queries";

const actionButtonClass =
    "h-7 px-2 py-1 gap-1.5 hover:bg-[var(--background-accent)] rounded-md text-[var(--foreground)] [&_svg]:size-4";

export default function ForumPostCard({
    id = 1,
    topic,
    publisher,
    postDate,
    avatarUrl,
    title,
    description,
    imageUrl,
    imageAlt,
    likesCount = 0,
    commentsCount = 0,
    repostsCount = 0,
    isLiked = false,
    className = "",
    onClick,
    editHref,
    deleteAction,
}: ForumPostCardProps) {
    const router = useRouter();

    const handleCardClick = () => {
        if (onClick) {
            onClick();
        } else {
            router.push(`/discussion-forums/${id}`);
        }
    };

    return (
        <article
            onClick={handleCardClick}
            className={cn(
                "w-full max-w-[679px] flex flex-col select-none cursor-pointer group",
                className
            )}
        >
            {/* Meta: From {forum} by {penulis}, {tanggal} */}
            <div className="flex items-center gap-2">
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt={publisher}
                        className="w-6 h-6 rounded-[3px] object-cover shrink-0"
                    />
                ) : (
                    <div
                        aria-hidden="true"
                        className="w-6 h-6 bg-[var(--primary)] rounded-[3px] shrink-0"
                    />
                )}

                <p className="font-sans text-[11px] leading-none text-[var(--foreground)]">
                    <span>From </span>
                    <span className="text-[var(--primary-text)] font-semibold">{topic}</span>
                    <span> by </span>
                    <span className="text-[var(--primary-text)] font-semibold">{publisher}</span>
                    <span>, </span>
                    <span className="font-semibold">{postDate}</span>
                </p>
            </div>

            {/* Judul dan deskripsi */}
            <div className="mt-4 sm:mt-6 flex flex-col gap-2">
                <h2 className="font-newsreader font-normal text-[20px] sm:text-[24px] uppercase leading-tight text-[var(--foreground)] group-hover:text-[var(--primary-text)] transition-colors">
                    {title}
                </h2>
                <p className="font-sans font-normal text-[14px] sm:text-[16px] leading-relaxed text-[var(--foreground)]">
                    {description}
                </p>
            </div>

            {/* Gambar lebar penuh */}
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt={imageAlt || title}
                    className="mt-6 w-full aspect-[3/2] rounded-xl object-cover bg-[var(--background-accent)]"
                />
            )}

            {/* Aksi: suka, komentar, repost, bagikan, sunting (post milik sendiri) */}
            {/* stopPropagation di level baris: klik aksi apa pun (termasuk isi dialog
                yang dirender via portal) tidak boleh memicu navigasi klik kartu. */}
            <div
                className="mt-5 flex items-center gap-1 sm:gap-2"
                onClick={(e) => e.stopPropagation()}
            >
                {editHref && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={actionButtonClass}
                        aria-label="Sunting postingan"
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(editHref);
                        }}
                    >
                        <Pencil />
                        <span className="font-sans text-xs font-bold">Sunting</span>
                    </Button>
                )}

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={actionButtonClass}
                    aria-label="Suka"
                    onClick={(e) => e.stopPropagation()}
                >
                    <ThumbsUp
                        className={cn(
                            "transition-colors",
                            isLiked
                                ? "fill-[var(--primary-text)] text-[var(--primary-text)]"
                                : "text-[var(--foreground)]"
                        )}
                    />
                    <span className="font-sans text-xs font-bold">{likesCount}</span>
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={actionButtonClass}
                    aria-label="Komentar"
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/discussion-forums/${id}#komentar`);
                    }}
                >
                    <MessageSquareMore />
                    <span className="font-sans text-xs font-bold">{commentsCount}</span>
                </Button>

                <RepostButton
                    postId={String(id)}
                    initialCount={repostsCount}
                />

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-[var(--background-accent)] rounded-md text-[var(--foreground)] [&_svg]:size-4"
                    aria-label="Bagikan"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (typeof window !== "undefined") {
                            navigator.clipboard.writeText(
                                `${window.location.origin}/discussion-forums/${id}`
                            );
                        }
                    }}
                >
                    <Share2 />
                </Button>

                {deleteAction}
            </div>
        </article>
    );
}

/**
 * Tombol repost dengan status per-viewer.
 *
 * - Saat belum repost: icon Repeat2 outline, angka = repostsCount.
 * - Saat sudah repost: icon Repeat2 solid (fill), angka + icon berwarna
 *   --primary-text, tombol disabled selama mutasi berjalan.
 * - Perubahan state & count instan lewat optimistic update di hook
 *   useToggleForumPostRepost; status dari server diambil via
 *   useForumPostRepostStatus sebagai sumber kebenaran.
 */
function RepostButton({
    postId,
    initialCount,
}: {
    postId: string;
    initialCount: number;
}) {
    const { data: status } = useForumPostRepostStatus(postId);
    const { mutate, isPending } = useToggleForumPostRepost(postId);

    const isReposted = status?.isReposted ?? false;
    const count = status?.repostsCount ?? initialCount;

    return (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
                actionButtonClass,
                isReposted && "text-[var(--primary-text)]"
            )}
            aria-label={isReposted ? "Batalkan repost" : "Repost"}
            aria-pressed={isReposted}
            disabled={isPending}
            onClick={(e) => {
                e.stopPropagation();
                mutate();
            }}
        >
            <Repeat2
                className={cn(
                    "transition-colors",
                    isReposted
                        ? "fill-[var(--primary-text)] text-[var(--primary-text)]"
                        : "text-[var(--primary-text)]"
                )}
            />
            <span className="font-sans text-xs font-bold">{count}</span>
        </Button>
    );
}