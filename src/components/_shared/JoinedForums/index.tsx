"use client";

import JoinedForumsProps from "./_types";
import ActiveForumRecommendations from "@/components/_shared/ActiveForumRecommendations";
import { useJoinedForums } from "@/services/forum/forum.queries";

const statusClass = "font-sans text-[14px] text-[var(--muted)]";

export default function JoinedForums({
  title = "FORUM YANG KAMU IKUTI",
  className = "",
}: JoinedForumsProps) {
  const { data, isLoading, isError, error } = useJoinedForums();

  if (isLoading) return <p className={statusClass}>Memuat forum...</p>;
  if (isError)
    return <p className={statusClass}>{error?.message ?? "Gagal memuat forum"}</p>;
  if (!data || data.length === 0)
    return <p className={statusClass}>Kamu belum mengikuti forum apa pun.</p>;

  return (
    <ActiveForumRecommendations title={title} forums={data} className={className} />
  );
}