export type ArticleStatus = "draft" | "terjadwal" | "diterbitkan" | "tidak_publik";

export interface MyArticleItem {
    id: string | number;
    title: string;
    description: string;
    readTime: string;
    updatedAt: string;
    imageUrl?: string;
    status: ArticleStatus;
    category?: string;
}

export interface MyArticleCardProps {
    id?: string | number;
    title: string;
    description: string;
    readTime: string;
    updatedAt: string;
    imageUrl?: string;
    status?: ArticleStatus;
    category?: string;
    className?: string;
    onMoreClick?: () => void;
    onDelete?: (id: string | number) => void;
}

export const initialArticles: MyArticleItem[] = [
    {
        id: 1,
        title: "Slicing UI dari Figma ke Tailwind CSS dengan Presisi",
        description: "Tips menyamakan padding, font scale, dan layouting responsif agar hasil implementasi persis desain Figma.",
        readTime: "Bacaan 4 menit",
        updatedAt: "Baru saja",
        status: "draft",
        category: "Frontend Web",
    },
    {
        id: 2,
        title: "Catatan Kuliah: Perbedaan Algoritma BFS dan DFS pada Graph",
        description: "Rangkuman mendalam materi Struktur Data & Algoritma untuk persiapan kuis dan tugas besar semester 5.",
        readTime: "Bacaan 5 menit",
        updatedAt: "2 jam lalu",
        status: "draft",
        category: "Struktur Data",
    },
    {
        id: 3,
        title: "Review Library shadcn/ui: Solusi Desain UI Modern dan Cepat",
        description: "Analisis kelebihan arsitektur shadcn/ui berbasis Tailwind dan Radix UI dibanding UI library konvensional.",
        readTime: "Bacaan 3 menit",
        updatedAt: "Kemarin",
        status: "draft",
        category: "Software Engineering",
    },
    {
        id: 4,
        title: "Tips Lolos Seleksi Asisten Praktikum Lab Informatika Tel-U",
        description: "Sharing pengalaman tes tulis, microteaching, dan wawancara laboratorium pemodelan dan komputasi.",
        readTime: "Bacaan 6 menit",
        updatedAt: "Terjadwal 30 Okt 2026",
        status: "terjadwal",
        category: "Tips Kampus",
    },
    {
        id: 5,
        title: "Strategi Sukses Presentasi Sidang Tubes Webpro & Mopro",
        description: "Poin-poin penilaian penting dosen penguji, tips demo interaktif, dan antisipasi tanya jawab teknis.",
        readTime: "Bacaan 4 menit",
        updatedAt: "Terjadwal 2 Nov 2026",
        status: "terjadwal",
        category: "Akademik",
    },
    {
        id: 6,
        title: "Pengenalan TypeScript: Menghindari Bug Runtime di Next.js",
        description: "Panduan praktis mengadopsi TypeScript, type safety pada props, dan pembuatan interface reusable.",
        readTime: "Bacaan 5 menit",
        updatedAt: "Dipublikasikan 12 Okt 2026",
        status: "diterbitkan",
        category: "Programming",
    },
    {
        id: 7,
        title: "Panduan Git Workflow untuk Proyek Tim Kolaboratif Tanpa Konflik",
        description: "Best practices branching DEV_Zulfan, PR review, dan penyelesaian merge conflict tanpa panik.",
        readTime: "Bacaan 7 menit",
        updatedAt: "Dipublikasikan 8 Okt 2026",
        status: "diterbitkan",
        category: "DevOps & Tools",
    },
];

export const dummyDraftArticles: MyArticleItem[] = initialArticles.filter(
    (item) => item.status === "draft"
);
export const dummyScheduledArticles: MyArticleItem[] = initialArticles.filter(
    (item) => item.status === "terjadwal"
);
export const dummyPublishedArticles: MyArticleItem[] = initialArticles.filter(
    (item) => item.status === "diterbitkan"
);
