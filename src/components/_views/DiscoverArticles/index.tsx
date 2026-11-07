"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, PenLine, Heart, MessageCircle, Bookmark } from "lucide-react";

const WRITE_ROUTE = "/editor-studio";

type ArticleItem = {
  id: number;
  category: string;
  author: string;
  date: string;
  title: string;
  description: string;
  likes: string;
  comments: string;
  image: string;
};

const articles: ArticleItem[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  category: "Software Engineering",
  author: "Rifky Muhammad Prayudhi",
  date: "12 September 2026",
  title: "Apakah C4 akan menggantikan Diagram Conventional saat ini?",
  description:
    "You're going to see these in someone's toolkit next year and wonder why you didn't hear about them first.",
  likes: "16,2k",
  comments: "16,2k",
  image: "/images/repost-cover.png",
}));

export default function DiscoverArticles() {
  const [query, setQuery] = useState("");

  const filtered = articles.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex w-full flex-col gap-8 py-2">
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari Judul Artikel Yang Cocok..."
            className="w-full rounded-full border border-[var(--dust)]/60 bg-transparent py-2.5 pl-5 pr-11 text-sm outline-none placeholder:text-gray-400 focus:border-red-600"
          />
          <Search className="absolute right-4 top-1/2 size-4 -translate-y-1/2 text-red-600" />
        </div>

        <Link
          href={WRITE_ROUTE}
          className="flex shrink-0 items-center gap-2 rounded-md bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
        >
          <PenLine className="size-4" />
          Tulis Artikel
        </Link>
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-gray-500">
          Artikel tidak ditemukan.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
          {filtered.map((a) => (
            <article
              key={a.id}
              className="flex flex-col gap-3 rounded-lg bg-white p-3 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="size-3.5 shrink-0 rounded-sm bg-red-600" />
                  <p className="truncate text-[10px] text-red-600">
                    In {a.category} by {a.author} · {a.date}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Simpan artikel"
                  className="shrink-0 text-red-600"
                >
                  <Bookmark className="size-4" />
                </button>
              </div>

              <div className="flex gap-4">
                <Image
                  src={a.image}
                  alt={a.title}
                  width={112}
                  height={112}
                  className="size-28 shrink-0 rounded-lg object-cover"
                />

                <div className="flex min-w-0 flex-1 flex-col">
                  <h3 className="line-clamp-2 text-sm font-bold leading-snug">
                    {a.title}
                  </h3>
                  <p className="mt-1 line-clamp-3 text-xs text-gray-600">
                    {a.description}
                  </p>

                  <div className="mt-auto flex items-center gap-4 pt-2 text-[10px] font-medium text-gray-700">
                    <span className="flex items-center gap-1">
                      <Heart className="size-3 text-red-600" />
                      {a.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="size-3 text-red-600" />
                      {a.comments}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}