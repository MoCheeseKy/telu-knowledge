"use client";

import RepostCard, { RepostItem } from "./RepostCard";
import { useProfile } from "./profile.context";

export default function HomeTab() {
  const { profile } = useProfile();

  // TODO: ganti dummy data ini dengan data dari API
  const articles: RepostItem[] = [
    {
      id: 1,
      category: "Skripsi & Riset",
      author: profile.username, // default: diri sendiri
      date: "12 September 2026",
      title: "Skripsi & Riset",
      description:
        "Kumpulan catatan perjalanan skripsi, dari memilih topik sampai persiapan sidang.",
      likes: "16,2k",
      comments: "16,2k",
      reposts: "16,2k",
      image: "/images/persona-c4.jpg",
    },
    {
      id: 2,
      category: "Ide Projek",
      author: profile.username,
      date: "12 September 2026",
      title: "Ide Projek",
      description:
        "Daftar ide projek yang ingin dikerjakan, lengkap dengan rencana awal dan teknologinya.",
      likes: "16,2k",
      comments: "16,2k",
      reposts: "16,2k",
      image: "/images/persona-c4.jpg",
    },
    {
      id: 3,
      category: "Ide Projek",
      author: profile.username,
      date: "12 September 2026",
      title: "Ide Projek",
      description:
        "Daftar ide projek yang ingin dikerjakan, lengkap dengan rencana awal dan teknologinya.",
      likes: "16,2k",
      comments: "16,2k",
      reposts: "16,2k",
      image: "/images/persona-c4.jpg",
    },
  ];

  // wrapper sama persis dengan tab Reposts
  return (
    <div className="flex flex-col gap-6 py-6">
      {articles.map((item) => (
        <RepostCard key={item.id} item={item} />
      ))}
    </div>
  );
}