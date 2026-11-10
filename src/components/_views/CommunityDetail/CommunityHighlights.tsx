import Link from "next/link";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CommunityHighlight } from "./types";

interface CommunityHighlightsProps {
  highlights: CommunityHighlight[];
}

export default function CommunityHighlights({
  highlights,
}: CommunityHighlightsProps) {
  return (
    <section className="mt-8 flex w-full flex-col">
      <h2 className="mb-4 flex items-center gap-2 font-sans text-[15px] font-semibold text-[var(--foreground)]">
        <Sparkles className="h-[18px] w-[18px] text-[var(--foreground)]" />
        Sorotan Komunitas
      </h2>

      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        {highlights.map((highlight) => (
          <Link
            key={highlight.id}
            href={highlight.href}
            className={cn(
              "group relative flex h-[150px] flex-col justify-between overflow-hidden rounded-lg p-4 transition-transform hover:-translate-y-0.5",
              highlight.imageUrl
                ? "bg-[var(--foreground)]"
                : "border border-[var(--dust)]/70 bg-white"
            )}
          >
            {highlight.imageUrl && (
              <>
                <img
                  src={highlight.imageUrl}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
              </>
            )}

            <p
              className={cn(
                "relative z-10 font-sans text-[13px] font-bold leading-snug",
                highlight.imageUrl ? "text-white" : "text-[var(--foreground)]"
              )}
            >
              {highlight.title}
            </p>

            <div className="relative z-10 flex min-w-0 items-center gap-2">
              <span
                aria-hidden="true"
                className="h-6 w-6 shrink-0 rounded-full bg-[var(--primary)]"
              />
              <span
                className={cn(
                  "truncate font-sans text-[11px] font-medium",
                  highlight.imageUrl
                    ? "text-white/90"
                    : "text-[var(--muted)]"
                )}
              >
                {highlight.authorName}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-5 w-full border-t border-[var(--dust)]/40" />
    </section>
  );
}
