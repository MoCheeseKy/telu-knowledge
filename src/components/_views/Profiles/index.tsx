"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import RepostCard, { RepostItem } from "./RepostCard";
import ProfileSidebar from "./ProfileSidebar";
import HomeTab from "./HomeTab";
import { ProfileProvider, useProfile } from "./profile.context";
import { useUserReposts } from "@/services/community-posts/community-posts.queries";
import type { UserRepostItemDto } from "@/services/community-posts/community-posts.types";

/**
 * Konversi respons server (UserRepostItemDto) ke bentuk yang dipakai
 * RepostCard (RepostItem) — supaya tampilan tab Reposts konsisten dengan
 * desain kartu yang sudah ada tanpa perlu ubah RepostCard.
 */
function mapRepostToItem(r: UserRepostItemDto): RepostItem {
  const p = r.post;
  return {
    id: p.id,
    category: p.communityName ?? "Forum",
    author: p.author.displayName,
    date: new Date(r.repostedAt).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    title: p.title,
    description: (p.content ?? "").slice(0, 200),
    likes: String(p.likesCount ?? 0),
    comments: String(p.commentsCount ?? 0),
    reposts: String(p.repostsCount ?? 0),
    image: p.coverImageUrl ?? "/images/repost-cover.png",
  };
}

function RepostsTab() {
  const { data, isLoading, isError } = useUserReposts("me");

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 py-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-40 w-full rounded-xl bg-[var(--dust)]/30"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-10 text-center">
        <p className="font-sans text-sm font-semibold text-[var(--foreground)]">
          Gagal memuat repost
        </p>
        <p className="mt-1 font-sans text-[13px] text-[var(--muted)]">
          Pastikan mock server berjalan, lalu coba lagi.
        </p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="font-sans text-sm font-semibold text-[var(--foreground)]">
          Belum ada repost
        </p>
        <p className="mt-1 font-sans text-[13px] text-[var(--muted)]">
          Postingan forum yang kamu repost akan muncul di sini.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-6">
      {data.map((r) => (
        <RepostCard key={r.repostId} item={mapRepostToItem(r)} />
      ))}
    </div>
  );
}

function ProfilesContent() {
  const { profile, isLoading, isError, refetchProfile } = useProfile();

  if (isLoading) {
    return (
      <div
        className="flex flex-col gap-8 lg:flex-row py-4"
        aria-busy="true"
        aria-live="polite"
      >
        <div className="min-w-0 flex-1 animate-pulse">
          <div className="h-10 w-64 bg-[var(--dust)]/40 rounded mb-6" />
          <div className="h-9 w-full bg-[var(--dust)]/30 rounded mb-6" />
          <div className="h-40 w-full bg-[var(--dust)]/30 rounded-xl" />
        </div>
        <div className="w-full lg:w-72 shrink-0 animate-pulse">
          <div className="size-20 rounded-full bg-[var(--dust)]/40 mb-4" />
          <div className="h-5 w-40 bg-[var(--dust)]/40 rounded mb-2" />
          <div className="h-4 w-28 bg-[var(--dust)]/30 rounded mb-3" />
          <div className="h-16 w-full bg-[var(--dust)]/30 rounded-lg" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[320px] w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[var(--dust)]/70 py-10 text-center">
        <p className="font-sans text-sm font-semibold text-[var(--foreground)]">
          Gagal memuat profil
        </p>
        <p className="font-sans text-[13px] text-[var(--muted)]">
          Pastikan mock server berjalan, lalu coba lagi.
        </p>
        <button
          type="button"
          onClick={refetchProfile}
          className="mt-2 inline-flex h-9 items-center rounded-lg border border-[var(--dust)] px-4 font-sans text-[13px] font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--background-accent)] cursor-pointer"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 lg:flex-row py-4">
      <section className="min-w-0 flex-1">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--foreground)] tracking-tight">
            {profile.fullName || profile.username}
          </h1>
        </div>

        <Tabs defaultValue="home" className="w-full">
          <TabsList
            variant="line"
            className="bg-transparent border-b border-[var(--dust)]/60 rounded-none w-full justify-start h-auto p-0 gap-6"
          >
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="reposts">Reposts</TabsTrigger>
          </TabsList>

          <TabsContent value="home">
            <HomeTab />
          </TabsContent>

          <TabsContent value="reposts">
            <RepostsTab />
          </TabsContent>
        </Tabs>
      </section>

      <ProfileSidebar />
    </div>
  );
}

export default function Profiles() {
  return (
    <ProfileProvider>
      <ProfilesContent />
    </ProfileProvider>
  );
}