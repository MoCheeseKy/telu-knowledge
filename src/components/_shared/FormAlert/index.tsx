import React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormAlertProps {
  variant?: "error" | "success";
  messages?: string | string[];
  children?: React.ReactNode;
  className?: string;
}

export default function FormAlert({
  variant = "error",
  messages,
  children,
  className,
}: FormAlertProps) {
  const isError = variant === "error";

  const messageList = React.useMemo(() => {
    if (!messages) return [];
    return Array.isArray(messages) ? messages : [messages];
  }, [messages]);

  if (messageList.length === 0 && !children) {
    return null;
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "p-3.5 sm:p-4 rounded-lg border text-sm flex items-start gap-3 transition-colors",
        isError
          ? "border-[var(--failed)] bg-[var(--failed-soft)] text-[var(--failed-text)]"
          : "border-[var(--success)] bg-[var(--success-soft)] text-[var(--success-text)]",
        className
      )}
    >
      <div className="shrink-0 mt-0.5">
        {isError ? (
          <AlertCircle className="w-5 h-5 text-[var(--failed-text)]" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-[var(--success-text)]" />
        )}
      </div>

      <div className="flex-1 space-y-1">
        {messageList.length === 1 ? (
          <p className="leading-snug">{messageList[0]}</p>
        ) : messageList.length > 1 ? (
          <ul className="list-disc list-inside space-y-0.5 text-xs sm:text-sm">
            {messageList.map((msg, idx) => (
              <li key={idx} className="leading-snug">
                {msg}
              </li>
            ))}
          </ul>
        ) : null}
        {children}
      </div>
    </div>
  );
}
