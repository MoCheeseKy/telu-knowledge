"use client";

import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useMyFollowers, useMyFollowing } from "@/services/profiles/profiles.queries";
import type { FollowUserDto } from "@/services/profiles/profiles.types";

export type FollowTab = "followers" | "following";

interface FollowListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tab: FollowTab;
  onTabChange: (tab: FollowTab) => void;
}

function FollowList({
  users,
  isLoading,
  isError,
  emptyText,
  onRetry,
}: {
  users?: FollowUserDto[];
  isLoading: boolean;
  isError: boolean;
  emptyText: string;
  onRetry: () => void;
}) {
  const statusClass = "py-8 text-center font-sans text-[13px] text-[var(--muted)]";

  if (isLoading) return <p className={statusClass}>Memuat...</p>;
  if (isError)
    return (
      <div className={statusClass}>
        <p>Gagal memuat daftar.</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 font-semibold text-[var(--primary-text)] hover:underline cursor-pointer"
        >
          Coba lagi
        </button>
      </div>
    );
  if (!users || users.length === 0) return <p className={statusClass}>{emptyText}</p>;

  return (
    <ul className="flex flex-col divide-y divide-[var(--dust)]/40">
      {users.map((u) => (
        <li key={u.id} className="flex items-center gap-3 py-3">
          {u.avatarUrl ? (
            <img src={u.avatarUrl} alt={u.displayName} className="size-10 rounded-full object-cover shrink-0" />
          ) : (
            <div
              className="size-10 shrink-0 flex items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ backgroundColor: u.avatarColor }}
            >
              {u.displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[var(--foreground)]">{u.displayName}</p>
            {u.username && (
              <p className="truncate font-mono text-xs text-[var(--muted)]">@{u.username}</p>
            )}
            {u.bio && <p className="truncate text-[11px] text-[var(--muted)]">{u.bio}</p>}
          </div>
          {u.isFollowing && (
            <span className="shrink-0 rounded border border-[var(--dust)] px-2 py-0.5 text-[11px] font-semibold text-[var(--foreground)]">
              Mengikuti
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function FollowListDialog({
  open,
  onOpenChange,
  tab,
  onTabChange,
}: FollowListDialogProps) {
  // Query hanya jalan saat dialog terbuka dan tab-nya aktif
  const followers = useMyFollowers(open && tab === "followers");
  const following = useMyFollowing(open && tab === "following");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto p-6">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-lg font-bold font-sans">Koneksi</DialogTitle>
          <DialogDescription className="text-xs text-[var(--muted)]">
            Orang yang mengikuti kamu dan orang yang kamu ikuti.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => onTabChange(v as FollowTab)}>
          <TabsList
            variant="line"
            className="w-full justify-start gap-4 border-b border-[var(--dust)]/60 bg-transparent p-0 h-auto rounded-none"
          >
            <TabsTrigger value="followers">Pengikut</TabsTrigger>
            <TabsTrigger value="following">Mengikuti</TabsTrigger>
          </TabsList>

          <TabsContent value="followers">
            <FollowList
              users={followers.data}
              isLoading={followers.isLoading}
              isError={followers.isError}
              emptyText="Belum ada pengikut."
              onRetry={() => void followers.refetch()}
            />
          </TabsContent>
          <TabsContent value="following">
            <FollowList
              users={following.data}
              isLoading={following.isLoading}
              isError={following.isError}
              emptyText="Kamu belum mengikuti siapa pun."
              onRetry={() => void following.refetch()}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}