export interface UserProfile {
  username: string;
  fullName: string;
  avatarUrl?: string;
  avatarInitial: string;
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

export const defaultProfile: UserProfile = {
  username: "sofiamnhrk",
  fullName: "Sofia Manar",
  avatarInitial: "S",
  avatarColor: "bg-[#0A3AB5]",
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

