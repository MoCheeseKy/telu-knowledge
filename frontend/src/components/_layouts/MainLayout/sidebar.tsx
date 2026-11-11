"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  MessageSquareMore,
  Newspaper,
  Compass,
  FileText,
  Users,
  BarChart2,
  User,
  Bookmark,
  Settings,
  LogOut,
  Loader2,
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { useMe, useLogout } from "@/services/auth/auth.queries";

interface MainSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Jelajahi",
    items: [
      { label: "Beranda", href: "/home", icon: Home },
      { label: "Forum Diskusi", href: "/discussion-forums", icon: MessageSquareMore },
      { label: "Cari Artikel", href: "/discovers-articles", icon: Newspaper },
      { label: "Cari Forum", href: "/discovers-forums", icon: Compass },
    ],
  },
  {
    title: "Kontribusi",
    items: [
      { label: "Statistik", href: "/statistics", icon: BarChart2 },
      { label: "Artikel Saya", href: "/my-articles", icon: FileText },
    ],
  },
  {
    title: "Akun",
    items: [
      { label: "Profil", href: "/profile", icon: User },
      { label: "Tersimpan", href: "/librarys", icon: Bookmark },
      { label: "Pengaturan", href: "/settings", icon: Settings },
    ],
  },
];

export default function MainSidebar({ isOpen, onOpenChange }: MainSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user } = useMe();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        onOpenChange(false);
        router.replace("/login");
        router.refresh();
      },
    });
  };

  const isItemActive = (href: string) => {
    if (href === "/home") {
      return pathname === "/home" || pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={onOpenChange}
      swipeDirection="left"
    >
      <DrawerContent className="w-[280px] sm:w-[300px] h-full p-6 pt-8 bg-[var(--background)] flex flex-col justify-between overflow-y-auto border-r border-[var(--dust)]">
        <div>
          <DrawerHeader className="mb-4 p-0">
            <DrawerTitle className="sr-only">Menu Navigasi</DrawerTitle>
            <div className="flex items-baseline gap-1 select-none">
              <span className="font-newsreader font-bold italic text-[28px] leading-none text-[var(--primary-text)]">
                Tel-U
              </span>
              <span className="font-newsreader italic text-[14px] leading-none text-[var(--foreground)]">
                Knowledge
              </span>
            </div>
          </DrawerHeader>

          <nav className="flex flex-col space-y-6">
            {navSections.map((section) => (
              <div key={section.title} className="flex flex-col space-y-1">
                <h3 className="px-3 py-1.5 text-sm font-medium text-[var(--muted)]">
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = isItemActive(item.href);

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => onOpenChange(false)}
                          className={cn(
                            "flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[15px] font-normal transition-all cursor-pointer",
                            active
                              ? "border border-[var(--primary-text)] text-[var(--primary-text)] font-semibold bg-[var(--primary-soft)]/20"
                              : "text-[var(--foreground)] hover:bg-[var(--background-accent)] hover:text-[var(--foreground)]"
                          )}
                        >
                          <Icon
                            className={cn(
                              "w-5 h-5 shrink-0 transition-colors",
                              active
                                ? "text-[var(--primary-text)]"
                                : "text-[var(--foreground)]"
                            )}
                          />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* User Info & Logout Button */}
        <div className="mt-8 pt-4 border-t border-[var(--dust)]">
          {user?.email && (
            <div className="px-3.5 pb-3">
              <p className="text-xs text-[var(--muted)]">Masuk sebagai:</p>
              <p
                className="text-sm font-medium text-[var(--foreground)] truncate"
                title={user.email}
              >
                {user.email}
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[15px] font-normal text-[var(--failed)] hover:bg-[var(--failed)]/10 transition-colors cursor-pointer disabled:opacity-50"
          >
            {logoutMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <LogOut className="w-5 h-5" />
            )}
            <span>Keluar</span>
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
