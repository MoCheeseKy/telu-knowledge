import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftIcon, rightIcon, ...props }, ref) => {
    if (leftIcon || rightIcon) {
      return (
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[var(--muted)]">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-11 w-full rounded-lg border border-[var(--dust)] bg-white px-3.5 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)]/60 transition-colors focus-visible:outline-none focus-visible:border-[var(--primary-text)] focus-visible:ring-1 focus-visible:ring-[var(--primary-text)] disabled:cursor-not-allowed disabled:opacity-50",
              leftIcon && "pl-11",
              rightIcon && "pr-11",
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 flex items-center text-[var(--muted)]">
              {rightIcon}
            </div>
          )}
        </div>
      );
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border border-[var(--dust)] bg-white px-3.5 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)]/60 transition-colors focus-visible:outline-none focus-visible:border-[var(--primary-text)] focus-visible:ring-1 focus-visible:ring-[var(--primary-text)] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
