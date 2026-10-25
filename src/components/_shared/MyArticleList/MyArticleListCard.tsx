"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { MyArticleListCardProps, dummyMyLists } from "./_types";
import { cn } from "@/lib/utils";

export { dummyMyLists };

export default function MyArticleListCard({
    ownerName,
    ownerAvatarUrl,
    title,
    storiesCount,
    isPrivate,
    coverUrl,
    coverAlt,
    href = '',
    onClick,
    className,
}: MyArticleListCardProps) {
    const isInteractive = Boolean(href || onClick);

    const content = (
        <>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex min-w-0 items-center gap-2">
                    {ownerAvatarUrl ? (
                        <img
                            src={ownerAvatarUrl}
                            alt={ownerName}
                            className="w-7 h-7 rounded-full object-cover shrink-0"
                        />
                    ) : (
                        <div
                            aria-hidden="true"
                            className="w-7 h-7 rounded-full bg-[#1B57D6] shrink-0 flex items-center justify-center text-white font-sans text-[12px] font-bold uppercase"
                        >
                            {ownerName.charAt(0)}
                        </div>
                    )}
                    <span className="font-sans text-[14px] font-semibold text-[var(--foreground)] truncate">
                        {ownerName}
                    </span>
                </div>

                <h4 className="font-sans text-[19px] font-bold leading-snug tracking-[0.1px] text-[var(--foreground)] line-clamp-2 transition-colors group-hover:text-[var(--primary-text)]">
                    {title}
                </h4>

                <div className="flex items-center gap-1.5 font-sans text-[14px] font-normal text-[var(--muted)]">
                    <span>{storiesCount} Stories</span>
                    {isPrivate && (
                        <span className="flex items-center gap-1.5">
                            <span
                                aria-hidden="true"
                                className="w-1 h-1 rounded-full bg-[var(--dust)]"
                            />
                            <Lock
                                aria-hidden="true"
                                className="size-3 text-[var(--muted)]"
                            />
                            <span className="sr-only">List privat</span>
                        </span>
                    )}
                </div>
            </div>

            {coverUrl ? (
                <img
                    src={coverUrl}
                    alt={coverAlt || title}
                    className="w-[100px] h-[86px] min-w-[100px] rounded-lg object-cover shrink-0 bg-[var(--background-accent)]"
                />
            ) : (
                <div className="w-[100px] h-[86px] min-w-[100px] rounded-lg bg-gradient-to-br from-[var(--primary)] via-[#B42318] to-black shrink-0 flex items-center justify-center p-2 text-white font-newsreader text-xs italic text-center line-clamp-2">
                    {title}
                </div>
            )}
        </>
    );

    const cardClassName = cn(
        "group flex w-full items-center justify-between gap-3 rounded-xl border border-[var(--dust)]/70 bg-[var(--background)] p-5 transition-all",
        isInteractive &&
            "cursor-pointer hover:border-[var(--dust)] hover:shadow-[0_2px_12px_rgba(28,25,24,0.07)]",
        className
    );

    if (href) {
        return (
            <Link href={href} onClick={onClick} className={cardClassName}>
                {content}
            </Link>
        );
    }

    if (onClick) {
        return (
            <div
                role="button"
                tabIndex={0}
                onClick={onClick}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onClick();
                    }
                }}
                className={cardClassName}
            >
                {content}
            </div>
        );
    }

    return <div className={cardClassName}>{content}</div>;
}
