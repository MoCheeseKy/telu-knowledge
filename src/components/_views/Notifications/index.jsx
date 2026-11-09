"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ThumbsUp,
    MessageSquareMore,
    AtSign,
    UserPlus,
    Users,
    CheckCheck,
    BellOff,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// TODO: ganti dummy data ini dengan data dari API
// imageUrl opsional: thumbnail post/artikel di sisi kanan (seperti Reddit)
const dummyNotifications = [
    { id: 1, type: "comment", actor: "Rifky Muhammad Prayudhi", message: "Mengomentari artikelmu:", target: "Apakah C4 akan menggantikan Diagram Conventional saat ini?", time: "5 menit lalu", isRead: false, href: "/home", imageUrl: "/images/persona-c4.jpg" },
    { id: 2, type: "like", actor: "Aruna Jannu", message: "Menyukai postinganmu di", target: "Kuliner Telkom", time: "1 jam lalu", isRead: false, href: "/discussion-forums" },
    { id: 3, type: "mention", actor: "Dimas Pratama", message: "Menyebutmu di diskusi:", target: "Game Persona 5 Rilis yang Baru?", time: "3 jam lalu", isRead: false, href: "/discussion-forums", imageUrl: "/images/persona-c4.jpg" },
    { id: 4, type: "follow", actor: "Salsabila Putri", message: "Mulai mengikutimu", time: "Kemarin", isRead: true, href: "/profile" },
    { id: 5, type: "forum", actor: "Game Dev +++", message: "12 postingan baru di forum ini", time: "2 hari lalu", isRead: true, href: "/discussion-forums" },
    { id: 6, type: "like", actor: "Rifky Muhammad Prayudhi", message: "Menyukai artikelmu:", target: "Belajar Clean Architecture dengan ASP.NET Core", time: "3 hari lalu", isRead: true, href: "/my-articles", imageUrl: "/images/persona-c4.jpg" },
    { id: 7, type: "comment", actor: "Dimas Pratama", message: "Membalas komentarmu di", target: "Wisata Telkom", time: "5 hari lalu", isRead: true, href: "/discussion-forums" },
];

const typeIcon = {
    like: ThumbsUp,
    comment: MessageSquareMore,
    mention: AtSign,
    follow: UserPlus,
    forum: Users,
};

function NotificationRow({
    type,
    actor,
    avatarUrl,
    message,
    target,
    time,
    isRead = false,
    href = "#",
    imageUrl,
    onClick,
}) {
    const Icon = typeIcon[type];

    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                "relative flex items-center gap-3.5 px-4 py-4 select-none cursor-pointer transition-colors",
                isRead
                    ? "hover:bg-[var(--background-accent)]"
                    : "bg-[var(--primary-soft)]/40 hover:bg-[var(--primary-soft)]/70"
            )}
        >
            {!isRead && (
                <span
                    aria-label="Belum dibaca"
                    className="absolute left-1.5 top-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full bg-[var(--primary)]"
                />
            )}

            {/* Avatar bulat: foto, atau ikon tipe notifikasi */}
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt={actor}
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                />
            ) : (
                <div
                    aria-hidden="true"
                    className="w-10 h-10 rounded-full bg-[var(--primary-soft)] text-[var(--primary-text)] shrink-0 flex items-center justify-center"
                >
                    <Icon className="w-[18px] h-[18px]" />
                </div>
            )}

            {/* Teks: nama (16px semibold) > pesan (14px regular) > waktu (12px muted) */}
            <div className="flex flex-col gap-1 min-w-0 flex-1">
                <span className="font-sans text-[16px] font-semibold leading-tight text-[var(--foreground)] truncate">
                    {actor}
                </span>
                <p
                    title={target ? `${message} ${target}` : message}
                    className="font-sans text-[14px] font-normal leading-snug text-[var(--foreground)]/80 line-clamp-2"
                >
                    {message}
                    {target && (
                        <>
                            {" "}
                            <span className="font-medium text-[var(--foreground)]">
                                {target}
                            </span>
                        </>
                    )}
                </p>
                <span className="font-sans text-[12px] leading-none text-[var(--muted)]">
                    {time}
                </span>
            </div>

            {/* Thumbnail di kanan */}
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt=""
                    className="w-[84px] sm:w-[96px] aspect-[3/2] rounded-md object-cover shrink-0 bg-[var(--background-accent)] opacity-90"
                />
            )}
        </Link>
    );
}

const tabs = [
    { value: "semua", label: "Semua" },
    { value: "belum_dibaca", label: "Belum Dibaca" },
    { value: "komentar", label: "Komentar & Mention" },
    { value: "forum", label: "Forum" },
];

const filters = {
    semua: () => true,
    belum_dibaca: (n) => !n.isRead,
    komentar: (n) => n.type === "comment" || n.type === "mention",
    forum: (n) => n.type === "forum",
};

export default function NotificationsView() {
    const [notifications, setNotifications] = useState(dummyNotifications);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const markAllRead = () =>
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    const markRead = (id) =>
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );

    return (
        <div className="w-full max-w-[860px] mx-auto flex flex-col py-2 mb-auto">
            <h1 className="font-sans text-[32px] font-bold text-[var(--foreground)] leading-tight mb-4">
                Notifikasi
            </h1>

            <Tabs defaultValue="semua" className="w-full">
                {/* Tabs di kiri, aksi di kanan: satu baris */}
                <div className="flex items-center justify-between gap-3 border-b border-[var(--dust)]/60">
                    <TabsList
                        variant="line"
                        className="bg-transparent rounded-none justify-start h-auto p-0 gap-1 sm:gap-4 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    >
                        {tabs.map((tab) => (
                            <TabsTrigger key={tab.value} value={tab.value}>
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <button
                        type="button"
                        onClick={markAllRead}
                        disabled={unreadCount === 0}
                        aria-label="Tandai semua dibaca"
                        className="flex items-center gap-1.5 pb-3 shrink-0 font-sans text-sm font-semibold text-[var(--primary-text)] hover:underline underline-offset-4 disabled:text-[var(--muted)] disabled:no-underline disabled:cursor-default cursor-pointer"
                    >
                        <CheckCheck className="w-4 h-4" />
                        <span className="hidden sm:inline">Tandai semua dibaca</span>
                    </button>
                </div>

                {tabs.map((tab) => {
                    const items = notifications.filter(filters[tab.value]);

                    return (
                        <TabsContent
                            key={tab.value}
                            value={tab.value}
                            className="m-0 mt-4"
                        >
                            {items.length > 0 ? (
                                <div className="flex flex-col divide-y divide-[var(--dust)]/40 rounded-xl border border-[var(--dust)] overflow-hidden">
                                    {items.map((item) => (
                                        <NotificationRow
                                            key={item.id}
                                            {...item}
                                            onClick={() => markRead(item.id)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3 py-16 text-center text-[var(--muted)]">
                                    <BellOff className="w-8 h-8" />
                                    <p className="font-sans text-[15px]">
                                        Belum ada notifikasi di sini.
                                    </p>
                                </div>
                            )}
                        </TabsContent>
                    );
                })}
            </Tabs>
        </div>
    );
}