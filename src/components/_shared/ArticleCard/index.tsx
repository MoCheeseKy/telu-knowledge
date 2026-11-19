"use client";
import { useState } from "react";
import { useToast } from "@/components/ui/toast";
import { useToggleArticleRepost } from "@/services/articles/article-reposts.queries";
import { getErrorMessage } from "@/lib/api/error-messages";
import { ThumbsUp, MessageSquareMore, Repeat2, Bookmark, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type ArticleCardProps from "./article-card.types";
import { useToggleArticleLike } from "@/services/articles/articles.queries";
/**
 * Kartu artikel yang menampilkan info penulis, judul, ringkasan, gambar, dan metrik interaksi.
 */
export default function ArticleCard({
    id,
    publisher = "Rifky Muhammad Prayudhi",
    postDate = "12 Sep 2026",
    avatarUrl,
    title = "Apakah C4 akan menggantikan Diagram Conventional saat ini?",
    description = "You're going to see these in someone's toolkit next year and wonder why you didn't hear about them first. Here's your head start.",
    imageUrl,
    imageAlt,
    likesCount = "16,2k",
    commentsCount = "16,2k",
    repostsCount = "16,2k",
    isLiked = false,
    isBookmarked = true,
    isReposted = false,
    className = "",
    onClick,
}: ArticleCardProps) {
    return (
        <article
            onClick={onClick}
            className={cn(
                "w-full max-w-[679px] flex flex-col select-none cursor-pointer group",
                className
            )}
        >
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

                <div className="font-sans text-xs sm:text-sm leading-snug text-[var(--foreground)] min-w-0">
                    <span className="text-[var(--primary-text)] font-semibold">
                        {publisher ? publisher : ""}
                    </span>
                    <span>, </span>
                    <span>{postDate ? postDate : ""}</span>
                </div>
            </div>

            <div className="flex items-start justify-between gap-4 sm:gap-6 md:gap-[32px] mt-2.5">
                <div className="flex-1 min-w-0 flex flex-col gap-1.5 sm:gap-2">
                    <h2 className="font-newsreader font-medium text-[20px] sm:text-[26px] md:text-[32px] tracking-[0.25px] leading-tight text-[var(--foreground)] group-hover:text-[var(--primary-text)] transition-colors">
                        {title}
                    </h2>
                    <p className="font-sans font-normal text-[14px] sm:text-[16px] tracking-[0.25px] leading-relaxed text-[#2B2725] line-clamp-2 sm:line-clamp-3">
                        {description}
                    </p>
                </div>

                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={imageAlt || title}
                        className="w-[100px] h-[72px] sm:w-[140px] sm:h-[96px] md:w-[160px] md:h-[107px] rounded-lg sm:rounded-xl object-cover shrink-0 bg-[var(--background-accent)]"
                    />
                ) : (
                    <div className="w-[100px] h-[72px] sm:w-[140px] sm:h-[96px] md:w-[160px] md:h-[107px] rounded-lg sm:rounded-xl bg-gradient-to-br from-[var(--primary)] via-[#B42318] to-black shrink-0 flex items-center justify-center p-2 sm:p-3 text-white text-[10px] sm:text-xs font-newsreader italic text-center">
                        {title.slice(0, 30)}...
                    </div>
                )}
            </div>

            <div className="mt-4 flex items-center justify-between w-full sm:max-w-[487px]">
                <div className="flex items-center gap-1 sm:gap-2">
                    <LikeButton
                        articleId={id !== undefined ? String(id) : undefined}
                        initialLiked={isLiked}
                        initialCount={likesCount ? likesCount : 0}
                    />

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 py-1 gap-1.5 hover:bg-[var(--background-accent)] rounded-md text-[var(--foreground)] [&_svg]:size-3.5"
                        aria-label="Komentar"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <MessageSquareMore className="text-[var(--foreground)]" />
                        <span className="font-sans text-sm font-bold">
                            {commentsCount ? commentsCount : 0}
                        </span>
                    </Button>
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                    <RepostButton
                        articleId={id ? String(id) : undefined}
                        initialReposted={isReposted}
                        initialCount={repostsCount}
                    />

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:bg-[var(--background-accent)] rounded-md [&_svg]:size-3.5"
                        aria-label="Simpan Artikel"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Bookmark
                            className={cn(
                                "transition-colors",
                                isBookmarked
                                    ? "fill-[var(--primary-text)] text-[var(--primary-text)]"
                                    : "text-[var(--foreground)]"
                            )}
                        />
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:bg-[var(--background-accent)] rounded-md text-[var(--foreground)] [&_svg]:size-3.5"
                        aria-label="Bagikan Artikel"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Share2 />
                    </Button>
                </div>
            </div>
        </article>
    );
}

