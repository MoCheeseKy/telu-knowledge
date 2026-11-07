"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import MyForumCard from "./MyForumCard";
import CreateCommunityDialog from "./CreateCommunityDialog";
import {
  initialCommunities,
  initialMyPosts,
  MyCommunityItem,
  MyForumPostItem,
} from "./my-forums.types";

export default function MyForumsView() {
  const [communities, setCommunities] = useState<MyCommunityItem[]>(initialCommunities);
  const [myPosts, setMyPosts] = useState<MyForumPostItem[]>(initialMyPosts);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleToggleFollow = (id: string | number) => {
    setCommunities((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCreateCommunity = (newCommunity: MyCommunityItem) => {
    setCommunities((prev) => [newCommunity, ...prev]);
  };

  const handleDeletePost = (id: string | number) => {
    setMyPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const moderatedList = useMemo(
    () => communities.filter((item) => item.role === "Pembuat" || item.role === "Moderator"),
    [communities]
  );

  const joinedList = useMemo(
    () => communities.filter((item) => item.role === "Anggota"),
    [communities]
  );

  return (
    <div className="w-full flex flex-col py-2 mb-auto">
      {/* Header - konsisten dengan MyArticles */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <h1 className="font-sans text-[32px] font-bold text-[var(--foreground)]">
          Forum Saya
        </h1>
        <Button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="cursor-pointer gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Komunitas</span>
        </Button>
      </div>

      {/* Tabs - menggunakan variant="line" konsisten dengan MyArticles */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList
          variant="line"
          className="bg-transparent border-b border-[var(--dust)]/60 rounded-none w-full justify-start h-auto p-0 gap-6"
        >
          <TabsTrigger value="all">
            Semua
          </TabsTrigger>
          <TabsTrigger value="moderated">
            Dikelola
          </TabsTrigger>
          <TabsTrigger value="joined">
            Diikuti
          </TabsTrigger>
          <TabsTrigger value="my-posts">
            Postingan Saya
          </TabsTrigger>
        </TabsList>

        {/* TAB: Semua */}
        <TabsContent value="all" className="flex flex-col m-0 pt-6">
          {communities.length === 0 ? (
            <p className="py-12 text-center text-[var(--muted)]">
              Tidak ada komunitas. Buat komunitas baru untuk memulai.
            </p>
          ) : (
            <div className="flex flex-col">
              {communities.map((item) => (
                <MyForumCard
                  key={item.id}
                  item={item}
                  onToggleFollow={handleToggleFollow}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* TAB: Dikelola */}
        <TabsContent value="moderated" className="flex flex-col m-0 pt-6">
          {moderatedList.length === 0 ? (
            <p className="py-12 text-center text-[var(--muted)]">
              Belum ada forum yang Anda kelola.
            </p>
          ) : (
            <div className="flex flex-col">
              {moderatedList.map((item) => (
                <MyForumCard
                  key={item.id}
                  item={item}
                  onToggleFollow={handleToggleFollow}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* TAB: Diikuti */}
        <TabsContent value="joined" className="flex flex-col m-0 pt-6">
          {joinedList.length === 0 ? (
            <p className="py-12 text-center text-[var(--muted)]">
              Belum mengikuti forum apapun.
            </p>
          ) : (
            <div className="flex flex-col">
              {joinedList.map((item) => (
                <MyForumCard
                  key={item.id}
                  item={item}
                  onToggleFollow={handleToggleFollow}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* TAB: Postingan Saya */}
        <TabsContent value="my-posts" className="flex flex-col m-0 pt-6">
          {myPosts.length === 0 ? (
            <p className="py-12 text-center text-[var(--muted)]">
              Belum ada postingan diskusi.
            </p>
          ) : (
            <div className="flex flex-col">
              {myPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-start justify-between gap-4 py-4 border-b border-[var(--dust)]/40 last:border-b-0 group"
                >
                  <div className="min-w-0 flex-1 flex flex-col gap-1">
                    <p className="font-sans text-[11px] leading-none text-[var(--foreground)]">
                      <span>From </span>
                      <span className="text-[var(--primary-text)] font-semibold">{post.forumName}</span>
                      <span>, </span>
                      <span className="font-semibold">{post.createdAt}</span>
                    </p>
                    <Link
                      href={`/discussion-forums/${post.id}`}
                      className="font-sans font-bold text-[15px] text-[var(--foreground)] group-hover:text-[var(--primary-text)] transition-colors line-clamp-1 mt-1"
                    >
                      {post.title}
                    </Link>
                    <div className="flex items-center gap-3 text-xs text-[var(--muted)] mt-0.5">
                      <span>{post.likesCount} suka</span>
                      <span>{post.commentsCount} komentar</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeletePost(post.id)}
                    className="p-1.5 text-[var(--muted)] hover:text-[var(--failed)] transition-colors cursor-pointer shrink-0 mt-1"
                    title="Hapus postingan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Community Dialog Modal */}
      <CreateCommunityDialog
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCreate={handleCreateCommunity}
      />
    </div>
  );
}
