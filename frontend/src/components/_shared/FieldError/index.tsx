import React from "react";
import { cn } from "@/lib/utils";

export interface FieldErrorProps {
  message?: string;
  id?: string;
  className?: string;
}

export default function FieldError({ message, id, className }: FieldErrorProps) {
  if (!message) return null;

  return (
    <p
      id={id}
      role="alert"
      className={cn(
        "text-xs text-[var(--failed-text)] font-medium mt-1 leading-normal",
        className
      )}
    >
      {message}
    </p>
  );
}
