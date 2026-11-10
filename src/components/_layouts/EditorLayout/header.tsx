"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Bookmark,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ExternalLink,
    RotateCcw,
    User,
} from "lucide-react";
import Wrapper from "@/components/_shared/Wrapper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMe } from "@/services/auth/auth.queries";
import { useEditorStudio, type EditorSaveStatus } from "./context";

interface EditorHeaderProps {
    authorName?: string;
}

const SAVE_STATUS_CONFIG: Record<
    EditorSaveStatus,
    { label: string; className: string }
> = {
    idle: {
        label: "Draf",
        className: "text-[var(--muted)]",
    },
    saving: {
        label: "Menyimpan…",
        className: "text-[var(--muted)]",
    },
    saved: {
        label: "Tersimpan",
        className: "text-[var(--success-text)]",
    },
    error: {
        label: "Gagal menyimpan",
        className: "text-[var(--failed-text)]",
    },
};

export default function EditorHeader({ authorName }: EditorHeaderProps) {
    const router = useRouter();
    const { data: user } = useMe();
    const { saveStatus, articleStatus, saveDraft, publish, unpublish, retrySave } =
        useEditorStudio();

    const isPublished = articleStatus === "published";

    const resolvedAuthorName =
        authorName || (user?.email ? user.email.split("@")[0] : "Penulis");

    const statusInfo = SAVE_STATUS_CONFIG[saveStatus];
    const statusLabel = statusInfo.label;

    const handleBack = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push("/home");
        }
    };

    return (
        <header className="sticky top-0 z-30 w-full border-b border-[var(--dust)] bg-[var(--background)]/95 backdrop-blur-md transition-colors">
            <Wrapper backgroundColor="bg-transparent" className="py-3">
                <div className="flex w-full max-w-[920px] mx-auto items-center justify-between gap-2">
                    <div className="flex items-center min-w-0 flex-1">
                        <div className="w-9 sm:w-12 md:w-16 shrink-0 flex items-center justify-start">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="flex items-center justify-center p-2 -ml-2 rounded-lg text-[var(--foreground)] hover:bg-[var(--background-accent)] hover:text-[var(--primary-text)] transition-colors cursor-pointer"
                                aria-label="Kembali"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex items-baseline gap-1.5 sm:gap-2.5 min-w-0 select-none">
                            <span className="font-newsreader font-bold italic text-[20px] sm:text-[26px] md:text-[32px] leading-none text-[var(--primary-text)] tracking-tight truncate">
                                {resolvedAuthorName}
                            </span>

                            {!isPublished && (
                                <span
                                    aria-live="polite"
                                    className={cn(
                                        "inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-medium transition-colors shrink-0",
                                        statusInfo.className
                                    )}
                                >
                                    {saveStatus === "saving" && (
                                        <Loader2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin" />
                                    )}
                                    {saveStatus === "saved" && (
                                        <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                    )}
                                    {saveStatus === "error" && (
                                        <AlertCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                    )}
                                    <span>{statusLabel}</span>
                                    {saveStatus === "error" && (
                                        <button
                                            type="button"
                                            onClick={retrySave}
                                            className="inline-flex items-center gap-1 underline underline-offset-2 text-[var(--primary-text)] hover:opacity-80 cursor-pointer ml-1"
                                        >
                                            <RotateCcw className="w-3 h-3" />
                                            <span>Coba lagi</span>
                                        </button>
                                    )}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0">
                        {isPublished && (
                            <Button
                                type="button"
                                variant="primaryOutline"
                                size="sm"
                                onClick={saveDraft}
                                disabled={saveStatus === "saving"}
                                className="h-8 sm:h-9 px-2.5 sm:px-4 text-xs sm:text-sm font-medium gap-1.5 sm:gap-2 rounded-lg"
                            >
                                <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--primary-text)]" />
                                <span className="hidden sm:inline">Simpan perubahan</span>
                                <span className="sm:hidden">Simpan</span>
                            </Button>
                        )}

                        {isPublished ? (
                            <Button
                                type="button"
                                variant="default"
                                size="sm"
                                onClick={unpublish}
                                disabled={saveStatus === "saving"}
                                className="h-8 sm:h-9 px-2.5 sm:px-4 text-xs sm:text-sm font-medium gap-1.5 sm:gap-2 rounded-lg shadow-xs"
                            >
                                <span>Batal Publikasi</span>
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                variant="default"
                                size="sm"
                                onClick={publish}
                                disabled={saveStatus === "saving"}
                                className="h-8 sm:h-9 px-2.5 sm:px-4 text-xs sm:text-sm font-medium gap-1.5 sm:gap-2 rounded-lg shadow-xs"
                            >
                                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--primary-foreground)]" />
                                <span>Publikasi</span>
                            </Button>
                        )}

                        <Link
                            href="/profile"
                            className="h-8 w-8 sm:h-9 sm:w-9 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-foreground)] rounded-xl transition-all shadow-xs shrink-0 cursor-pointer flex items-center justify-center text-xs font-bold"
                            aria-label="Profil Saya"
                            title={user?.email || resolvedAuthorName}
                        >
                            {resolvedAuthorName ? (
                                resolvedAuthorName.charAt(0).toUpperCase()
                            ) : (
                                <User className="w-4 h-4" />
                            )}
                        </Link>
                    </div>
                </div>
            </Wrapper>
        </header>
    );
}
