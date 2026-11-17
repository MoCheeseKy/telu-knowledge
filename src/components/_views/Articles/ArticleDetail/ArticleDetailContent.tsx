"use client";

import React from "react";
import TiptapRenderer from "./TiptapRenderer";
import type { ArticleDetailContentProps } from "./article-detail.types";

/**
 * Menampilkan konten utama artikel mencakup judul, subjudul, gambar sampul, dan isi dokumen Tiptap.
 */
export default function ArticleDetailContent({
  article,
}: ArticleDetailContentProps) {
  return (
    <article className="flex flex-col w-full mt-2">
      <h1 className="font-newsreader font-medium text-[30px] sm:text-[36px] md:text-[40px] tracking-[0.2px] leading-tight text-[var(--foreground)]">
        {article.title}
      </h1>

      {article.subtitle && (
        <p className="font-sans text-[15px] sm:text-[17px] text-[var(--muted)] leading-relaxed mt-2.5">
          {article.subtitle}
        </p>
      )}

      {article.coverImageUrl && (
        <div className="my-6 w-full">
          <img
            src={article.coverImageUrl}
            alt={article.title}
            className="w-full max-h-[440px] rounded-xl sm:rounded-2xl object-cover bg-[var(--background-accent)] shadow-xs"
          />
        </div>
      )}

      <div className="mt-4 w-full">
        <TiptapRenderer content={article.content} />
      </div>
    </article>
  );
}

