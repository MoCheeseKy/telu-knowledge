"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Plus, Globe, Lock } from "lucide-react";
import { MyCommunityItem } from "./my-forums.types";

interface CreateCommunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (community: MyCommunityItem) => void;
}

const CATEGORIES = ["Teknologi", "Akademik", "Kuliner", "Desain", "Hobi", "Umum"] as const;

const AVATAR_COLORS = [
  "bg-[#EA5753]",
  "bg-[#0A3AB5]",
  "bg-[#7C3AED]",
  "bg-[#059669]",
  "bg-[#D97706]",
  "bg-[#E11D48]",
];

export default function CreateCommunityDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateCommunityDialogProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<MyCommunityItem["category"]>("Teknologi");
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[0]);
  const [success, setSuccess] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    // Auto-generate slug
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 24);
    setSlug(generatedSlug);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCommunity: MyCommunityItem = {
      id: Date.now(),
      name: name.trim(),
      slug: slug || "komunitas-baru",
      description:
        description.trim() ||
        "Komunitas ruang diskusi dan kolaborasi mahasiswa Telkom University.",
      category,
      membersCount: "1 Anggota",
      discussionsCount: "0 Postingan",
      role: "Pembuat",
      isPrivate,
      avatarColor: selectedColor,
      avatarInitial: (name.trim().charAt(0) || "K").toUpperCase(),
      lastActive: "Baru saja",
      isFollowing: true,
    };

    onCreate(newCommunity);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onOpenChange(false);
      // Reset form
      setName("");
      setSlug("");
      setDescription("");
    }, 700);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-6">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl font-bold font-sans flex items-center gap-2">
            <Plus className="w-5 h-5 text-[var(--primary)]" />
            <span>Buat Komunitas Baru</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-[var(--muted)]">
            Bangun ruang diskusi dan wadah kolaborasi pengetahuan baru bagi sivitas akademika Telkom University.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          {/* Avatar Color & Initial Preview */}
          <div className="flex items-center gap-4 p-3 rounded-xl bg-[var(--background-accent)]/50 border border-[var(--dust)]/40">
            <div
              className={`w-14 h-14 rounded-xl ${selectedColor} text-white font-bold text-2xl flex items-center justify-center shadow-xs shrink-0`}
            >
              {(name.trim().charAt(0) || "T").toUpperCase()}
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <span className="text-xs font-semibold text-[var(--foreground)]">
                Pilih Warna Ikon Komunitas:
              </span>
              <div className="flex items-center gap-2">
                {AVATAR_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`w-6 h-6 rounded-full ${c} transition-all ${
                      selectedColor === c ? "ring-2 ring-[var(--foreground)] scale-110" : "hover:scale-105"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Nama Komunitas */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--foreground)]">
              Nama Komunitas <span className="text-[var(--failed)]">*</span>
            </label>
            <Input
              value={name}
              onChange={handleNameChange}
              placeholder="Contoh: Game Dev +++, Kuliner Telkom Bandung..."
              required
              className="h-10 text-sm"
            />
          </div>

          {/* Handle / Slug */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--foreground)]">
              Tautan / Handle Komunitas
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-xs font-semibold text-[var(--muted)]">
                t/
              </span>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="nama-komunitas"
                className="h-10 text-sm pl-7 font-mono"
              />
            </div>
          </div>

          {/* Kategori */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--foreground)]">
              Kategori Komunitas
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    category === cat
                      ? "bg-[var(--primary)] text-white font-semibold"
                      : "bg-[var(--background-accent)] text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Deskripsi */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--foreground)]">
              Deskripsi Singkat
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Jelaskan topik yang dibahas dan tujuan komunitas ini..."
              className="w-full text-xs p-3 rounded-lg border border-[var(--dust)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] resize-none"
            />
          </div>

          {/* Visibilitas */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => setIsPrivate(false)}
              className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                !isPrivate
                  ? "border-[var(--primary)] bg-[var(--primary-soft)]/20"
                  : "border-[var(--dust)] hover:bg-[var(--background-accent)]/50"
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs text-[var(--foreground)]">
                <Globe className="w-4 h-4 text-[var(--primary)]" />
                <span>Publik</span>
              </div>
              <p className="text-[11px] text-[var(--muted)]">
                Siapa saja di Tel-U dapat melihat & bergabung
              </p>
            </button>

            <button
              type="button"
              onClick={() => setIsPrivate(true)}
              className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                isPrivate
                  ? "border-[var(--primary)] bg-[var(--primary-soft)]/20"
                  : "border-[var(--dust)] hover:bg-[var(--background-accent)]/50"
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs text-[var(--foreground)]">
                <Lock className="w-4 h-4 text-[var(--primary)]" />
                <span>Privat</span>
              </div>
              <p className="text-[11px] text-[var(--muted)]">
                Perlu persetujuan moderator untuk bergabung
              </p>
            </button>
          </div>

          {/* Success notice */}
          {success && (
            <div className="p-3 bg-[var(--success-soft)] border border-[var(--success)]/30 rounded-lg flex items-center gap-2 text-xs font-semibold text-[var(--success-text)]">
              <Check className="w-4 h-4 text-[var(--success)]" />
              <span>Komunitas berhasil dibuat!</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--dust)]">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-xs font-semibold text-[var(--muted)]"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={!name.trim()}
              className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold px-4 h-9 rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>Buat Komunitas</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

