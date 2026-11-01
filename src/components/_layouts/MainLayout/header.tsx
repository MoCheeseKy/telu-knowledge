"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PanelLeft, Pencil, LogOut, Loader2, User } from "lucide-react";
import Wrapper from "@/components/_shared/Wrapper";
import { useMe, useLogout } from "@/services/auth/auth.queries";

interface MainHeaderProps {
    onOpenSidebar: () => void;
}

export default function MainHeader({ onOpenSidebar }: MainHeaderProps) {
    const router = useRouter();
    const { data: user } = useMe();
    const logoutMutation = useLogout();

    const handleLogout = () => {
        logoutMutation.mutate(undefined, {
            onSettled: () => {
                router.replace("/login");
                router.refresh();
            },
        });
    };

    return (
        <header className="sticky top-0 z-30 w-full border-b border-[var(--dust)] bg-[var(--background)]/95 backdrop-blur-md transition-colors">
            <Wrapper backgroundColor="bg-transparent" className="py-3">
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-3 md:gap-4">
                        <button
                            type="button"
                            onClick={onOpenSidebar}
                            className="flex items-center justify-center p-2 -ml-2 rounded-lg text-[var(--foreground)] hover:bg-[var(--background-accent)] hover:text-[var(--primary-text)] transition-colors cursor-pointer"
                            aria-label="Buka Menu Navigasi"
                        >
                            <PanelLeft className="w-5 h-5" />
                        </button>

                        <Link
                            href="/home"
                            className="flex items-baseline gap-1 select-none cursor-pointer group"
                        >
                            <span className="font-newsreader font-bold italic text-[32px] leading-none text-[var(--primary-text)] tracking-tight transition-transform group-hover:scale-[1.02]">
                                Tel-U
                            </span>
                            <span className="font-newsreader italic text-[16px] leading-none text-[var(--foreground)]">
                                Knowledge
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                        <Link
                            href="/editor-studio"
                            className="flex items-center gap-2 text-sm font-medium text-[var(--primary-text)] hover:opacity-85 transition-opacity cursor-pointer"
                        >
                            <Pencil className="w-4 h-4 text-[var(--primary-text)]" />
                            <span className="hidden sm:inline">Tulis Artikel</span>
                        </Link>

                        {/* Identitas User dari useMe() */}
                        {user?.email && (
                            <span
                                className="text-xs font-medium text-[var(--muted)] hidden md:inline-block max-w-[200px] truncate"
                                title={user.email}
                            >
                                {user.email}
                            </span>
                        )}

                        <Link
                            href="/profile"
                            className="h-9 w-9 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-xl transition-all shadow-xs shrink-0 cursor-pointer flex items-center justify-center text-xs font-bold"
                            aria-label="Profil Saya"
                            title={user?.email || "Profil"}
                        >
                            {user?.email ? (
                                user.email.charAt(0).toUpperCase()
                            ) : (
                                <User className="w-4 h-4" />
                            )}
                        </Link>

                        {/* Aksi Keluar / Logout */}
                        <button
                            type="button"
                            onClick={handleLogout}
                            disabled={logoutMutation.isPending}
                            className="flex items-center gap-1.5 p-2 rounded-lg text-[var(--muted)] hover:text-[var(--failed)] hover:bg-[var(--background-accent)] transition-colors cursor-pointer disabled:opacity-50"
                            title="Keluar"
                            aria-label="Keluar"
                        >
                            {logoutMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <LogOut className="w-4 h-4" />
                            )}
                            <span className="text-xs font-medium hidden sm:inline">Keluar</span>
                        </button>
                    </div>
                </div>
            </Wrapper>
        </header>
    );
}
