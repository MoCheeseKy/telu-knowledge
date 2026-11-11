"use client";

import { Plus } from "lucide-react";
import MyArticleListCard from "./MyArticleListCard";
import { dummyMyLists, MyArticleListProps } from "./_types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function MyArticleList({
    items = dummyMyLists,
    className = "",
}: MyArticleListProps) {
    return (
        <section className={cn("flex flex-col w-full", className)}>
            <div className="flex items-center justify-between gap-3 mb-5">
                <h3 className="font-sans text-[19px] font-bold text-[var(--foreground)] leading-none">
                    Daftar List Kamu
                </h3>

                <Button
                    type="button"
                    onClick={()=>''}
                    className="h-8 shrink-0 gap-1.5 rounded-full bg-[var(--foreground)] px-4 text-[13px] font-semibold text-white shadow-none hover:bg-[var(--foreground)]/90 [&_svg]:size-4"
                >
                    <Plus strokeWidth={2.5} />
                    List Baru
                </Button>
            </div>

            <div className="flex flex-col gap-3.5">
                {items.map((item, index) => (
                    <MyArticleListCard
                        key={item.id ?? `${item.title}-${index}`}
                        ownerName={item.ownerName}
                        ownerAvatarUrl={item.ownerAvatarUrl}
                        title={item.title}
                        storiesCount={item.storiesCount}
                        isPrivate={item.isPrivate}
                        coverUrl={item.coverUrl}
                        coverAlt={item.coverAlt}
                        href={item.href ?? ''}
                    />
                ))}
            </div>
        </section>
    );
}
