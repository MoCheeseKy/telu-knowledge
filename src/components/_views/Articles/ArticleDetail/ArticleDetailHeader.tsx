"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { ArticleDetailHeaderProps } from "./article-detail.types";

/**
 * Header bagian atas halaman detail artikel yang menyediakan tombol navigasi kembali.
 */
export default function ArticleDetailHeader({}: ArticleDetailHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col w-full mb-4">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--muted)] hover:text-[var(--primary-text)] transition-colors w-fit cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali</span>
      </button>
    </div>
  );
}
