import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Newsreader, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  weight: ["400", "500", "600", "700"],
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Tel-U Knowledge",
  description: "Platform Berbagi Pengetahuan & Diskusi Civitas Akademika Telkom University",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", plusJakartaSans.variable, newsreader.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col font-sans bg-[var(--background)] text-[var(--foreground)]">
        {children}
      </body>
    </html>
  );
}