/**
 * Tombol repost artikel. Ikon berubah instan, angka disinkronkan dari respons
 * server. Bila gagal, tampilan kembali ke status awal.
 */
function RepostButton({
    articleId,
    initialReposted,
    initialCount,
}: {
    articleId?: string;
    initialReposted: boolean;
    initialCount: string | number;
}) {
    const { toast } = useToast();
    const { mutate, isPending } = useToggleArticleRepost();
    const [override, setOverride] = useState<{ reposted: boolean; count?: number } | null>(null);

    const reposted = override?.reposted ?? initialReposted;
    const shownCount =
        override?.count !== undefined
            ? override.count.toLocaleString("id-ID")
            : initialCount;

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!articleId || isPending) return;
        setOverride({ reposted: !reposted });

        mutate(articleId, {
            onSuccess: (res) =>
                setOverride({ reposted: res.data.isReposted, count: res.data.repostsCount }),
            onError: (err) => {
                setOverride(null);
                toast.error(getErrorMessage(err, "Gagal memperbarui repost artikel."));
            },
        });
    };

    return (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
                "h-7 px-2 py-1 gap-1.5 hover:bg-[var(--background-accent)] rounded-md [&_svg]:size-3.5",
                reposted
                    ? "text-[var(--primary-text)]"
                    : "text-[var(--foreground)]"
            )}
            aria-label={reposted ? "Batalkan repost" : "Repost"}
            aria-pressed={reposted}
            disabled={isPending}
            onClick={handleClick}
        >
            <Repeat2
                className={cn(
                    "transition-colors",
                    reposted
                        ? "text-[var(--primary-text)]"
                        : "text-[var(--foreground)]"
                )}
            />
            <span className="font-sans text-sm font-bold">{shownCount}</span>
        </Button>
    );
}

/**
 * Tombol suka artikel. Ikon berubah instan, angka disinkronkan dari respons
 * server. Bila gagal, tampilan kembali ke status awal.
 */
function LikeButton({
    articleId,
    initialLiked,
    initialCount,
}: {
    articleId?: string;
    initialLiked: boolean;
    initialCount: string | number;
}) {
    const { toast } = useToast();
    const { mutate, isPending } = useToggleArticleLike();
    const [override, setOverride] = useState<{ liked: boolean; count?: number } | null>(null);

    const liked = override?.liked ?? initialLiked;
    const shownCount =
        override?.count !== undefined
            ? override.count.toLocaleString("id-ID")
            : initialCount;

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!articleId || isPending) return;
        setOverride({ liked: !liked });

        mutate(articleId, {
            onSuccess: (res) =>
                setOverride({ liked: res.data.isLiked, count: res.data.likesCount }),
            onError: (err) => {
                setOverride(null);
                toast.error(getErrorMessage(err, "Gagal memperbarui suka artikel."));
            },
        });
    };

    return (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
                "h-7 px-2 py-1 gap-1.5 hover:bg-[var(--background-accent)] rounded-md [&_svg]:size-3.5",
                liked ? "text-[var(--primary-text)]" : "text-[var(--foreground)]"
            )}
            aria-label={liked ? "Batal suka" : "Suka"}
            aria-pressed={liked}
            disabled={isPending}
            onClick={handleClick}
        >
            <ThumbsUp
                className={cn(
                    "transition-colors",
                    liked
                        ? "fill-[var(--primary-text)] text-[var(--primary-text)]"
                        : "text-[var(--foreground)]"
                )}
            />
            <span className="font-sans text-sm font-bold">{shownCount}</span>
        </Button>
    );
}