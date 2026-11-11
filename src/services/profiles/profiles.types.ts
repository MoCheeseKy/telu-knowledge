/**
 * Kontrak data profil pengguna (mock server: profiles).
 * Ditulis manual karena endpoint mock belum tercakup OpenAPI schema backend.
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

export interface MyProfileData {
  profile: ProfileDto;
}
