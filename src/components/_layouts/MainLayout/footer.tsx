import Link from "next/link";
import Wrapper from "@/components/_shared/Wrapper";

export default function MainFooter() {
    return (
        <footer className="w-full border-t border-[var(--dust)] bg-[var(--background)] mt-auto">
            <Wrapper backgroundColor="bg-transparent" className="py-10 md:py-14">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                        <div className="max-w-sm flex flex-col gap-3">
                            <div className="flex items-baseline gap-1 select-none">
                                <span className="font-newsreader font-bold italic text-[26px] leading-none text-[var(--primary-text)]">
                                    Tel-U
                                </span>
                                <span className="font-newsreader italic text-[14px] leading-none text-[var(--foreground)]">
                                    Knowledge
                                </span>
                            </div>
                            <p className="text-sm text-[var(--muted)] leading-relaxed">
                                Platform kurasi wawasan, publikasi riset, dan ruang diskusi
                                civitas akademika Telkom University. Berbagi ilmu, membangun
                                inovasi masa depan.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10 text-sm">
                            <div className="flex flex-col space-y-2.5">
                                <span className="font-semibold text-[var(--foreground)]">Jelajahi</span>
                                <Link href="/home" className="text-[var(--muted)] hover:text-[var(--primary-text)] transition-colors">
                                    Beranda
                                </Link>
                                <Link href="/discussion-forums" className="text-[var(--muted)] hover:text-[var(--primary-text)] transition-colors">
                                    Forum Diskusi
                                </Link>
                                <Link href="/discovers-articles" className="text-[var(--muted)] hover:text-[var(--primary-text)] transition-colors">
                                    Cari Artikel
                                </Link>
                                <Link href="/discovers-forums" className="text-[var(--muted)] hover:text-[var(--primary-text)] transition-colors">
                                    Cari Forum
                                </Link>
                            </div>

                            <div className="flex flex-col space-y-2.5">
                                <span className="font-semibold text-[var(--foreground)]">Kontribusi</span>
                                <Link href="/editor-studio" className="text-[var(--muted)] hover:text-[var(--primary-text)] transition-colors">
                                    Tulis Artikel
                                </Link>
                                <Link href="/my-articles" className="text-[var(--muted)] hover:text-[var(--primary-text)] transition-colors">
                                    Artikel Saya
                                </Link>
                                <Link href="/statistics" className="text-[var(--muted)] hover:text-[var(--primary-text)] transition-colors">
                                    Statistik
                                </Link>
                            </div>

                            <div className="flex flex-col space-y-2.5">
                                <span className="font-semibold text-[var(--foreground)]">Pusat Bantuan</span>
                                <Link href="/settings" className="text-[var(--muted)] hover:text-[var(--primary-text)] transition-colors">
                                    Pengaturan
                                </Link>
                                <span className="text-[var(--muted)] cursor-default">
                                    Panduan Menulis
                                </span>
                                <span className="text-[var(--muted)] cursor-default">
                                    Ketentuan Komunitas
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-[var(--dust)]/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--muted)]">
                        <p>© {new Date().getFullYear()} Tel-U Knowledge. Telkom University.</p>
                        <p>Dibangun untuk kebutuhan akademik dan kolaborasi riset.</p>
                    </div>
                </div>
            </Wrapper>
        </footer>
    );
}
