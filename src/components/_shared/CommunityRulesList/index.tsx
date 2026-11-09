"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CommunityRuleItem {
  id: number;
  title: string;
  description: string;
}

interface CommunityRulesListProps {
  rules: CommunityRuleItem[];
  className?: string;
}

export default function CommunityRulesList({
  rules,
  className = "",
}: CommunityRulesListProps) {
  const [openRuleIds, setOpenRuleIds] = useState<number[]>([]);

  const toggleRule = (id: number) => {
    setOpenRuleIds((current) =>
      current.includes(id)
        ? current.filter((ruleId) => ruleId !== id)
        : [...current, id]
    );
  };

  return (
    <div className={cn("flex flex-col", className)}>
      {rules.map((rule) => {
        const isOpen = openRuleIds.includes(rule.id);

        return (
          <div
            key={rule.id}
            className="border-b border-[var(--dust)]/40 last:border-b-0"
          >
            <button
              type="button"
              onClick={() => toggleRule(rule.id)}
              aria-expanded={isOpen}
              className="flex w-full items-start justify-between gap-3 py-2.5 text-left"
            >
              <span className="font-sans text-[13px] leading-snug text-[var(--foreground)]">
                {rule.id}. {rule.title}
              </span>
              <ChevronDown
                className={cn(
                  "mt-0.5 h-4 w-4 shrink-0 text-[var(--muted)] transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </button>

            {isOpen && (
              <p className="pb-3 pr-6 font-sans text-[12px] leading-relaxed text-[var(--muted)]">
                {rule.description}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
