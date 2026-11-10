"use client";

import ForumPostCardProps from "./_types";
import { ThumbsUp, MessageSquareMore, Repeat2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const actionButtonClass =
    "h-7 px-2 py-1 gap-1.5 hover:bg-[var(--background-accent)] rounded-md text-[var(--foreground)] [&_svg]:size-4";

export default function ForumPostCard({
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
}: ForumPostCardProps) {
    return (
        <article
            onClick={onClick}
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
            <div className="mt-6 flex flex-col gap-2">
                <h2 className="font-newsreader font-normal text-[24px] uppercase leading-tight text-[var(--foreground)] group-hover:text-[var(--primary-text)] transition-colors">
                    {title}
                </h2>
                <p className="font-sans font-normal text-[16px] leading-relaxed text-[var(--foreground)]">
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

            {/* Aksi: suka, komentar, repost, bagikan */}
            <div className="mt-5 flex items-center gap-1 sm:gap-2">
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
                    onClick={(e) => e.stopPropagation()}
                >
                    <MessageSquareMore />
                    <span className="font-sans text-xs font-bold">{commentsCount}</span>
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={actionButtonClass}
                    aria-label="Repost"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Repeat2 className="text-[var(--primary-text)]" />
                    <span className="font-sans text-xs font-bold">{repostsCount}</span>
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-[var(--background-accent)] rounded-md text-[var(--foreground)] [&_svg]:size-4"
                    aria-label="Bagikan"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Share2 />
                </Button>
            </div>
        </article>
    );
}