"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { UserProfile, mapUserProfileToUpdatePayload } from "./profile.types";
import { validateUpdateProfile } from "@/services/profiles/profiles.schemas";
import type { UpdateProfilePayload } from "@/services/profiles/profiles.types";
import { getErrorMessages } from "@/lib/api/error-messages";
import FormAlert from "@/components/_shared/FormAlert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import DeleteAccountSection from "./DeleteAccountSection";

const MAX_AVATAR_SIZE_BYTES = 4 * 1024 * 1024;

interface EditProfileFormProps {
  initialData: UserProfile;
  onSave: (payload: UpdateProfilePayload) => void | Promise<void>;
  onCancel?: () => void;
}

export default function EditProfileForm({
  initialData,
  onSave,
  onCancel,
}: EditProfileFormProps) {
  const [formData, setFormData] = useState<UserProfile>(initialData);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    initialData.avatarUrl
  );
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "fullName" || name === "username"
        ? { avatarInitial: (value || "U").charAt(0).toUpperCase() }
        : {}),
    }));
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setAvatarError(null);

    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      setAvatarError("Ukuran file terlalu besar. Maksimal ukuran file adalah 4MB.");
      return;
    }

    // Data URL (base64) — pola yang sama dengan cover postingan; unggah sungguhan
    // ke penyimpanan file menyusul (lihat docs/integrasi-profil/README.md).
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatarPreview(reader.result);
        setFormData((prev) => ({ ...prev, avatarUrl: reader.result as string }));
      }
    };
    reader.onerror = () => {
      setAvatarError("Gagal memuat foto profil. Silakan coba lagi.");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setSubmitError(null);

    const payload = mapUserProfileToUpdatePayload(formData);
    const validation = validateUpdateProfile(payload);
    if (!validation.success) {
      setSubmitError(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(validation.data);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        if (onCancel) onCancel();
      }, 700);
    } catch (error) {
      setSubmitError(getErrorMessages(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* 1. Foto Profil */}
      <div className="flex items-center gap-5">
        {avatarPreview ? (
          <img
            src={avatarPreview}
            alt={formData.fullName}
            className="w-16 h-16 rounded-full object-cover border border-[var(--dust)] shrink-0"
          />
        ) : (
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shrink-0"
            style={{ backgroundColor: formData.avatarColor || "#0A3AB5" }}
          >
            {formData.avatarInitial}
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-[var(--foreground)]">Foto Profil</span>
          <div className="flex items-center gap-2">
            <label className="h-7 px-3 text-xs font-semibold rounded-md border border-[var(--dust)] text-[var(--foreground)] hover:bg-[var(--background-accent)] inline-flex items-center justify-center cursor-pointer transition-colors">
              Unggah Foto
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarFileChange}
              />
            </label>
            {avatarPreview && (
              <button
                type="button"
                onClick={() => {
                  setAvatarPreview(undefined);
                  setFormData((prev) => ({ ...prev, avatarUrl: undefined }));
                }}
                className="text-xs text-[var(--failed)] hover:underline px-2 py-1 cursor-pointer"
              >
                Hapus
              </button>
            )}
          </div>
          <span className="text-[11px] text-[var(--muted)]">
            Foto persegi berformat JPG atau PNG (maks. 4MB).
          </span>
          {avatarError && (
            <p className="text-[11px] text-[var(--failed)]">{avatarError}</p>
          )}
        </div>
      </div>

      {/* 2. Nama Lengkap & Username */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[var(--foreground)]">
            Nama Lengkap <span className="text-[var(--failed)]">*</span>
          </label>
          <Input
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Nama Lengkap Anda"
            required
            className="h-10 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[var(--foreground)]">
            Username <span className="text-[var(--failed)]">*</span>
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-xs font-semibold text-[var(--muted)]">@</span>
            <Input
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="username"
              required
              className="h-10 text-sm pl-7 font-mono"
            />
          </div>
        </div>
      </div>

      {/* 3. Bio */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[var(--foreground)]">
            Bio
          </label>
          <span className="text-[11px] text-[var(--muted)]">
            {formData.bio.length}/160
          </span>
        </div>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          maxLength={160}
          rows={3}
          placeholder="Ceritakan sedikit tentang minat studi, keahlian, atau proyek Anda di Telkom University..."
          className="w-full text-sm p-3 rounded-lg border border-[var(--dust)] bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--foreground)] resize-none"
        />
      </div>

      {/* 4. Program Studi & Fakultas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[var(--foreground)]">
            Program Studi
          </label>
          <Input
            name="major"
            value={formData.major}
            onChange={handleInputChange}
            placeholder="Contoh: S1 Software Engineering"
            className="h-10 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[var(--foreground)]">
            Fakultas
          </label>
          <Input
            name="faculty"
            value={formData.faculty}
            onChange={handleInputChange}
            placeholder="Contoh: Fakultas Informatika"
            className="h-10 text-sm"
          />
        </div>
      </div>

      {/* 5. Tautan Eksternal */}
      <div className="flex flex-col gap-3 pt-4 border-t border-[var(--dust)]/40">
        <h3 className="font-sans text-[13px] font-bold uppercase text-[var(--primary-text)] tracking-wider">
          Tautan Eksternal & Portofolio
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-[var(--muted)]">Website</label>
            <Input
              name="website"
              value={formData.website || ""}
              onChange={handleInputChange}
              placeholder="https://domain.com"
              className="h-9 text-xs"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-[var(--muted)]">GitHub</label>
            <Input
              name="github"
              value={formData.github || ""}
              onChange={handleInputChange}
              placeholder="username atau link"
              className="h-9 text-xs"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-[var(--muted)]">LinkedIn</label>
            <Input
              name="linkedin"
              value={formData.linkedin || ""}
              onChange={handleInputChange}
              placeholder="username atau link"
              className="h-9 text-xs"
            />
          </div>
        </div>
      </div>

      {/* 6. Privasi */}
      <div className="pt-4 border-t border-[var(--dust)]/40">
        <Checkbox
          checked={formData.showCommunities}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, showCommunities: e.target.checked }))
          }
          label="Tampilkan daftar komunitas aktif yang saya ikuti di profil publik"
          className="text-xs font-medium"
        />
      </div>

      {/* Feedback banner */}
      {savedSuccess && (
        <div className="p-3 bg-[var(--success-soft)] border border-[var(--success)]/30 rounded-lg flex items-center gap-2 text-xs font-semibold text-[var(--success-text)]">
          <Check className="w-4 h-4 text-[var(--success)]" />
          <span>Profil berhasil diperbarui!</span>
        </div>
      )}

      {/* 7. Tombol Aksi */}
      <div className="flex flex-col gap-3 pt-4 border-t border-[var(--dust)]/40">
        {submitError && <FormAlert messages={submitError} />}

        <div className="flex items-center justify-end gap-3">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={isSubmitting}
              className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--foreground)] cursor-pointer"
            >
              Batal
            </Button>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}</span>
          </Button>
        </div>
      </div>

      {/* 8. Zona Berbahaya: Hapus Akun (soft delete — konten tetap tersimpan) */}
      <DeleteAccountSection />
    </form>
  );
}

