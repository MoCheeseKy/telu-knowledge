"use client";

import ArticleCardProps from "./_types";
import { ThumbsUp, MessageSquareMore, Repeat2, Bookmark, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ArticleCard({
    topic = "Software Engineering",
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
    isLiked = true,
    isBookmarked = true,
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

                <div className="font-sans text-sm leading-none text-[var(--foreground)]">
                    <span>In </span>
                    <span className="text-[var(--primary-text)] font-semibold">
                        {topic ? topic : ""}
                    </span>
                    <span> by </span>
                    <span className="text-[var(--primary-text)] font-semibold">
                        {publisher ? publisher : ""}
                    </span>
                    <span>, </span>
                    <span>{postDate ? postDate : ""}</span>
                </div>
            </div>

            <div className="flex items-start justify-between gap-[32px] mt-2.5">
                <div className="flex-1 flex flex-col gap-2">
                    <h2 className="font-newsreader font-medium text-[32px] tracking-[0.25px] leading-tight text-[var(--foreground)] group-hover:text-[var(--primary-text)] transition-colors">
                        {title}
                    </h2>
                    <p className="font-sans font-normal text-[16px] tracking-[0.25px] leading-relaxed text-[#2B2725] line-clamp-3">
                        {description}
                    </p>
                </div>

                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={imageAlt || title}
                        className="w-[160px] h-[107px] min-w-[160px] max-w-[160px] rounded-xl object-cover shrink-0 bg-[var(--background-accent)]"
                    />
                ) : (
                    <div className="w-[160px] h-[107px] min-w-[160px] max-w-[160px] rounded-xl bg-gradient-to-br from-[var(--primary)] via-[#B42318] to-black shrink-0 flex items-center justify-center p-3 text-white text-xs font-newsreader italic text-center">
                        {title.slice(0, 30)}...
                    </div>
                )}
            </div>

            <div className="mt-4 flex items-center justify-between w-full max-w-[487px]">
                <div className="flex items-center gap-1 sm:gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 py-1 gap-1.5 hover:bg-[var(--background-accent)] rounded-md text-[var(--foreground)] [&_svg]:size-3.5"
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
                        <span className="font-sans text-sm font-bold">
                            {likesCount ? likesCount : 0}
                        </span>
                    </Button>

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
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 py-1 gap-1.5 hover:bg-[var(--background-accent)] rounded-md text-[var(--foreground)] [&_svg]:size-3.5"
                        aria-label="Repost"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Repeat2 className="text-[var(--primary-text)]" />
                        <span className="font-sans text-sm font-bold">
                            {repostsCount ? repostsCount : 0}
                        </span>
                    </Button>

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
