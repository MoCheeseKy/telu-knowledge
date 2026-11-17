"use client";

import { useState, type KeyboardEvent } from "react";
import CommunityBanner from "./CommunityBanner";
import CommunityHighlights from "./CommunityHighlights";
import CommunityFeed from "./CommunityFeed";
import CommunitySidebar from "./CommunitySidebar";
import { useCommunityPosts } from "@/services/community-posts/community-posts.queries";
import { mapCommunityPostDto } from "./types";
import { cn } from "@/lib/utils";
import type { CommunityDetail } from "./types";

interface CommunityDetailViewProps {
  community: CommunityDetail;
}

const tabs = [
  { id: "feed", label: "Feed", panelId: "community-panel-feed" },
  { id: "about", label: "Tentang", panelId: "community-panel-about" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function CommunityDetailView({
  community,
}: CommunityDetailViewProps) {
  const [isJoined, setIsJoined] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("feed");

  // Feed komunitas langsung dari mock server (GET /proxy/communities/:id/posts).
  // Mutasi create/update/delete meng-invalidate query key yang sama, sehingga
  // feed otomatis me-refresh setelah aksi tanpa penanganan khusus.
  const {
    data: postDtos,
    isLoading: isLoadingPosts,
    isError: isErrorPosts,
    refetch: refetchPosts,
  } = useCommunityPosts(community.id);

  const posts = (postDtos ?? []).map((dto) =>
    mapCommunityPostDto(dto, community.name)
  );

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = tabs.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      const nextTab = tabs[nextIndex];
      setActiveTab(nextTab.id);
      document.getElementById(`community-tab-${nextTab.id}`)?.focus();
    }
  };

  return (
    <div className="grid w-full grid-cols-1 gap-x-10 py-2 sm:py-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-x-12">
      <div className="lg:col-start-1 lg:row-start-1">
        <CommunityBanner
          community={community}
          isJoined={isJoined}
          onToggleJoin={() => setIsJoined((current) => !current)}
        />
      </div>

      {/* Tab bar hanya untuk mobile; desktop memakai layout dua kolom di bawah */}
      <div
        role="tablist"
        aria-label="Konten komunitas"
        className="mt-8 flex gap-6 border-b border-[var(--dust)]/50 lg:hidden"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`community-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={tab.panelId}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={handleTabKeyDown}
              className={cn(
                "-mb-px border-b-2 px-1 pb-2.5 text-[14px] font-medium transition-colors",
                isActive
                  ? "border-[var(--primary)] text-[var(--primary)]"
                  : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        id="community-panel-feed"
        role="tabpanel"
        aria-labelledby="community-tab-feed"
        className={cn(
          "lg:col-start-1 lg:row-start-2 lg:block",
          activeTab === "feed" ? "block" : "hidden"
        )}
      >
        <CommunityHighlights highlights={community.highlights} />
        {isLoadingPosts ? (
          <div
            className="mt-5 flex flex-col gap-6"
            aria-live="polite"
            aria-busy="true"
          >
            <div className="h-32 w-full rounded-xl bg-[var(--dust)]/30 animate-pulse" />
            <div className="h-32 w-full rounded-xl bg-[var(--dust)]/30 animate-pulse" />
            <div className="h-32 w-full rounded-xl bg-[var(--dust)]/30 animate-pulse" />
          </div>
        ) : isErrorPosts ? (
          <div className="mt-8 flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[var(--dust)]/70 text-center">
            <p className="font-sans text-sm font-semibold text-[var(--foreground)]">
              Gagal memuat postingan
            </p>
            <p className="font-sans text-[13px] text-[var(--muted)]">
              Pastikan mock server berjalan, lalu coba lagi.
            </p>
            <button
              type="button"
              onClick={() => void refetchPosts()}
              className="mt-2 inline-flex h-9 items-center rounded-lg border border-[var(--dust)] px-4 font-sans text-[13px] font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--background-accent)] cursor-pointer"
            >
              Coba lagi
            </button>
          </div>
        ) : (
          <CommunityFeed posts={posts} communityId={community.id} />
        )}
      </div>

      <div
        id="community-panel-about"
        role="tabpanel"
        aria-labelledby="community-tab-about"
        className={cn(
          "mt-8 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:block",
          activeTab === "about" ? "block" : "hidden"
        )}
      >
        <CommunitySidebar community={community} />
      </div>
    </div>
  );
}
