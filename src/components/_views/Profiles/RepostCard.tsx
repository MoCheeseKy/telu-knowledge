import Image from "next/image";
import {
  ThumbsUp,
  MessageCircle,
  Repeat2,
  Bookmark,
  Share2,
} from "lucide-react";

export type RepostItem = {
  id: number;
  category: string;
  author: string;
  date: string;
  title: string;
  description: string;
  likes: string;
  comments: string;
  reposts: string;
  image: string;
};

export default function RepostCard({ item }: { item: RepostItem }) {
  return (
    <article className="flex items-start justify-between gap-4 sm:gap-6 border-b border-[var(--dust)]/60 py-5 sm:py-8">
      <div className="min-w-0 flex-1">
        <div className="mb-2.5 sm:mb-3 flex items-center gap-2 text-xs">
          <span className="size-4 sm:size-5 shrink-0 rounded bg-red-600" />
          <p className="text-gray-600 leading-snug">
            In <span className="text-red-600">{item.category}</span> by{" "}
            <span className="text-red-600">{item.author}</span>, {item.date}
          </p>
        </div>

        <h2 className="mb-2 font-serif text-lg sm:text-2xl font-semibold leading-snug">
          {item.title}
        </h2>
        <p className="mb-4 text-xs sm:text-sm text-gray-600 line-clamp-2 sm:line-clamp-3">
          {item.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ThumbsUp className="size-4 text-red-600" />
              {item.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="size-4" />
              {item.comments}
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="flex items-center gap-1">
              <Repeat2 className="size-4 text-red-600" />
              {item.reposts}
            </span>
            <Bookmark className="size-4 text-red-600" />
            <Share2 className="size-4" />
          </div>
        </div>
      </div>

      <Image
        src={item.image}
        alt={item.title}
        width={280}
        height={190}
        className="h-[72px] w-[100px] sm:h-[130px] sm:w-[170px] shrink-0 rounded-lg object-cover"
      />
    </article>
  );
}