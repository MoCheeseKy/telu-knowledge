import CommunityRulesList from "@/components/_shared/CommunityRulesList";
import type { CommunityDetail } from "../CommunityDetail/types";

interface PostGuidelinesSidebarProps {
  community: CommunityDetail;
}

export default function PostGuidelinesSidebar({
  community,
}: PostGuidelinesSidebarProps) {
  return (
    <aside className="w-full shrink-0 pt-2 lg:w-[320px] xl:w-[340px]">
      <section className="rounded-xl border border-[var(--dust)]/70 bg-[var(--background-accent)]/60 p-5">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
          Dari Moderator {community.name}
        </p>

        <p className="mt-3 font-sans text-[13px] font-semibold leading-relaxed text-[var(--foreground)]">
          Patuhi aturan {community.name} yang berlaku.
        </p>
        <p className="mt-2 font-sans text-[13px] leading-relaxed text-[var(--muted)]">
          Judul postingan wajib diisi dengan jelas. Jelaskan isi postingan
          sejelas mungkin karena tidak semua anggota memiliki tingkat
          pengetahuan yang sama. Semakin sedikit penjelasan yang diberikan,
          semakin besar kemungkinan postingan diturunkan.
        </p>
      </section>

      <section className="mt-4 rounded-xl border border-[var(--dust)]/70 bg-white p-5">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
          Aturan Komunitas
        </p>
        <CommunityRulesList rules={community.rules} className="mt-1" />
      </section>
    </aside>
  );
}
