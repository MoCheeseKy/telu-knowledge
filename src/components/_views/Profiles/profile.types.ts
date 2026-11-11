import type { ProfileDto } from "@/services/profiles/profiles.types";

export interface UserProfile {
  username: string;
  fullName: string;
  avatarUrl?: string;
  avatarInitial: string;
  /** Hex warna latar avatar (mis. "#0A3AB5") — dirender via inline style. */
  avatarColor?: string;
  bannerUrl?: string;
  bio: string;
  faculty: string;
  major: string;
  studentId: string;
  generation: string;
  followersCount: number;
  followingCount: number;
  website?: string;
  github?: string;
  linkedin?: string;
  showEmail: boolean;
  showCommunities: boolean;
}

/**
 * Angka pengikut/mengikuti masih STATIS (contoh) — fitur follow belum
 * diintegrasikan dan sengaja tidak mengambil dari mock (di luar cakupan,
 * lihat docs/integrasi-profil/README.md). Sama perlakuannya dengan tab
 * Reposts/koleksi yang tetap memakai data contoh.
 */
export const SAMPLE_FOLLOW_STATS = {
  followersCount: 142,
  followingCount: 89,
} as const;

/**
 * Mengubah ProfileDto (mock server) menjadi UserProfile tampilan.
 * Field yang tidak tersedia/di luar cakupan integrasi diberi nilai
 * kosong/netral atau tetap statis (contoh).
 */
export function mapProfileDtoToUserProfile(dto: ProfileDto): UserProfile {
  const displayName = dto.displayName ?? "";
  const username = dto.username ?? "";

  return {
    username,
    fullName: displayName,
    avatarUrl: dto.avatarUrl ?? undefined,
    avatarInitial: (displayName || username || "U").charAt(0).toUpperCase(),
    avatarColor: dto.avatarColor ?? "#0A3AB5",
    bannerUrl: dto.bannerUrl ?? undefined,
    bio: dto.bio ?? "",
    faculty: dto.faculty ?? "",
    major: dto.major ?? "",
    studentId: "",
    generation: dto.generation ?? "",
    // Pengikut/mengikuti TIDAK diintegrasikan (di luar cakupan) — statis
    followersCount: SAMPLE_FOLLOW_STATS.followersCount,
    followingCount: SAMPLE_FOLLOW_STATS.followingCount,
    website: dto.website ?? undefined,
    github: dto.github ?? undefined,
    linkedin: dto.linkedin ?? undefined,
    showEmail: dto.showEmail ?? false,
    showCommunities: dto.showCommunities ?? true,
  };
}

export const defaultProfile: UserProfile = {
  username: "sofiamnhrk",
  fullName: "Sofia Manar",
  avatarInitial: "S",
  avatarColor: "#0A3AB5",
  bannerUrl: "/images/persona-c4.jpg",
  bio: "Software Engineering student @ Telkom University. Ingin Jadi Programmer Handal, Namun enggan Ngoding",
  faculty: "Fakultas Informatika",
  major: "S1 Software Engineering",
  studentId: "1301213045",
  generation: "2021",
  followersCount: 142,
  followingCount: 89,
  website: "https://sofiamnhrk.dev",
  github: "https://github.com/sofiamnhrk",
  linkedin: "https://linkedin.com/in/sofiamnhrk",
  showEmail: true,
  showCommunities: true,
};

