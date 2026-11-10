"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Globe, Lock, EyeOff, ImagePlus, X } from "lucide-react";
import ActiveForumRecommendationCard from "@/components/_shared/ActiveForumRecommendations/ActiveForumRecommendationCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAME_MAX = 30;
const DESC_MAX = 500;

// TODO: ganti dengan data topik dari API
const topicOptions = [
    "Akademik",
    "Software Engineering",
    "Game Dev",
    "Kuliner",
    "Wisata",
    "Karier",
    "Organisasi",
    "Hobi",
];

const visibilityOptions = [
    { value: "publik", label: "Publik", description: "Siapa saja bisa melihat dan bergabung.", icon: Globe },
    { value: "terbatas", label: "Terbatas", description: "Siapa saja bisa melihat, tapi gabung perlu persetujuan.", icon: EyeOff },
    { value: "privat", label: "Privat", description: "Hanya anggota yang bisa melihat dan memposting.", icon: Lock },
];

const inputClass =
    "w-full rounded-lg border border-[var(--dust)] bg-[var(--background)] px-3.5 py-2.5 font-sans text-[15px] text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none transition-colors focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20";

function FieldLabel({ htmlFor, title, hint }) {
    return (
        <div className="flex flex-col gap-0.5">
            <label htmlFor={htmlFor} className="font-sans text-[15px] font-semibold text-[var(--foreground)]">
                {title}
            </label>
            {hint && <p className="font-sans text-[13px] text-[var(--muted)]">{hint}</p>}
        </div>
    );
}

