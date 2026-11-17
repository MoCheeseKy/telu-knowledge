import type { ComponentType } from "react";

export type Visibility = "publik" | "terbatas" | "privat";

export interface VisibilityOption {
  value: Visibility;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}

export interface FieldLabelProps {
  htmlFor?: string;
  title: string;
  hint?: string;
}
