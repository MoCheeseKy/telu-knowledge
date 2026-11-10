"use client";

import { useState } from "react";
import MainLayoutProps from "./_types";
import MainHeader from "./header";
import MainSidebar from "./sidebar";
import MainFooter from "./footer";
import Wrapper from "@/components/_shared/Wrapper";
import { cn } from "@/lib/utils";

export default function MainLayout({ children, className = "" }: MainLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
            <MainSidebar
                isOpen={isSidebarOpen}
                onOpenChange={setIsSidebarOpen}
            />

            <MainHeader onOpenSidebar={() => setIsSidebarOpen(true)} />

            <main className={cn("flex-1 flex flex-col w-full", className)}>
                <Wrapper backgroundColor="bg-transparent" className="py-6 sm:py-8 flex-1 flex flex-col">
                    {children}
                </Wrapper>
            </main>

            <MainFooter />
        </div>
    );
}
