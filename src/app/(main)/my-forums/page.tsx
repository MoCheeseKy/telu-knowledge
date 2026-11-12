import { Suspense } from "react";
import MyForumsView from "@/components/_views/MyForums";

export const metadata = {
  title: "Forum Saya | Tel-U Knowledge",
  description: "Kelola komunitas dan forum yang Anda ikuti atau moderasi di Tel-U Knowledge",
};

export default function MyForumsPage() {
  return (
    <Suspense fallback={<div className="w-full py-8 text-center text-sm text-[var(--muted)]">Memuat Forum...</div>}>
      <MyForumsView />
    </Suspense>
  );
}

