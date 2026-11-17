import type { ComponentType, ReactNode } from "react";

export default interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

export interface MainHeaderProps {
  onOpenSidebar: () => void;
}

export interface MainSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface NavItem {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}
