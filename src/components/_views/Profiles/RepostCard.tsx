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
    <article className="flex items-start justify-between gap-6 border-b py-6">
      <div className="min-w-0 flex-1">
        <div className="mb-3 flex items-center gap-2 text-xs">
          <span className="size-5 rounded bg-red-600" />
          <p className="text-gray-600">
            In <span className="text-red-600">{item.category}</span> by{" "}
            <span className="text-red-600">{item.author}</span>, {item.date}
          </p>
        </div>

        <h2 className="mb-2 font-serif text-2xl font-semibold">{item.title}</h2>
        <p className="mb-4 text-sm text-gray-600">{item.description}</p>

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
          <div className="flex items-center gap-4">
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
        className="hidden h-[130px] w-[170px] shrink-0 rounded-lg object-cover sm:block"
      />
    </article>
  );
}