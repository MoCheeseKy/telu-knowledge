import React from "react"
import Image from "next/image"


export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white text-[var(--foreground)] selection:bg-[var(--primary-soft)] selection:text-[var(--primary-text)]">
            <div className="relative w-full lg:w-1/2 min-h-[340px] sm:min-h-[400px] lg:min-h-screen flex flex-col justify-center px-8 sm:px-14 md:px-18 lg:px-20 py-16 overflow-hidden rounded-b-[40px] sm:rounded-b-[60px] lg:rounded-none lg:rounded-br-[160px] xl:rounded-br-[200px] shadow-sm lg:shadow-none">
                <Image
                    src="/images/auth-banner.svg"
                    alt="Gedung Kampus Telkom University Bandung"
                    fill
                    priority
                    className="object-cover object-center filter blur-[2px] scale-105 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/55 via-black/35 to-black/25 pointer-events-none" />
                <div className="relative z-10 flex flex-col items-start select-none max-w-lg">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="font-newsreader font-bold italic text-[54px] sm:text-[64px] leading-none text-[#EA5753] tracking-tight drop-shadow-sm">
                            Tel-U
                        </span>
                        <span className="font-newsreader font-bold italic text-[28px] sm:text-[32px] leading-none text-white tracking-tight drop-shadow-sm">
                            Knowledge
                        </span>
                    </div>

                    <div className="mt-4 sm:mt-5 text-white drop-shadow-sm">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight leading-snug">
                            Forum Pengetahuan Mahasiswa
                        </h1>
                        <p className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight leading-snug text-white/95">
                            Telkom University Bandung
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12 md:px-16 py-12 lg:py-16 bg-white min-h-[520px] lg:min-h-screen">
                <div className="w-full max-w-[420px] mx-auto animate-in fade-in-50 duration-500">
                    {children}
                </div>
            </div>
        </div>
    )
}