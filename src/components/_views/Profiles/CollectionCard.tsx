import Image from "next/image";
import { Lock } from "lucide-react";

export type CollectionItem = {
  id: number;
  author: string;
  authorInitial: string;
  title: string;
  storyCount: number;
  isPrivate: boolean;
  image?: string;
};

export default function CollectionCard({ item }: { item: CollectionItem }) {
  return (
    <article className="flex items-center justify-between gap-6 rounded-lg border border-[var(--dust)] bg-[var(--background-accent)]/50 p-6 shadow-xs">
      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="flex size-5 items-center justify-center rounded-full bg-[#0A3AB5] text-[10px] font-semibold text-white">
            {item.authorInitial}
          </span>
          <span className="text-xs font-medium">{item.author}</span>
        </div>

        <h3 className="truncate font-serif text-2xl font-bold leading-tight">
          {item.title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
          <span>{item.storyCount} Stories</span>
          {item.isPrivate && (
            <>
              <span aria-hidden="true">•</span>
              <Lock className="size-3.5" aria-label="Privat" />
            </>
          )}
        </div>
      </div>

      
      <div className="relative h-[100px] w-[140px] shrink-0 overflow-hidden rounded-md bg-gradient-to-r from-[var(--primary)] to-[var(--foreground)] sm:h-[112px] sm:w-[200px]">
  {item.image && (
    <Image
      src={item.image}
      alt={item.title}
      fill
      sizes="200px"
      className="object-cover"
    />
  )}
</div>
    </article>
  );
}