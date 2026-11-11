"use client";

import React from "react";
import { ForumPostDetail } from "./types";

interface ForumDetailContentProps {
  post: ForumPostDetail;
}

export default function ForumDetailContent({ post }: ForumDetailContentProps) {
  return (
    <article className="flex flex-col w-full">
      {/* Judul artikel diskusi - font Newsreader, medium, 32px, clean sentence case */}
      <h1 className="font-newsreader font-medium text-[28px] sm:text-[32px] tracking-[0.25px] leading-tight text-[var(--foreground)] mt-4">
        {post.title}
      </h1>

      {/* Gambar lebar penuh - konsisten dengan ForumPostCard (aspect-[3/2] rounded-xl) */}
      {post.imageUrl && (
        <div className="mt-6 flex flex-col gap-2">
          <img
            src={post.imageUrl}
            alt={post.imageAlt || post.title}
            className="w-full aspect-[3/2] rounded-xl object-cover bg-[var(--background-accent)]"
          />
          {post.imageCaption && (
            <p className="text-[12px] text-[var(--muted)] text-center italic">
              {post.imageCaption}
            </p>
          )}
        </div>
      )}

      {/* Isi paragraf diskusi - konsisten dengan text-[#2B2725] dan font-sans */}
      <div className="mt-6 flex flex-col gap-5 font-sans font-normal text-[16px] leading-[1.8] text-[#2B2725]">
        {post.content.map((paragraph, index) => (
          <p key={index} className="whitespace-pre-line">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}

