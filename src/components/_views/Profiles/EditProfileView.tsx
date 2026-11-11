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
  const { profile, updateProfile } = useProfile();

  const handleSave = (updated: Partial<UserProfile>) => {
    updateProfile(updated);
  };

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

