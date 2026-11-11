"use client";

import EditorLayoutProps from "./_types";
import EditorHeader from "./header";
import EditorFooter from "./footer";
import {
    EditorStudioContext,
    EditorStudioProvider,
    useEditorStudio,
    type EditorSaveStatus,
    type EditorStudioActions,
    type EditorStudioContextValue,
} from "./context";
import Wrapper from "@/components/_shared/Wrapper";
import { cn } from "@/lib/utils";

export {
    EditorStudioContext,
    EditorStudioProvider,
    useEditorStudio,
    type EditorSaveStatus,
    type EditorStudioActions,
    type EditorStudioContextValue,
};

export default function EditorLayout({
    children,
    className = "",
    authorName,
}: EditorLayoutProps) {
    return (
        <EditorStudioProvider>
            <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
                <EditorHeader authorName={authorName} />

                <main className={cn("flex-1 flex flex-col w-full", className)}>
                    <Wrapper
                        backgroundColor="bg-transparent"
                        className="py-6 sm:py-8 flex-1 flex flex-col"
                    >
                        {children}
                    </Wrapper>
                </main>

                <EditorFooter />
            </div>
        </EditorStudioProvider>
    );
}
