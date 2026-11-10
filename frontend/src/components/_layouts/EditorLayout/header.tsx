"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bookmark, ExternalLink } from "lucide-react";
import Wrapper from "@/components/_shared/Wrapper";
import { Button } from "@/components/ui/button";

interface EditorHeaderProps {
    authorName?: string;
    documentType?: string;
    onSaveDraft?: () => void;
    onPublish?: () => void;
}

export default function EditorHeader({
    authorName = "mocheeseky",
    documentType = "'s Draft",
    onSaveDraft,
    onPublish,
}: EditorHeaderProps) {
    const router = useRouter();

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
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-3 md:gap-4">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="flex items-center justify-center p-2 -ml-2 rounded-lg text-[var(--foreground)] hover:bg-[var(--background-accent)] hover:text-[var(--primary-text)] transition-colors cursor-pointer"
                            aria-label="Kembali"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>

                        <div className="flex items-baseline gap-1 select-none">
                            <span className="font-newsreader font-bold italic text-[32px] leading-none text-[var(--primary-text)] tracking-tight">
                                {authorName}
                            </span>
                            <span className="font-newsreader italic text-[16px] leading-none text-[var(--foreground)]">
                                {documentType}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                        <Button
                            type="button"
                            variant="primaryOutline"
                            size="sm"
                            onClick={onSaveDraft}
                            className="h-9 px-3.5 sm:px-4 text-xs sm:text-sm font-medium gap-1.5 sm:gap-2 rounded-lg"
                        >
                            <Bookmark className="w-4 h-4 text-[var(--primary-text)]" />
                            <span>Draft Tulisan</span>
                        </Button>

                        <Button
                            type="button"
                            variant="default"
                            size="sm"
                            onClick={onPublish}
                            className="h-9 px-3.5 sm:px-4 text-xs sm:text-sm font-medium gap-1.5 sm:gap-2 rounded-lg shadow-xs"
                        >
                            <ExternalLink className="w-4 h-4 text-white" />
                            <span>Publikasi</span>
                        </Button>

                        <Link
                            href="/profile"
                            className="h-9 w-9 bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-xl transition-all shadow-xs shrink-0 cursor-pointer flex items-center justify-center"
                            aria-label="Profil Saya"
                        />
                    </div>
                </div>
            </Wrapper>
        </header>
    );
}
