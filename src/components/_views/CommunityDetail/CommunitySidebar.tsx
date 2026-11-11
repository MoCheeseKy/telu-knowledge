"use client";

import { Calendar } from "lucide-react";
import CommunityRulesList from "@/components/_shared/CommunityRulesList";
import type { CommunityDetail } from "./types";

interface CommunitySidebarProps {
  community: CommunityDetail;
}

export default function CommunitySidebar({
  community,
}: CommunitySidebarProps) {
  return (
    <aside className="w-full shrink-0 pt-2 lg:w-[320px] xl:w-[340px]">
      <section className="rounded-xl border border-[var(--dust)]/70 bg-white p-5">
        {/* Identitas komunitas */}
        <div className="flex items-center gap-3">
          <img
            src={community.avatarUrl}
            alt={community.name}
            className="h-9 w-9 shrink-0 rounded-full bg-[var(--background-accent)] object-cover"
          />
          <h2 className="min-w-0 font-sans text-[14px] font-bold leading-snug text-[var(--foreground)]">
            {community.name}
          </h2>
        </div>

        <h3 className="mt-4 font-sans text-[15px] font-bold text-[var(--foreground)]">
          Tentang Komunitas
        </h3>
        <p className="mt-1.5 font-sans text-[13px] leading-relaxed text-[var(--muted)]">
          {community.description}
        </p>

        {/* Statistik */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="font-sans text-[20px] font-bold leading-none text-[var(--primary-text)]">
              {community.memberCount}
            </span>
            <span className="mt-1 font-sans text-[12px] text-[var(--muted)]">
              Anggota
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-[20px] font-bold leading-none text-[var(--primary-text)]">
              {community.postCount}
            </span>
            <span className="mt-1 font-sans text-[12px] text-[var(--muted)]">
              Postingan
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-1.5 font-sans text-[12px] text-[var(--muted)]">
          <Calendar className="h-3.5 w-3.5" />
          <span>Dibuat {community.createdAt}</span>
        </div>

        {/* Admin */}
        <div className="my-4 border-t border-[var(--dust)]/50" />

        <p className="font-sans text-[11px] uppercase tracking-wide text-[var(--muted)]">
          Admin Komunitas
        </p>
        <div className="mt-2 flex items-center gap-2.5">
          {community.admin.avatarUrl ? (
            <img
              src={community.admin.avatarUrl}
              alt={community.admin.name}
              className="h-10 w-10 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className="h-10 w-10 shrink-0 rounded-full bg-[var(--primary)]"
            />
          )}
          <span className="font-sans text-[14px] font-medium text-[var(--foreground)]">
            {community.admin.name}
          </span>
        </div>

        {/* Aturan komunitas */}
        <div className="my-4 border-t border-[var(--dust)]/50" />

        <p className="font-sans text-[11px] uppercase tracking-wide text-[var(--muted)]">
          Aturan Komunitas
        </p>

        <CommunityRulesList rules={community.rules} className="mt-1" />
      </section>
    </aside>
  );
}
