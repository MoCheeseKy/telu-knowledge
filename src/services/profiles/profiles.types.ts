/**
 * Kontrak data profil pengguna (mock server: profiles, karena endpoint belum
 * tercakup OpenAPI schema backend).
 */
export interface ProfileDto {
  id: string;
  username: string | null;
  displayName: string;
  avatarUrl: string | null;
  /** Hex warna latar avatar (mis. "#0A3AB5") — dirender via inline style. */
  avatarColor: string;
  bannerUrl: string | null;
  bio: string;
  faculty: string | null;
  major: string | null;
  generation: string | null;
  website: string | null;
  github: string | null;
  linkedin: string | null;
  showEmail: boolean;
  showCommunities: boolean;
  followersCount: number;
  followingCount: number;
  createdAt: string;
}

/**
 * Kontrak data ringkas pengguna pada daftar pengikut atau yang diikuti.
 */
export interface FollowUserDto {
  id: string;
  displayName: string;
  username: string | null;
  avatarUrl: string | null;
  avatarColor: string;
  bio: string;
  /** Apakah viewer (akun mock) mengikuti orang ini. */
  isFollowing: boolean;
  followedAt: string;
}

/**
 * Bentuk data respons endpoint profil milik sendiri.
 */
export interface MyProfileData {
  profile: ProfileDto;
}

/**
 * Patch parsial untuk memperbarui profil milik sendiri.
 * Field nullable (website/github/linkedin/avatarUrl/bannerUrl/faculty/major/
 * generation) memakai `null` eksplisit untuk mengosongkan.
 */
export interface UpdateProfilePayload {
  username?: string;
  displayName?: string;
  bio?: string;
  faculty?: string | null;
  major?: string | null;
  generation?: string | null;
  website?: string | null;
  github?: string | null;
  linkedin?: string | null;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  showEmail?: boolean;
  showCommunities?: boolean;
}
