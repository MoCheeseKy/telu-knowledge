import type { ComponentType, ReactNode } from "react";

/** Properti untuk komponen MainLayout. */
export default interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

/** Properti untuk komponen MainHeader. */
export interface MainHeaderProps {
  onOpenSidebar: () => void;
}

/** Properti untuk komponen MainSidebar. */
export interface MainSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Representasi satu item tautan navigasi pada sidebar. */
export interface NavItem {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}

/** Pengelompokan daftar item navigasi berdasarkan kategori di sidebar. */
export interface NavSection {
  title: string;
  items: NavItem[];
}
