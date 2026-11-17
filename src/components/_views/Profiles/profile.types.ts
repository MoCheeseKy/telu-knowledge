import type {
  ProfileDto,
  UpdateProfilePayload,
} from "@/services/profiles/profiles.types";

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

export interface ProfileContextType {
  profile: UserProfile;
  /**
   * Menyimpan pembaruan profil secara persisten ke mock server
   * (PATCH /proxy/profiles/me). Melempar error bila gagal — pemanggil
   * (form) menampilkannya lewat FormAlert.
   */
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>;
  isLoading: boolean;
  isError: boolean;
  refetchProfile: () => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
}

export interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface EditProfileFormProps {
  initialData: UserProfile;
  onSave: (payload: UpdateProfilePayload) => void | Promise<void>;
  onCancel?: () => void;
}

export type FollowTab = "followers" | "following";

export interface FollowListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tab: FollowTab;
  onTabChange: (tab: FollowTab) => void;
}

export const SAMPLE_FOLLOW_STATS = (
  dto: Pick<ProfileDto, "followersCount" | "followingCount">
) => ({
  followersCount: dto.followersCount ?? 0,
  followingCount: dto.followingCount ?? 0,
}) as const;

/**
 * Mengubah ProfileDto (mock server) menjadi UserProfile tampilan.
 * Field yang tidak tersedia/di luar cakupan integrasi diberi nilai
 * kosong/netral atau tetap statis (contoh).
 */
export function mapProfileDtoToUserProfile(dto: ProfileDto): UserProfile {
  const displayName = dto.displayName ?? "";
  const username = dto.username ?? "";
  const followStats = SAMPLE_FOLLOW_STATS(dto);

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
    followersCount: followStats.followersCount,
    followingCount: followStats.followingCount,
    website: dto.website ?? undefined,
    github: dto.github ?? undefined,
    linkedin: dto.linkedin ?? undefined,
    showEmail: dto.showEmail ?? false,
    showCommunities: dto.showCommunities ?? true,
  };
}

/**
 * Mengubah UserProfile tampilan menjadi UpdateProfilePayload (DTO PATCH).
 * Hanya field yang ada pada `input` yang disertakan; string kosong pada field
 * nullable dikirim `null` (berarti dikosongkan).
 */
export function mapUserProfileToUpdatePayload(
  input: Partial<UserProfile>
): UpdateProfilePayload {
  const payload: UpdateProfilePayload = {};

  if ("username" in input) payload.username = (input.username ?? "").trim();
  if ("fullName" in input) payload.displayName = (input.fullName ?? "").trim();
  if ("bio" in input) payload.bio = input.bio ?? "";
  if ("faculty" in input) payload.faculty = (input.faculty ?? "").trim() || null;
  if ("major" in input) payload.major = (input.major ?? "").trim() || null;
  if ("generation" in input) {
    payload.generation = (input.generation ?? "").trim() || null;
  }
  if ("website" in input) payload.website = input.website?.trim() || null;
  if ("github" in input) payload.github = input.github?.trim() || null;
  if ("linkedin" in input) payload.linkedin = input.linkedin?.trim() || null;
  if ("avatarUrl" in input) payload.avatarUrl = input.avatarUrl || null;
  if ("bannerUrl" in input) payload.bannerUrl = input.bannerUrl || null;
  if ("showEmail" in input) payload.showEmail = Boolean(input.showEmail);
  if ("showCommunities" in input) {
    payload.showCommunities = Boolean(input.showCommunities);
  }

  return payload;
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

