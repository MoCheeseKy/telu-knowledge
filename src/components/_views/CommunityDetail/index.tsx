"use client";

import { useState, useSyncExternalStore, type KeyboardEvent } from "react";
import CommunityBanner from "./CommunityBanner";
import CommunityHighlights from "./CommunityHighlights";
import CommunityFeed from "./CommunityFeed";
import CommunitySidebar from "./CommunitySidebar";
import {
  getCommunityPostsSnapshot,
  getEmptyCommunityPosts,
  subscribeCommunityPosts,
} from "../CommunityPostCreate/storage";
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
  const savedPosts = useSyncExternalStore(
    subscribeCommunityPosts,
    () => getCommunityPostsSnapshot(community.id),
    getEmptyCommunityPosts
  );

  const posts = [...savedPosts, ...community.posts];

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
        <CommunityFeed posts={posts} communityId={community.id} />
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
