export interface ForumComment {
  id: string | number;
  author: {
    name: string;
    avatarUrl?: string;
    initial: string;
    badge?: string;
    department?: string;
  };
  createdAt: string;
  content: string;
  score: number;
  userVote: 1 | -1 | 0;
  replies?: ForumComment[];
}

export interface ForumPostDetail {
  id: string | number;
  title: string;
  topic: string;
  communitySlug: string;
  communityMembers: string;
  communityOnline: string;
  communityDesc: string;
  communityRules: string[];
  publisher: {
    name: string;
    avatarUrl?: string;
    initial: string;
    role: string;
    department: string;
  };
  postDate: string;
  content: string[];
  callout?: string;
  imageUrl?: string;
  imageAlt?: string;
  imageCaption?: string;
  tags: string[];
  score: number;
  userVote: 1 | -1 | 0;
  commentsCount: number;
  repostsCount: number;
  isSaved: boolean;
  comments: ForumComment[];
}

export const sampleForumPost: ForumPostDetail = {
  id: 1,
  title: "Game Persona 5 Rilis yang Baru? Tinjauan Game Design dan Nilai Filosofis",
  topic: "Game Dev +++",
  communitySlug: "gamedev",
  communityMembers: "128.000 Anggota",
  communityOnline: "840 Online Sekarang",
  communityDesc: "Komunitas pengembang, desainer game, dan pengamat industri game mahasiswa Telkom University.",
  communityRules: [
    "Jaga etika, kesopanan, dan sportivitas akademik",
    "Gunakan spoiler tag untuk plot game terbaru",
    "Fokus pada analisis game design, mekanik, dan pengalaman pemain",
    "Dilarang menyebarkan materi bajakan atau link berbahaya",
  ],
  publisher: {
    name: "Rifky Muhammad Prayudhi",
    initial: "R",
    role: "Mahasiswa Informatika",
    department: "S1 Informatika '21",
  },
  postDate: "12 September 2026 (2 jam yang lalu)",
  content: [
    "Halo teman-teman pengembang dan penikmat game di Tel-U! Kemarin sempat ramai perbincangan di kalangan komunitas mengenai kelanjutan franchise Persona dan adaptasi terbarunya.",
    "Dari kacamata Game Design dan UI/UX, Persona selalu menjadi benchmark luar biasa dalam menerapkan typography dinamis, transisi screen yang snappy, dan integrasi soundtrack acid jazz yang menyatu erat dengan gameplay loop sehari-hari (daily life simulation vs dungeon crawling).",
    "Pertanyaan reflektif untuk rekan-rekan di Fakultas Informatika dan Desain Komunikasi Visual:",
    "1. Apakah pendekatan UI yang highly stylized seperti ini masih efektif untuk game modern berdurasi 100+ jam, atau justru rentan memicu cognitive overload bagi pemain baru?\n2. Bagaimana menurut kalian relevansi arsitektur state machine yang mereka gunakan jika kita terapkan dalam proyek Tugas Akhir atau game jam kampus?",
    "Yuk diskusikan di kolom komentar bawah! Sangat terbuka untuk ide kolaborasi game jam semester ini."
  ],
  callout: "Catatan: UI Persona 5 membuktikan bahwa interface bukan sekadar penunjuk status, melainkan elemen kunci dalam 'world-building' dan identitas emosional pemain.",
  imageUrl: "/images/persona-c4.jpg",
  imageAlt: "Persona 5 Game Review Showcase",
  imageCaption: "Visualisasi estetika interface dan palet warna kontras Persona 5 — referensi desain UI.",
  tags: ["GameDev", "GameDesign", "Persona5", "TelUKnowledge", "UIUX"],
  score: 428,
  userVote: 0,
  commentsCount: 0,
  repostsCount: 54,
  isSaved: false,
  comments: [],
};

