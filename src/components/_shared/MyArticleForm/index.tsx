"use client";

import { useState } from "react";
import { PlusCircle, Sparkles, X } from "lucide-react";
import { MyArticleFormProps } from "./_types";
import { ArticleStatus } from "../MyArticleCard/_types";
import { cn } from "@/lib/utils";

export default function MyArticleForm({
    onSubmit,
    onCancel,
    defaultStatus = "draft",
    className = "",
}: MyArticleFormProps) {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [category, setCategory] = useState<string>("Frontend Web");
    const [readTime, setReadTime] = useState<string>("Bacaan 3 menit");
    const [status, setStatus] = useState<ArticleStatus>(defaultStatus);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!title.trim()) {
            setErrorMessage("Judul artikel tidak boleh kosong!");
            return;
        }

        if (!description.trim()) {
            setErrorMessage("Ringkasan / deskripsi artikel wajib diisi!");
            return;
        }

        setErrorMessage("");

        let updatedAt = "Baru saja";
        if (status === "terjadwal") {
            updatedAt = "Terjadwal segera";
        } else if (status === "diterbitkan") {
            updatedAt = "Dipublikasikan hari ini";
        }

        onSubmit({
            title: title.trim(),
            description: description.trim(),
            category,
            readTime,
            status,
            updatedAt,
            imageUrl: imageUrl.trim() ? imageUrl.trim() : undefined,
        });

        setTitle("");
        setDescription("");
        setCategory("Frontend Web");
        setReadTime("Bacaan 3 menit");
        setStatus(defaultStatus);
        setImageUrl("");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={cn(
                "p-5 rounded-xl border border-[var(--dust)]/60 bg-[var(--background)] shadow-xs transition-all my-3",
                className
            )}
        >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--dust)]/40">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[var(--primary)]" />
                    <h3 className="font-sans text-[16px] font-bold text-[var(--foreground)]">
                        Form Tambah Artikel TelU Knowledge
                    </h3>
                </div>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="p-1 rounded-md text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-accent)] transition-colors"
                        aria-label="Tutup form"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {errorMessage && (
                <div className="mb-4 p-3 rounded-lg bg-[var(--failed-soft)] border border-[var(--failed)]/30 text-[var(--failed-text)] text-xs font-medium">
                    {errorMessage}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="font-sans text-xs font-semibold text-[var(--foreground)]">
                        Judul Artikel <span className="text-[var(--failed)]">*</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Contoh: Eksplorasi Arsitektur Server Actions di Next.js 15"
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-[var(--dust)] bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-xs font-semibold text-[var(--foreground)]">
                        Kategori / Topik
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-[var(--dust)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                    >
                        <option value="Frontend Web">Frontend Web</option>
                        <option value="Software Engineering">Software Engineering</option>
                        <option value="Struktur Data">Struktur Data</option>
                        <option value="Tips Kampus">Tips Kampus</option>
                        <option value="Akademik">Akademik</option>
                        <option value="DevOps & Tools">DevOps & Tools</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-xs font-semibold text-[var(--foreground)]">
                        Status Artikel
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as ArticleStatus)}
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-[var(--dust)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                    >
                        <option value="draft">Draf (Masih dalam penulisan)</option>
                        <option value="terjadwal">Terjadwal (Antrean publikasi)</option>
                        <option value="diterbitkan">Diterbitkan (Dapat diakses publik)</option>
                        <option value="tidak_publik">Tidak Publik (Arsip rahasia)</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-xs font-semibold text-[var(--foreground)]">
                        Estimasi Waktu Baca
                    </label>
                    <select
                        value={readTime}
                        onChange={(e) => setReadTime(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-[var(--dust)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                    >
                        <option value="Bacaan 1 menit">Bacaan 1 menit</option>
                        <option value="Bacaan 2 menit">Bacaan 2 menit</option>
                        <option value="Bacaan 3 menit">Bacaan 3 menit</option>
                        <option value="Bacaan 5 menit">Bacaan 5 menit</option>
                        <option value="Bacaan 8 menit">Bacaan 8 menit</option>
                        <option value="Bacaan 10 menit">Bacaan 10 menit</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-xs font-semibold text-[var(--foreground)]">
                        URL Gambar Sampul (Opsional)
                    </label>
                    <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://... atau biarkan kosong"
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-[var(--dust)] bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
                    />
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="font-sans text-xs font-semibold text-[var(--foreground)]">
                        Ringkasan / Sinopsis Artikel <span className="text-[var(--failed)]">*</span>
                    </label>
                    <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Tuliskan intisari artikel ilmiah, catatan praktikum, atau ulasan teknologi Anda di sini..."
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-[var(--dust)] bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all resize-none"
                    />
                </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-5 pt-3 border-t border-[var(--dust)]/40">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-accent)] transition-colors cursor-pointer"
                    >
                        Batal
                    </button>
                )}
                <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] active:scale-98 transition-all cursor-pointer shadow-xs"
                >
                    <PlusCircle className="w-4 h-4" />
                    <span>Tambah</span>
                </button>
            </div>
        </form>
    );
}
