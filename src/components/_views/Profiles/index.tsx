"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import RepostCard, { RepostItem } from "./RepostCard";
import ProfileSidebar from "./ProfileSidebar";
import HomeTab from "./HomeTab";
import { ProfileProvider, useProfile } from "./profile.context";

const reposts: RepostItem[] = [
  {
    id: 1,
    category: "Software Engineering",
    author: "Rifky Muhammad Prayudhi",
    date: "12 September 2026",
    title: "Apakah C4 akan menggantikan Diagram Conventional saat ini?",
    description:
      "You're going to see these in someone's toolkit next year and wonder why you didn't hear about them first. Here's your head start.",
    likes: "16,2k",
    comments: "16,2k",
    reposts: "16,2k",
    image: "/images/repost-cover.png",
  },
  {
    id: 2,
    category: "Software Engineering",
    author: "Rifky Muhammad Prayudhi",
    date: "12 September 2026",
    title: "Apakah C4 akan menggantikan Diagram Conventional saat ini?",
    description:
      "You're going to see these in someone's toolkit next year and wonder why you didn't hear about them first. Here's your head start.",
    likes: "16,2k",
    comments: "16,2k",
    reposts: "16,2k",
    image: "/images/repost-cover.png",
  },
  {
    id: 3,
    category: "Software Engineering",
    author: "Rifky Muhammad Prayudhi",
    date: "12 September 2026",
    title: "Apakah C4 akan menggantikan Diagram Conventional saat ini?",
    description:
      "You're going to see these in someone's toolkit next year and wonder why you didn't hear about them first. Here's your head start.",
    likes: "16,2k",
    comments: "16,2k",
    reposts: "16,2k",
    image: "/images/repost-cover.png",
  },
];

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
            <div className="flex flex-col gap-6 py-6">
              {reposts.map((item) => (
                <RepostCard key={item.id} item={item} />
              ))}
            </div>
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
