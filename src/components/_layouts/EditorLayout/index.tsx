"use client";

import EditorLayoutProps from "./_types";
import EditorHeader from "./header";
import EditorFooter from "./footer";
import Wrapper from "@/components/_shared/Wrapper";
import { cn } from "@/lib/utils";

export default function EditorLayout({
    children,
    className = "",
    authorName = "mocheeseky",
    documentType = "'s Draft",
    onSaveDraft,
    onPublish,
}: EditorLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
            <EditorHeader
                authorName={authorName}
                documentType={documentType}
                onSaveDraft={onSaveDraft}
                onPublish={onPublish}
            />

            <main className={cn("flex-1 flex flex-col w-full", className)}>
                <Wrapper backgroundColor="bg-transparent" className="py-6 sm:py-8 flex-1 flex flex-col">
                    {children}
                </Wrapper>
            </main>

            <EditorFooter />
        </div>
    );
}
