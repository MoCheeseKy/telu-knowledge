"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, Globe } from "lucide-react";
import { useProfile } from "./profile.context";
import EditProfileDialog from "./EditProfileDialog";

const communities = [
  { id: 1, name: "Game Dev +++", desc: "Cari Kulineran Telkom yang wa...", members: "128.000 Anggota" },
  { id: 2, name: "Kuliner Telkom", desc: "Cari Kulineran Telkom yang wa...", members: "128.000 Anggota" },
  { id: 3, name: "Software Eng.", desc: "Ruang diskusi rekayasa perangkat lunak...", members: "95.000 Anggota" },
  { id: 4, name: "Desain Grafis", desc: "Komunitas desain & multimedia...", members: "64.000 Anggota" },
];

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 0 0 1.64-1.64c0-.91-.73-1.64-1.64-1.64a1.64 1.64 0 0 0-1.64 1.64c0 .91.73 1.64 1.64 1.64m1.39 9.74v-8.37H5.07v8.37h2.78z" />
    </svg>
  );
}

export default function ProfileSidebar() {
  const { profile, isEditDialogOpen, setIsEditDialogOpen } = useProfile();
  const [followingStates, setFollowingStates] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
  });

  const toggleFollow = (id: number) => {
    setFollowingStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <aside className="w-full lg:w-72 lg:shrink-0 lg:border-l lg:border-[var(--dust)]/60 lg:pl-8">
        {/* Avatar */}
        <div className="mb-4 relative">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.fullName}
              className="size-20 rounded-full object-cover shadow-sm border-2 border-[var(--background)]"
            />
          ) : (
            <div
              className="size-20 flex items-center justify-center rounded-full text-3xl font-bold text-white shadow-sm"
              style={{ backgroundColor: profile.avatarColor || "#0A3AB5" }}
            >
              {profile.avatarInitial || "S"}
            </div>
          )}
        </div>

        {/* Identity */}
        <h2 className="font-semibold text-base text-[var(--foreground)] leading-tight">
          {profile.fullName || profile.username}
        </h2>
        <p className="text-xs text-[var(--muted)] font-mono mb-1">
          @{profile.username}
        </p>

        {/* Followers / Following */}
        <p className="mb-3 text-xs text-[var(--muted)]">
          <span className="font-semibold text-[var(--foreground)]">{profile.followersCount}</span> Pengikut ·{" "}
          <span className="font-semibold text-[var(--foreground)]">{profile.followingCount}</span> Mengikuti
        </p>

        {/* Bio */}
        <p className="mb-4 text-xs text-[var(--foreground)]/80 leading-relaxed">
          {profile.bio}
        </p>

        {/* Akademik Info jika diisi */}
        {(profile.faculty || profile.major) && (
          <div className="mb-4 p-2.5 rounded-lg bg-[var(--background-accent)]/60 text-[11px] text-[var(--muted)] flex flex-col gap-1 border border-[var(--dust)]/40">
            {profile.major && <span className="font-medium text-[var(--foreground)]">{profile.major}</span>}
            {profile.faculty && <span>{profile.faculty}</span>}
            {profile.generation && <span>Angkatan {profile.generation}</span>}
          </div>
        )}

        {/* Social / External links */}
        {(profile.website || profile.github || profile.linkedin) && (
          <div className="mb-4 flex items-center gap-2 text-[var(--muted)]">
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noreferrer"
                className="p-1 hover:text-[var(--primary)] transition-colors"
                title={profile.website}
              >
                <Globe className="w-3.5 h-3.5" />
              </a>
            )}
            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="p-1 hover:text-[var(--foreground)] transition-colors"
                title={profile.github}
              >
                <GithubIcon className="w-3.5 h-3.5" />
              </a>
            )}
            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-1 hover:text-[#0A66C2] transition-colors"
                title={profile.linkedin}
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}

        {/* Action Link: Edit profile */}
        <div className="flex items-center gap-2 mb-6">
          <button
            type="button"
            onClick={() => setIsEditDialogOpen(true)}
            className="text-xs font-semibold text-green-700 hover:text-green-800 transition-colors cursor-pointer hover:underline text-left"
          >
            Edit profile
          </button>
          <span className="text-[var(--dust)]">•</span>
          <Link
            href="/profile/edit"
            className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            title="Buka halaman penuh Ubah Profil"
          >
            Halaman Penuh
          </Link>
        </div>

        {/* Komunitas Aktif */}
        {profile.showCommunities && (
          <div className="border-t border-[var(--dust)] pt-6">
            <h3 className="mb-4 text-xs font-bold text-[var(--primary-text)] uppercase tracking-wider">
              KOMUNITAS AKTIF
            </h3>

            <div className="flex flex-col gap-4">
              {communities.map((item) => {
                const isFollowing = followingStates[item.id];
                return (
                  <div key={item.id} className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/discussion-forums?community=${encodeURIComponent(item.name)}`}
                        className="text-xs font-semibold text-[var(--foreground)] hover:text-[var(--primary-text)] transition-colors block truncate"
                      >
                        {item.name}
                      </Link>
                      <p className="truncate text-[11px] text-[var(--muted)]">{item.desc}</p>
                      <p className="text-[10px] text-[var(--muted)]/80 mt-0.5">{item.members}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleFollow(item.id)}
                      className={`shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded transition-colors cursor-pointer ${
                        isFollowing
                          ? "bg-[var(--background-accent)] text-[var(--foreground)] hover:bg-[var(--dust)]/50"
                          : "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
                      }`}
                    >
                      {isFollowing ? "Mengikuti" : "+ Ikuti"}
                    </button>
                  </div>
                );
              })}
            </div>

            <Link
              href="/discovers-forums"
              className="mt-6 flex items-center gap-1 text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors group cursor-pointer"
            >
              <span>Lihat semua komunitas yang diikuti</span>
              <ChevronRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        )}
      </aside>

      {/* Edit Profile Dialog Modal */}
      <EditProfileDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </>
  );
}
