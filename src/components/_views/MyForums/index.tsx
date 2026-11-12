"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Plus, Trash2, Pencil } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import MyForumCard from "./MyForumCard";
import CreateCommunityDialog from "./CreateCommunityDialog";
import {
  useCommunities,
  useAllForumPosts,
  useDeleteForumPost,
} from "@/services/community-posts/community-posts.queries";
import { MOCK_VIEWER_ID } from "@/services/community-posts/community-posts.types";
import {
  initialCommunities,
  initialMyPosts,
  MyCommunityItem,
  MyForumPostItem,
} from "./my-forums.types";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function MyForumsView() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const shouldAutoOpen = searchParams?.get("create") === "true";

  const { data: apiCommunities, isLoading: isLoadingCommunities } = useCommunities();
  const { data: apiPosts, isLoading: isLoadingPosts } = useAllForumPosts();
  const deletePostMutation = useDeleteForumPost();

  const [localCreatedCommunities, setLocalCreatedCommunities] = useState<MyCommunityItem[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(shouldAutoOpen);

  // Gabungkan komunitas dari API dengan fallback initialCommunities
  const communities: MyCommunityItem[] = useMemo(() => {
    if (apiCommunities && apiCommunities.length > 0) {
      const fromApi: MyCommunityItem[] = apiCommunities.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug || c.name.toLowerCase().replace(/\s+/g, "-"),
        description: c.description || "",
        category: (c.category as MyCommunityItem["category"]) || "Umum",
        membersCount: `${(c.member_count ?? 1).toLocaleString("id-ID")} Anggota`,
        discussionsCount: `${(c.post_count ?? 0).toLocaleString("id-ID")} Postingan`,
        role: c.creator_id === MOCK_VIEWER_ID ? "Pembuat" : "Anggota",
        isPrivate: c.visibility === "privat",
        avatarUrl: c.avatar_url || undefined,
        avatarColor: c.avatar_color || "bg-[#0A3AB5]",
        avatarInitial: (c.name?.charAt(0) || "K").toUpperCase(),
        lastActive: "Baru saja",
        isFollowing: true,
      }));
      return [...localCreatedCommunities, ...fromApi];
    }
    return [...localCreatedCommunities, ...initialCommunities];
  }, [apiCommunities, localCreatedCommunities]);

  // Ambil postingan milik user aktif (MOCK_VIEWER_ID) dari API
  const myPosts: (MyForumPostItem & { communityId?: string })[] = useMemo(() => {
    if (apiPosts && apiPosts.length > 0) {
      const authored = apiPosts.filter((p) => p.authorId === MOCK_VIEWER_ID);
      if (authored.length > 0) {
        return authored.map((p) => ({
          id: p.id,
          title: p.title,
          forumName: p.communityName || "Komunitas",
          forumSlug: p.communityId || "1",
          communityId: p.communityId || "1",
          createdAt: p.createdAt ? dateFormatter.format(new Date(p.createdAt)) : "Baru saja",
          likesCount: p.likesCount ?? 0,
          commentsCount: p.commentsCount ?? 0,
          status: "Aktif",
        }));
      }
    }
    return initialMyPosts;
  }, [apiPosts]);

  const handleToggleFollow = (id: string | number) => {
    // Sembunyikan secara visual dari list
    setLocalCreatedCommunities((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCreateCommunity = (newCommunity: MyCommunityItem) => {
    setLocalCreatedCommunities((prev) => [newCommunity, ...prev]);
  };

  const handleDeletePost = (id: string | number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus postingan forum ini?")) return;

    deletePostMutation.mutate(String(id), {
      onSuccess: () => {
        toast.success("Postingan forum berhasil dihapus.");
      },
      onError: () => {
        toast.error("Gagal menghapus postingan.");
      },
    });
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
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
        <h1 className="font-sans text-[24px] sm:text-[32px] font-bold text-[var(--foreground)]">
          Forum Saya
        </h1>
        <Button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="cursor-pointer gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Forum</span>
        </Button>
      </div>

      {/* Tabs - menggunakan variant="line" konsisten dengan MyArticles */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList
          variant="line"
          className="bg-transparent border-b border-[var(--dust)]/60 rounded-none w-full justify-start h-auto p-0 gap-4 sm:gap-6"
        >
          <TabsTrigger value="all">Semua</TabsTrigger>
          <TabsTrigger value="moderated">Dikelola</TabsTrigger>
          <TabsTrigger value="joined">Diikuti</TabsTrigger>
          <TabsTrigger value="my-posts">Postingan Saya</TabsTrigger>
        </TabsList>

        {/* TAB: Semua */}
        <TabsContent value="all" className="flex flex-col m-0 pt-6">
          {isLoadingCommunities ? (
            <div className="flex flex-col gap-4 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-20 w-full bg-[var(--dust)]/20 rounded-xl" />
              ))}
            </div>
          ) : communities.length === 0 ? (
            <p className="py-12 text-center text-[var(--muted)]">
              Tidak ada forum. Buat forum baru untuk memulai.
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
          {isLoadingPosts ? (
            <div className="flex flex-col gap-4 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-16 w-full bg-[var(--dust)]/20 rounded-xl" />
              ))}
            </div>
          ) : myPosts.length === 0 ? (
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

                  <div className="flex items-center gap-1 shrink-0 mt-1">
                    <Link
                      href={`/communities/${post.communityId || "1"}/post/${post.id}/edit`}
                      className="p-1.5 text-[var(--muted)] hover:text-[var(--primary-text)] transition-colors cursor-pointer"
                      title="Sunting postingan"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>

                    <button
                      type="button"
                      disabled={deletePostMutation.isPending}
                      onClick={() => handleDeletePost(post.id)}
                      className="p-1.5 text-[var(--muted)] hover:text-[var(--failed)] transition-colors cursor-pointer"
                      title="Hapus postingan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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
