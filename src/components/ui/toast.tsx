"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
}

export type ToastInput =
  | string
  | {
      id?: string;
      message: string;
      variant?: ToastVariant;
      duration?: number;
    };

interface ToastContextValue {
  showToast: (input: ToastInput) => void;
  dismissToast: (id: string) => void;
  toast: {
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
  };
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (input: ToastInput) => {
      const id =
        typeof input === "object" && input.id
          ? input.id
          : `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const message = typeof input === "string" ? input : input.message;
      const variant = typeof input === "string" ? "info" : input.variant || "info";
      const duration =
        typeof input === "object" && input.duration !== undefined
          ? input.duration
          : 4000;

      const newItem: ToastItem = { id, message, variant, duration };

      setToasts((prev) => [...prev, newItem]);

      if (duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, duration);
      }
    },
    [dismissToast]
  );

  const toastHelpers = useMemo(
    () => ({
      success: (message: string, duration?: number) =>
        showToast({ message, variant: "success", duration }),
      error: (message: string, duration?: number) =>
        showToast({ message, variant: "error", duration }),
      warning: (message: string, duration?: number) =>
        showToast({ message, variant: "warning", duration }),
      info: (message: string, duration?: number) =>
        showToast({ message, variant: "info", duration }),
    }),
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{ showToast, dismissToast, toast: toastHelpers }}
    >
      {children}

      {/* Container Toast Fixed di Pojok Kanan Bawah */}
      <div
        aria-live="polite"
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full sm:w-auto pointer-events-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              "pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg text-xs sm:text-sm font-medium transition-all duration-300 animate-in fade-in slide-in-from-bottom-4",
              t.variant === "success" &&
                "border-[var(--success)]/40 bg-[var(--success-soft)] text-[var(--success-text)]",
              t.variant === "error" &&
                "border-[var(--failed)]/40 bg-[var(--failed-soft)] text-[var(--failed-text)]",
              t.variant === "warning" &&
                "border-[var(--warning)]/40 bg-[var(--warning-soft)] text-[var(--warning-text)]",
              (!t.variant || t.variant === "info") &&
                "border-[var(--information)]/40 bg-[var(--information-soft)] text-[var(--information-text)]"
            )}
          >
            {t.variant === "success" && (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[var(--success)]" />
            )}
            {t.variant === "error" && (
              <AlertCircle className="w-4 h-4 shrink-0 text-[var(--failed)]" />
            )}
            {t.variant === "warning" && (
              <AlertTriangle className="w-4 h-4 shrink-0 text-[var(--warning)]" />
            )}
            {(!t.variant || t.variant === "info") && (
              <Info className="w-4 h-4 shrink-0 text-[var(--information)]" />
            )}

            <span className="flex-1 leading-snug">{t.message}</span>

            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer shrink-0 transition-colors"
              aria-label="Tutup notifikasi"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