export default function CreateForumView() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [topics, setTopics] = useState([]);
    const [visibility, setVisibility] = useState("publik");
    const [bannerPreview, setBannerPreview] = useState(null);

    const isValid = name.trim().length >= 3 && description.trim().length > 0;

    const toggleTopic = (topic) =>
        setTopics((prev) =>
            prev.includes(topic)
                ? prev.filter((t) => t !== topic)
                : prev.length < 3
                    ? [...prev, topic]
                    : prev
        );

    const handleBannerChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (bannerPreview) URL.revokeObjectURL(bannerPreview);
        setBannerPreview(URL.createObjectURL(file));
    };

    const removeBanner = () => {
        if (bannerPreview) URL.revokeObjectURL(bannerPreview);
        setBannerPreview(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isValid) return;
        // TODO: kirim { name, description, topics, visibility, banner } ke API
        router.push("/discussion-forums");
    };

    return (
        <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-12 xl:gap-16 py-2">
            <form
                onSubmit={handleSubmit}
                className="flex-1 flex flex-col w-full max-w-[679px]"
            >
                {/* 1. JUDUL HALAMAN */}
                <div className="flex flex-col gap-2 mb-10">
                    <h1 className="font-sans text-[32px] font-bold text-[var(--primary-text)] leading-tight">
                        Buat Forum Baru
                    </h1>
                    <p className="font-sans text-[16px] font-normal text-[var(--foreground)] leading-relaxed">
                        Bangun ruang diskusi untuk civitas akademika Telkom University.
                    </p>
                </div>

                <div className="flex flex-col gap-8">
                    {/* 2. NAMA FORUM */}
                    <div className="flex flex-col gap-2">
                        <FieldLabel
                            htmlFor="forum-name"
                            title="Nama forum"
                            hint="Pilih nama yang singkat dan mudah diingat. Tidak bisa diubah nanti."
                        />
                        <input
                            id="forum-name"
                            type="text"
                            value={name}
                            maxLength={NAME_MAX}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Contoh: Kuliner Telkom"
                            className={inputClass}
                        />
                        <span className="self-end font-sans text-[12px] text-[var(--muted)]">
                            {name.length}/{NAME_MAX}
                        </span>
                    </div>

                    <div className="flex flex-col gap-2">
                        <FieldLabel
                            htmlFor="forum-desc"
                            title="Deskripsi"
                            hint="Jelaskan tentang apa forum ini agar anggota baru paham."
                        />
                        <textarea
                            id="forum-desc"
                            value={description}
                            maxLength={DESC_MAX}
                            rows={5}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Tulis deskripsi forum..."
                            className={cn(inputClass, "resize-none leading-relaxed")}
                        />
                        <span className="self-end font-sans text-[12px] text-[var(--muted)]">
                            {description.length}/{DESC_MAX}
                        </span>
                    </div>

                    <div className="flex flex-col gap-3">
                        <FieldLabel
                            title="Topik"
                            hint="Pilih maksimal 3 topik agar forum mudah ditemukan."
                        />
                        <div className="flex flex-wrap gap-2">
                            {topicOptions.map((topic) => {
                                const active = topics.includes(topic);
                                return (
                                    <button
                                        key={topic}
                                        type="button"
                                        onClick={() => toggleTopic(topic)}
                                        aria-pressed={active}
                                        className={cn(
                                            "px-3.5 py-1.5 rounded-full border font-sans text-[13px] transition-colors cursor-pointer",
                                            active
                                                ? "border-[var(--primary-text)] bg-[var(--primary-soft)] text-[var(--primary-text)] font-semibold"
                                                : "border-[var(--dust)] text-[var(--foreground)] hover:bg-[var(--background-accent)]"
                                        )}
                                    >
                                        {topic}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <FieldLabel
                            title="Banner forum"
                            hint="Opsional. Rasio 3:1 disarankan, maksimal 2 MB."
                        />
                        {bannerPreview ? (
                            <div className="relative w-full aspect-[3/1] rounded-xl overflow-hidden bg-[var(--background-accent)]">
                                <img
                                    src={bannerPreview}
                                    alt="Pratinjau banner"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={removeBanner}
                                    aria-label="Hapus banner"
                                    className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-md bg-[var(--background)]/90 text-[var(--foreground)] hover:bg-[var(--background)] transition-colors cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center gap-2 w-full aspect-[3/1] rounded-xl border border-dashed border-[var(--dust)] text-[var(--muted)] hover:bg-[var(--background-accent)]/60 hover:text-[var(--primary-text)] transition-colors cursor-pointer">
                                <ImagePlus className="w-6 h-6" />
                                <span className="font-sans text-[13px]">Klik untuk unggah gambar</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleBannerChange}
                                    className="sr-only"
                                />
                            </label>
                        )}
                    </div>

                    <div className="flex flex-col gap-3">
                        <FieldLabel title="Tipe forum" />
                        <div role="radiogroup" className="flex flex-col gap-2">
                            {visibilityOptions.map(({ value, label, description: desc, icon: Icon }) => {
                                const active = visibility === value;
                                return (
                                    <button
                                        key={value}
                                        type="button"
                                        role="radio"
                                        aria-checked={active}
                                        onClick={() => setVisibility(value)}
                                        className={cn(
                                            "flex items-center gap-3.5 px-4 py-3 rounded-xl border text-left transition-all cursor-pointer",
                                            active
                                                ? "border-[var(--primary-text)] bg-[var(--primary-soft)]/20"
                                                : "border-[var(--dust)] hover:bg-[var(--background-accent)]"
                                        )}
                                    >
                                        <Icon
                                            className={cn(
                                                "w-5 h-5 shrink-0",
                                                active ? "text-[var(--primary-text)]" : "text-[var(--foreground)]"
                                            )}
                                        />
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <span
                                                className={cn(
                                                    "font-sans text-[15px]",
                                                    active ? "font-semibold text-[var(--primary-text)]" : "font-medium text-[var(--foreground)]"
                                                )}
                                            >
                                                {label}
                                            </span>
                                            <span className="font-sans text-[13px] text-[var(--muted)]">{desc}</span>
                                        </div>
                                        <span
                                            aria-hidden="true"
                                            className={cn(
                                                "flex items-center justify-center w-4 h-4 rounded-full border shrink-0",
                                                active ? "border-[var(--primary-text)]" : "border-[var(--dust)]"
                                            )}
                                        >
                                            {active && <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-[var(--dust)]/40">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            className="h-9 px-4 rounded-lg"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            variant="default"
                            disabled={!isValid}
                            className="h-9 px-4 rounded-lg shadow-xs"
                        >
                            Buat Forum
                        </Button>
                    </div>
                </div>
            </form>

            <aside className="w-full lg:w-[320px] xl:w-[340px] shrink-0 lg:sticky lg:top-24 flex flex-col pt-2">
                <h3 className="font-sans text-[16px] font-bold uppercase text-[var(--primary-text)] tracking-wider mb-3">
                    PRATINJAU
                </h3>

                <div className="flex flex-col rounded-xl border border-[var(--dust)] overflow-hidden">
                    <div className="w-full aspect-[3/1] bg-[var(--background-accent)]">
                        {bannerPreview && (
                            <img src={bannerPreview} alt="" className="w-full h-full object-cover" />
                        )}
                    </div>

                    <div className="px-4 pb-1">
                        <ActiveForumRecommendationCard
                            title={name.trim() || "Nama Forum"}
                            description={description.trim() || "Deskripsi forum akan tampil di sini..."}
                            activeMemberCount="1 Anggota"
                            isFollowing={false}
                            className="border-b-0"
                        />
                    </div>

                    {topics.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 px-4 pb-4">
                            {topics.map((t) => (
                                <span
                                    key={t}
                                    className="px-2.5 py-0.5 rounded-full bg-[var(--primary-soft)] text-[var(--primary-text)] font-sans text-[11px] font-semibold"
                                >
                                    {t}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </aside>
        </div>
    );
}