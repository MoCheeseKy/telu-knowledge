"use client";

import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, ImagePlus, Plus, Trash2 } from "lucide-react";
import { useCreateCommunity } from "@/services/community-posts/community-posts.queries";
import { CommunityRuleInput, MyCommunityItem } from "./my-forums.types";

interface CreateCommunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (community: MyCommunityItem) => void;
}

const CATEGORIES = [
  "Teknologi",
  "Akademik",
  "Kuliner",
  "Desain",
  "Hobi",
  "Umum",
] as const;

const AVATAR_COLORS = [
  "bg-[#EA5753]",
  "bg-[#0A3AB5]",
  "bg-[#7C3AED]",
  "bg-[#059669]",
  "bg-[#D97706]",
  "bg-[#E11D48]",
];

interface RuleDraft {
  title: string;
  description: string;
}

export default function CreateCommunityDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateCommunityDialogProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const createCommunityMutation = useCreateCommunity();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] =
    useState<MyCommunityItem["category"]>("Teknologi");
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[0]);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [rules, setRules] = useState<RuleDraft[]>([
    { title: "", description: "" },
  ]);
  const [success, setSuccess] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatarUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddRule = () => {
    setRules((prev) => [...prev, { title: "", description: "" }]);
  };

  const handleRemoveRule = (index: number) => {
    setRules((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRuleChange = (
    index: number,
    field: keyof RuleDraft,
    value: string
  ) => {
    setRules((prev) =>
      prev.map((rule, i) => (i === index ? { ...rule, [field]: value } : rule))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !avatarUrl) return;

    const generatedSlug =
      name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 24) || "forum-baru";

    const normalizedRules: CommunityRuleInput[] = rules
      .filter((r) => r.title.trim().length > 0)
      .map((r, idx) => ({
        id: idx + 1,
        title: r.title.trim(),
        description: r.description.trim(),
      }));

    const newCommunity: MyCommunityItem = {
      id: Date.now(),
      name: name.trim(),
      slug: generatedSlug,
      description:
        description.trim() ||
        "Forum ruang diskusi dan kolaborasi mahasiswa Telkom University.",
      category,
      membersCount: "1 Anggota",
      discussionsCount: "0 Postingan",
      role: "Pembuat",
      isPrivate: false,
      avatarUrl,
      avatarColor: selectedColor,
      avatarInitial: (name.trim().charAt(0) || "K").toUpperCase(),
      rules: normalizedRules,
      lastActive: "Baru saja",
      isFollowing: true,
    };

    onCreate(newCommunity);
    createCommunityMutation.mutate({
      name: newCommunity.name,
      description: newCommunity.description,
      category: newCommunity.category,
      avatarColor: selectedColor,
      bannerUrl: avatarUrl,
    });
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onOpenChange(false);
      setName("");
      setDescription("");
      setAvatarUrl(undefined);
      setRules([{ title: "", description: "" }]);
    }, 700);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl font-bold font-sans flex items-center gap-2">
            <Plus className="w-5 h-5 text-[var(--primary)]" />
            <span>Buat Forum Baru</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-[var(--muted)]">
            Bangun ruang diskusi dan wadah kolaborasi pengetahuan baru bagi
            sivitas akademika Telkom University.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="flex items-center gap-4 p-3 rounded-xl bg-[var(--background-accent)]/50 border border-[var(--dust)]/40">
            <div
              className={`w-14 h-14 rounded-xl ${selectedColor} text-white font-bold text-2xl flex items-center justify-center shadow-xs shrink-0`}
            >
              {(name.trim().charAt(0) || "T").toUpperCase()}
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-[var(--foreground)]">
                Pilih Warna Ikon Forum:
              </span>
              <div className="flex items-center gap-2">
                {AVATAR_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`w-6 h-6 rounded-full ${c} transition-all cursor-pointer ${
                      selectedColor === c
                        ? "ring-2 ring-[var(--foreground)] scale-110"
                        : "hover:scale-105"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--foreground)]">
              Foto Profil Forum <span className="text-[var(--failed)]">*</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleAvatarChange}
              className="hidden"
              aria-label="Unggah foto profil forum"
            />
            {avatarUrl ? (
              <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-[var(--dust)] bg-[var(--background-accent)]/30">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={avatarUrl}
                    alt="Pratinjau foto profil forum"
                    className="w-12 h-12 rounded-full object-cover border border-[var(--dust)] shrink-0"
                  />
                  <span className="text-xs font-medium text-[var(--foreground)] truncate">
                    Foto profil berhasil dipilih
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[var(--dust)] bg-white px-2.5 text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--background-accent)] transition-colors cursor-pointer"
                  >
                    Ganti Foto
                  </button>
                  <button
                    type="button"
                    onClick={() => setAvatarUrl(undefined)}
                    className="inline-flex h-8 items-center rounded-md px-2 text-xs font-semibold text-[var(--failed)] hover:bg-[var(--failed-soft)] transition-colors cursor-pointer"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-1.5 w-full py-5 px-4 rounded-xl border border-dashed border-[var(--dust)] bg-[var(--background-accent)]/30 hover:bg-[var(--background-accent)]/60 transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center">
                  <ImagePlus className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[var(--foreground)]">
                  Unggah Foto Profil Forum
                </span>
                <span className="text-[11px] text-[var(--muted)]">
                  Format PNG, JPEG, WEBP, atau GIF
                </span>
              </button>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--foreground)]">
              Nama Forum <span className="text-[var(--failed)]">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Game Dev +++, Kuliner Telkom Bandung..."
              required
              className="h-10 text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--foreground)]">
              Kategori Forum
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

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--foreground)]">
              Deskripsi
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Jelaskan topik yang dibahas dan tujuan forum ini..."
              className="w-full text-xs p-3 rounded-lg border border-[var(--dust)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] resize-none"
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[var(--foreground)]">
                Aturan Forum
              </label>
              <button
                type="button"
                onClick={handleAddRule}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary-text)] hover:opacity-80 transition-opacity cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Aturan</span>
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {rules.map((rule, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 p-3 rounded-xl border border-[var(--dust)]/70 bg-[var(--background-accent)]/30"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-[var(--muted)]">
                      Aturan {index + 1}
                    </span>
                    {rules.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRule(index)}
                        className="text-[var(--muted)] hover:text-[var(--failed)] transition-colors cursor-pointer"
                        aria-label={`Hapus aturan ${index + 1}`}
                        title="Hapus aturan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <Input
                    value={rule.title}
                    onChange={(e) =>
                      handleRuleChange(index, "title", e.target.value)
                    }
                    placeholder="Judul aturan (contoh: Gunakan bahasa yang sopan)"
                    className="h-9 text-xs bg-[var(--background)]"
                  />

                  <textarea
                    value={rule.description}
                    onChange={(e) =>
                      handleRuleChange(index, "description", e.target.value)
                    }
                    rows={2}
                    placeholder="Penjelasan aturan..."
                    className="w-full text-xs p-2.5 rounded-lg border border-[var(--dust)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] resize-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {success && (
            <div className="p-3 bg-[var(--success-soft)] border border-[var(--success)]/30 rounded-lg flex items-center gap-2 text-xs font-semibold text-[var(--success-text)]">
              <Check className="w-4 h-4 text-[var(--success)]" />
              <span>Forum berhasil dibuat!</span>
            </div>
          )}

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
              disabled={!name.trim() || !avatarUrl}
              className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold px-4 h-9 rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>Buat Forum</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

