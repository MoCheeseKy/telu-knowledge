import { Suspense } from "react";
import MyForumsView from "@/components/_views/Forums/MyForums";

/** Metadata statis untuk halaman Forum Saya. */
export const metadata = {
  title: "Forum Saya | Tel-U Knowledge",
  description: "Kelola komunitas dan forum yang Anda ikuti atau moderasi di Tel-U Knowledge",
};

/** Halaman daftar forum dan komunitas yang diikuti atau dimoderasi pengguna. */
export default function MyForumsPage() {
  return (
    <Suspense fallback={<div className="w-full py-8 text-center text-sm text-[var(--muted)]">Memuat Forum...</div>}>
      <MyForumsView />
    </Suspense>
  );
}

