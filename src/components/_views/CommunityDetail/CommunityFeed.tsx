import { Fragment } from "react";
import ForumPostCard from "@/components/_shared/ForumPostCard";
import type { CommunityPost } from "./types";

interface CommunityFeedProps {
  posts: CommunityPost[];
  /** Dibutuhkan untuk menyusun tautan "Sunting" pada post milik sendiri. */
  communityId: string;
}

export default function CommunityFeed({
  posts,
  communityId,
}: CommunityFeedProps) {
  if (posts.length === 0) {
    return (
      <div className="mt-8 flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-[var(--dust)]/70 text-center">
        <p className="font-sans text-sm font-semibold text-[var(--foreground)]">
          Belum ada postingan
        </p>
        <p className="mt-1 font-sans text-[13px] text-[var(--muted)]">
          Jadilah yang pertama memulai diskusi di komunitas ini.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-5 flex flex-col gap-6">
      {posts.map((post, index) => (
        <Fragment key={post.id}>
          {index > 0 && (
            <div className="w-full border-t border-[var(--dust)]/40" />
          )}
          <ForumPostCard
            id={post.id}
            topic={post.topic}
            publisher={post.publisher}
            postDate={post.postDate}
            title={post.title}
            description={post.description}
            imageUrl={post.imageUrl}
            imageAlt={post.imageAlt}
            likesCount={post.likesCount}
            commentsCount={post.commentsCount}
            repostsCount={post.repostsCount}
            isLiked={post.isLiked}
            editHref={
              post.mockPostId
                ? `/communities/${communityId}/post/${post.mockPostId}/edit`
                : undefined
            }
            className="max-w-none"
          />
        </Fragment>
      ))}
    </div>
  );
}
