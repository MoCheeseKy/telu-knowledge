import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";

/** Halaman 404 yang ditampilkan ketika rute yang diminta tidak ditemukan. */
export default function NotFoundPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-16 text-center bg-[var(--background)]">
      <div className="w-full max-w-md rounded-2xl border border-[var(--dust)] bg-[var(--background)] p-6 sm:p-8 shadow-2xs flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-[var(--primary-soft)] text-[var(--primary-text)] flex items-center justify-center mb-4">
          <FileQuestion className="w-6 h-6" />
        </div>

        <span className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--primary-text)] mb-1">
          404
        </span>

        <h1 className="font-newsreader text-2xl sm:text-[30px] font-semibold text-[var(--foreground)] leading-tight mb-2">
          Halaman Tidak Ditemukan
        </h1>

        <p className="font-sans text-xs sm:text-sm text-[var(--muted)] leading-relaxed mb-6">
          Maaf, halaman atau tautan yang Anda tuju tidak tersedia, telah
          dipindahkan, atau sudah dihapus.
        </p>

        <Link
          href="/home"
          className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-[var(--primary-text)] hover:bg-[var(--primary-hover)] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-xs"
        >
          <Home className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    </div>
  );
}
