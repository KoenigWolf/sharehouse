"use client";

/**
 * Input Component
 * Accessible, responsive input with label and error support
 *
 * Accessibility:
 * - Minimum 44px touch target (WCAG 2.1 Level AAA)
 * - Proper label association
 * - Error state with aria-invalid
 * - Focus-visible for keyboard navigation
 */

import { InputHTMLAttributes, forwardRef, memo, useId } from "react";
import { cn } from "@/src/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const baseInputStyles = cn(
  "w-full",
  "px-3 xs:px-4 py-2.5 xs:py-3",
  "min-h-[44px] xs:min-h-[48px]",
  "rounded-lg xs:rounded-xl",
  "bg-slate-50 dark:bg-slate-700/50",
  "border border-slate-200 dark:border-slate-600",
  "text-sm xs:text-base",
  "text-strong dark:text-strong",
  "placeholder-slate-400 dark:placeholder-slate-500",
  "transition-all duration-200",
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-transparent",
  "disabled:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60",
  "dark:disabled:bg-slate-800",
  // Mobile-specific improvements
  "touch-manipulation",
  // Prevent zoom on iOS
  "text-[16px] xs:text-base"
);

const errorInputStyles = cn(
  "border-red-500 dark:border-red-500",
  "focus-visible:ring-red-500"
);

export const Input = memo(
  forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, hint, id, ...props }, ref) => {
      // Generate unique ID if not provided
      const generatedId = useId();
      const inputId = id || generatedId;
      const errorId = `${inputId}-error`;
      const hintId = `${inputId}-hint`;

      return (
        <div className="w-full">
          {label && (
            <label
              htmlFor={inputId}
              className={cn(
                "block",
                "text-xs xs:text-sm font-medium",
                "text-muted dark:text-muted",
                "mb-1.5 xs:mb-2"
              )}
            >
              {label}
            </label>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              baseInputStyles,
              error && errorInputStyles,
              className
            )}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={
              error ? errorId : hint ? hintId : undefined
            }
            suppressHydrationWarning
            {...props}
          />
          {error && (
            <p
              id={errorId}
              className={cn(
                "mt-1.5 xs:mt-2",
                "text-xs xs:text-sm",
                "text-red-500 dark:text-red-400"
              )}
              role="alert"
            >
              {error}
            </p>
          )}
          {hint && !error && (
            <p
              id={hintId}
              className={cn(
                "mt-1.5 xs:mt-2",
                "text-xs xs:text-sm",
                "text-subtle dark:text-subtle"
              )}
            >
              {hint}
            </p>
          )}
        </div>
      );
    }
  )
);

Input.displayName = "Input";
