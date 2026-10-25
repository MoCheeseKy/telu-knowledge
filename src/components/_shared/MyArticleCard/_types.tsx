export interface MyArticleItem {
    id?: string | number;
    title: string;
    description: string;
    readTime: string;
    updatedAt: string;
    imageUrl?: string;
}

export interface MyArticleCardProps {
    title: string;
    description: string;
    readTime: string;
    updatedAt: string;
    imageUrl?: string;
    className?: string;
    onMoreClick?: () => void;
}

export const dummyDraftArticles: MyArticleItem[] = [
    {
        id: 1,
        title: "Draft 1: Belajar Next.js",
        description: "Masih dalam proses penulisan...",
        readTime: "Bacaan 1 menit",
        updatedAt: "Baru saja",
    },
    {
        id: 2,
        title: "Cara Mengerjakan Praktikum Mopro Cepat",
        description: "Tanpa menggunakan AI",
        readTime: "Bacaan 3 menit",
        updatedAt: "Baru saja",
    },
    {
        id: 3,
        title: "Slicing UI dari Figma ke Tailwind CSS dengan Presisi",
        description: "Tips menyamakan padding, font, dan warna agar tampilan web sesuai desain...",
        readTime: "Bacaan 4 menit",
        updatedAt: "2 jam lalu",
    },
    {
        id: 4,
        title: "Catatan Kuliah: Perbedaan Algoritma BFS dan DFS",
        description: "Rangkuman materi struktur data untuk persiapan kuis minggu depan...",
        readTime: "Bacaan 5 menit",
        updatedAt: "Kemarin",
    },
    {
        id: 5,
        title: "Review Library shadcn/ui: Kelebihan dan Kekurangan",
        description: "Kenapa banyak developer beralih menggunakan shadcn dibanding Bootstrap...",
        readTime: "Bacaan 2 menit",
        updatedAt: "3 hari lalu",
    },
    {
        id: 6,
        title: "Mempersiapkan Portofolio Magang Frontend Developer",
        description: "Daftar project kuliah semester 5 yang layak dipajang di LinkedIn dan GitHub...",
        readTime: "Bacaan 6 menit",
        updatedAt: "5 hari lalu",
    },
    {
        id: 7,
        title: "Setup Git Workflow Tim yang Rapi Tanpa Takut Konflik",
        description: "Panduan branching, commit message, dan membuat pull request yang benar...",
        readTime: "Bacaan 3 menit",
        updatedAt: "1 minggu lalu",
    },

];
// Data khusus Tab Terjadwal
export const dummyScheduledArticles: MyArticleItem[] = [
    {
        id: 1,
        title: "Artikel Terjadwal: Tips Tubes Webpro",
        description: "Artikel ini akan tayang otomatis besok pagi jam 08.00...",
        readTime: "Bacaan 3 menit",
        updatedAt: "Terjadwal 26 Oktober 2026",
    },
];
// Data khusus Tab Diterbitkan
export const dummyPublishedArticles: MyArticleItem[] = [
    {
        id: 3,
        title: "Artikel Diterbitkan: Pengenalan TypeScript",
        description: "Artikel ini sudah bisa dibaca oleh semua orang di kampus...",
        readTime: "Bacaan 5 menit",
        updatedAt: "Dipublikasikan 12 Oktober 2026",
    },
];
