"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MyCommunityItem } from "./my-forums.types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MyForumCardProps {
  item: MyCommunityItem;
  onToggleFollow: (id: string | number) => void;
}

export default function MyForumCard({ item, onToggleFollow }: MyForumCardProps) {
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);

  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-[var(--dust)]/40 w-full group">
      <div className="flex items-start gap-3 min-w-0 flex-1">
        {/* Avatar */}
        <div
          className={cn(
            "w-8 h-8 rounded-[3px] flex items-center justify-center font-bold text-white text-sm shrink-0",
            item.avatarColor || "bg-[var(--primary)]"
          )}
        >
          {item.avatarInitial}
        </div>

        {/* Info */}
        <div className="flex flex-col min-w-0 flex-1 gap-0.5">
          <div className="flex items-center gap-2">
            <Link
              href={`/discussion-forums?community=${encodeURIComponent(item.name)}`}
              className="font-sans text-[16px] font-bold text-[var(--foreground)] group-hover:text-[var(--primary-text)] transition-colors truncate"
            >
              {item.name}
            </Link>

            {item.role !== "Anggota" && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--background-accent)] text-[var(--muted)] font-medium shrink-0">
                {item.role === "Pembuat" ? "Pemilik" : "Moderator"}
              </span>
            )}
          </div>

          <p className="font-sans text-[14px] font-normal text-[var(--muted)] truncate">
            {item.description}
          </p>
          <span className="font-sans text-[12px] font-normal text-[var(--muted)]">
            {item.membersCount} • {item.discussionsCount}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="shrink-0">
        {item.role !== "Anggota" ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-7 px-3 text-xs font-semibold rounded-md border border-[var(--dust)] text-[var(--foreground)] hover:bg-[var(--background-accent)] cursor-pointer"
            onClick={() => alert(`Pengaturan komunitas ${item.name}`)}
          >
            Kelola
          </Button>
        ) : showConfirmLeave ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                onToggleFollow(item.id);
                setShowConfirmLeave(false);
              }}
              className="h-7 px-2.5 text-[11px] font-semibold bg-[var(--failed)] text-white rounded-md hover:opacity-90 transition-opacity cursor-pointer"
            >
              Keluar?
            </button>
            <button
              type="button"
              onClick={() => setShowConfirmLeave(false)}
              className="h-7 px-2 text-[11px] text-[var(--muted)] hover:text-[var(--foreground)] cursor-pointer"
            >
              Batal
            </button>
          </div>
        ) : (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setShowConfirmLeave(true)}
            className="h-7 px-3 text-xs font-semibold rounded-md border border-[var(--dust)] text-[var(--foreground)] hover:bg-[var(--background-accent)] cursor-pointer"
          >
            Mengikuti
          </Button>
        )}
      </div>
    </div>
  );
}
