"use client";

import React from "react";
import ForumDetailHeader from "./ForumDetailHeader";
import ForumDetailContent from "./ForumDetailContent";
import ForumDetailActions from "./ForumDetailActions";
import ForumCommentsThread from "./ForumCommentsThread";
import ForumCommunitySidebar from "./ForumCommunitySidebar";
import { sampleForumPost, ForumPostDetail } from "./types";

interface DiscussionForumDetailViewProps {
  postId?: string;
  initialPost?: ForumPostDetail;
}

export default function DiscussionForumDetailView({
  postId,
  initialPost = sampleForumPost,
}: DiscussionForumDetailViewProps) {
  const post = {
    ...initialPost,
    ...(postId ? { id: postId } : {}),
  };

  return (
    <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-12 xl:gap-16 py-6">
      {/* Kolom utama diskusi (lebar maksimal 679px, konsisten dengan DiscussionForumsView dan HomeView) */}
      <div className="flex-1 flex flex-col w-full max-w-[679px]">
        <ForumDetailHeader post={post} />
        <ForumDetailContent post={post} />
        <ForumDetailActions
          initialScore={post.score}
          commentsCount={post.commentsCount}
          repostsCount={post.repostsCount}
          isSaved={post.isSaved}
        />
        <ForumCommentsThread initialComments={post.comments} />
      </div>

      {/* Sidebar kanan (konsisten dengan sidebar DiscussionForumsView dan HomeView) */}
      <ForumCommunitySidebar post={post} />
    </div>
  );
}
