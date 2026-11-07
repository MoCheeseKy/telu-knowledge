"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { cn } from "@/lib/utils";

export interface TitleFieldProps {
  value: string;
  onChange: (value: string) => void;
  onEnterPress?: () => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  className?: string;
}

const TitleField = forwardRef<HTMLTextAreaElement, TitleFieldProps>(
  function TitleField(
    {
      value,
      onChange,
      onEnterPress,
      placeholder = "Judul tulisan…",
      maxLength = 150,
      disabled = false,
      className,
    },
    ref
  ) {
    const internalRef = useRef<HTMLTextAreaElement | null>(null);

    useImperativeHandle(ref, () => internalRef.current as HTMLTextAreaElement);

    const adjustHeight = useCallback(() => {
      const el = internalRef.current;
      if (!el) return;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }, []);

    useEffect(() => {
      adjustHeight();
    }, [value, adjustHeight]);

    useEffect(() => {
      window.addEventListener("resize", adjustHeight);
      return () => window.removeEventListener("resize", adjustHeight);
    }, [adjustHeight]);

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      const sanitized = e.target.value.replace(/[\r\n]+/g, " ");
      onChange(sanitized.slice(0, maxLength));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onEnterPress?.();
      }
    };

    return (
      <textarea
        ref={internalRef}
        rows={1}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        aria-label="Judul artikel"
        className={cn(
          "w-full resize-none overflow-hidden bg-transparent border-0 p-0 focus:outline-none focus:ring-0",
          "font-newsreader font-bold text-[32px] sm:text-[40px] md:text-[44px] leading-[1.2] tracking-tight",
          "text-[var(--foreground)] placeholder:text-[var(--muted)]/55",
          className
        )}
      />
    );
  }
);

export default TitleField;

