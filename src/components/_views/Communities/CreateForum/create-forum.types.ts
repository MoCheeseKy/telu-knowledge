import type { ComponentType } from "react";

/** Tingkat visibilitas akses dan keanggotaan forum komunitas. */
export type Visibility = "publik" | "terbatas" | "privat";

/** Opsi pilihan visibilitas forum beserta deskripsi dan ikonnya. */
export interface VisibilityOption {
  value: Visibility;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}

/** Properti label field formulir pembuatan forum. */
export interface FieldLabelProps {
  htmlFor?: string;
  title: string;
  hint?: string;
}
