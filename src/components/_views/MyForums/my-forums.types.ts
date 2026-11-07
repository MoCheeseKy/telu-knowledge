export interface MyCommunityItem {
  id: string | number;
  name: string;
  slug: string;
  description: string;
  category: "Teknologi" | "Akademik" | "Kuliner" | "Desain" | "Hobi" | "Umum";
  membersCount: string;
  discussionsCount: string;
  role: "Pembuat" | "Moderator" | "Anggota";
  isPrivate: boolean;
  avatarColor: string;
  avatarInitial: string;
  lastActive: string;
  isFollowing: boolean;
}

export interface MyForumPostItem {
  id: string | number;
  title: string;
  forumName: string;
  forumSlug: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  status: "Aktif" | "Pin" | "Terkunci";
}

export const initialCommunities: MyCommunityItem[] = [
  {
    id: 1,
    name: "Game Dev +++",
    slug: "gamedev",
    description: "Wadah bertukar pikiran seputar game engine, desain game, dan proyek indie mahasiswa Telkom University.",
    category: "Teknologi",
    membersCount: "128.000 Anggota",
    discussionsCount: "1.420 Postingan",
    role: "Moderator",
    isPrivate: false,
    avatarColor: "bg-[#EA5753]",
    avatarInitial: "G",
    lastActive: "10 menit lalu",
    isFollowing: true,
  },
  {
    id: 2,
    name: "Software Engineering Tel-U",
    slug: "se-telu",
    description: "Ruang diskusi arsitektur perangkat lunak, agile development, clean code, dan review proyek matkul.",
    category: "Akademik",
    membersCount: "95.000 Anggota",
    discussionsCount: "3.210 Postingan",
    role: "Pembuat",
    isPrivate: false,
    avatarColor: "bg-[#0A3AB5]",
    avatarInitial: "S",
    lastActive: "Baru saja",
    isFollowing: true,
  },
  {
    id: 3,
    name: "Kuliner Telkom Bandung",
    slug: "kuliner-telkom",
    description: "Rekomendasi tempat makan murah, enak, dan nyaman buat nongkrong atau nugas sekitaran Buah Batu & Dayeuhkolot.",
    category: "Kuliner",
    membersCount: "145.000 Anggota",
    discussionsCount: "4.890 Postingan",
    role: "Anggota",
    isPrivate: false,
    avatarColor: "bg-[#D97706]",
    avatarInitial: "K",
    lastActive: "35 menit lalu",
    isFollowing: true,
  },
  {
    id: 4,
    name: "UI/UX & Product Design",
    slug: "uiux-telu",
    description: "Bedah desain aplikasi, design system Figma, case study portofolio, dan usability testing.",
    category: "Desain",
    membersCount: "62.000 Anggota",
    discussionsCount: "890 Postingan",
    role: "Anggota",
    isPrivate: false,
    avatarColor: "bg-[#7C3AED]",
    avatarInitial: "U",
    lastActive: "2 jam lalu",
    isFollowing: true,
  },
  {
    id: 5,
    name: "Tugas Akhir & Riset Informatika",
    slug: "ta-informatika",
    description: "Grup diskusi bimbingan skripsi, pembagian dataset penelitian, tips sidang, dan jurnal bereputasi.",
    category: "Akademik",
    membersCount: "34.000 Anggota",
    discussionsCount: "1.150 Postingan",
    role: "Anggota",
    isPrivate: true,
    avatarColor: "bg-[#059669]",
    avatarInitial: "T",
    lastActive: "4 jam lalu",
    isFollowing: true,
  },
  {
    id: 6,
    name: "Persona & JRPG Club",
    slug: "jrpg-telu",
    description: "Klub pecinta game JRPG, soundtrack games, analisis lore, dan speedrun.",
    category: "Hobi",
    membersCount: "18.500 Anggota",
    discussionsCount: "540 Postingan",
    role: "Moderator",
    isPrivate: false,
    avatarColor: "bg-[#E11D48]",
    avatarInitial: "P",
    lastActive: "1 hari lalu",
    isFollowing: true,
  },
];

export const initialMyPosts: MyForumPostItem[] = [
  {
    id: 1,
    title: "Game Persona 5 Rilis yang Baru? Tinjauan Game Design dan Nilai Filosofis",
    forumName: "Game Dev +++",
    forumSlug: "gamedev",
    createdAt: "12 September 2026",
    likesCount: 428,
    commentsCount: 18,
    status: "Aktif",
  },
  {
    id: 2,
    title: "Apakah C4 Architecture Diagram Lebih Efektif Dibanding UML Konvensional untuk Tugas Besar?",
    forumName: "Software Engineering Tel-U",
    forumSlug: "se-telu",
    createdAt: "8 September 2026",
    likesCount: 312,
    commentsCount: 45,
    status: "Pin",
  },
  {
    id: 3,
    title: "Rekomendasi Kafe 24 Jam dengan Wi-Fi Kencang di Sekitar Sukabirus Buat Nugas Bareng",
    forumName: "Kuliner Telkom Bandung",
    forumSlug: "kuliner-telkom",
    createdAt: "2 September 2026",
    likesCount: 189,
    commentsCount: 34,
    status: "Aktif",
  },
];

