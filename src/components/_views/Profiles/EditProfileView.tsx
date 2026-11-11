"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import EditProfileForm from "./EditProfileForm";
import { ProfileProvider, useProfile } from "./profile.context";
import { UserProfile } from "./profile.types";

function EditProfileContent() {
  const router = useRouter();
  const {
    profile,
    updateProfile,
    isLoading,
    isError,
    refetchProfile,
  } = useProfile();

  const handleSave = (updated: Partial<UserProfile>) => {
    updateProfile(updated);
  };

  if (isLoading) {
    return (
      <div
        className="w-full max-w-[679px] flex flex-col py-6 animate-pulse"
        aria-busy="true"
      >
        <div className="h-4 w-40 bg-[var(--dust)]/40 rounded mb-5" />
        <div className="h-9 w-48 bg-[var(--dust)]/40 rounded mb-3" />
        <div className="h-4 w-96 bg-[var(--dust)]/30 rounded mb-8" />
        <div className="h-16 w-16 rounded-full bg-[var(--dust)]/40 mb-6" />
        <div className="h-10 w-full bg-[var(--dust)]/30 rounded-lg mb-4" />
        <div className="h-10 w-full bg-[var(--dust)]/30 rounded-lg mb-4" />
        <div className="h-24 w-full bg-[var(--dust)]/30 rounded-lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full max-w-[679px] flex flex-col py-6">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-xs font-medium text-[var(--muted)] hover:text-[var(--primary-text)] transition-colors mb-5 w-fit cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Profil</span>
        </Link>
        <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[var(--dust)]/70 text-center">
          <p className="font-sans text-sm font-semibold text-[var(--foreground)]">
            Gagal memuat profil
          </p>
          <p className="font-sans text-[13px] text-[var(--muted)]">
            Pastikan mock server berjalan, lalu coba lagi.
          </p>
          <button
            type="button"
            onClick={refetchProfile}
            className="mt-2 inline-flex h-9 items-center rounded-lg border border-[var(--dust)] px-4 font-sans text-[13px] font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--background-accent)] cursor-pointer"
          >
            Coba lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[679px] flex flex-col py-6">
      {/* Tombol kembali ke profil */}
      <Link
        href="/profile"
        className="inline-flex items-center gap-2 text-xs font-medium text-[var(--muted)] hover:text-[var(--primary-text)] transition-colors mb-5 w-fit cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Kembali ke Profil</span>
      </Link>

      <div className="flex flex-col gap-2 mb-6">
        <h1 className="font-sans text-[32px] font-bold text-[var(--foreground)] leading-tight">
          Ubah Profil
        </h1>
        <p className="font-sans text-sm text-[var(--muted)] leading-relaxed">
          Kelola informasi publik, biodata, dan tautan portofolio akun Anda di Tel-U Knowledge.
        </p>
      </div>

      <div className="w-full border-b border-[var(--dust)]/40 mb-8" />

      <EditProfileForm
        initialData={profile}
        onSave={handleSave}
        onCancel={() => router.push("/profile")}
      />
    </div>
  );
}

export default function EditProfileView() {
  return (
    <ProfileProvider>
      <EditProfileContent />
    </ProfileProvider>
  );
}

