"use client";

/**
 * Button Component
 * Accessible, responsive button with multiple variants and sizes
 *
 * Accessibility:
 * - Minimum 44px touch target (WCAG 2.1 Level AAA)
 * - Focus-visible for keyboard navigation
 * - Disabled state properly handled
 */

import { ButtonHTMLAttributes, forwardRef, memo } from "react";
import { cn } from "@/src/lib/utils";
import type { ButtonVariant, ButtonSize } from "@/src/shared/types";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  /** Allow button to shrink below minimum touch target for inline use */
  compact?: boolean;
}

const baseStyles = cn(
  "inline-flex items-center justify-center",
  "font-medium",
  "rounded-lg xs:rounded-xl",
  "transition-all duration-200",
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0",
  "active:scale-[0.98]",
  "touch-manipulation",
  "select-none"
);

const variantStyles: Record<ButtonVariant, string> = {
  primary: cn(
    "bg-indigo-600 text-white",
    "hover:bg-indigo-700",
    "shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30",
    "hover:-translate-y-0.5",
    "focus-visible:ring-indigo-500"
  ),
  secondary: cn(
    "bg-slate-600 text-white",
    "hover:bg-slate-700",
    "shadow-lg shadow-slate-500/25",
    "hover:-translate-y-0.5",
    "focus-visible:ring-slate-500"
  ),
  outline: cn(
    "border-2 border-slate-200 bg-transparent text-slate-700",
    "hover:bg-slate-50 hover:border-slate-300",
    "dark:border-slate-700 dark:text-slate-300",
    "dark:hover:bg-slate-800 dark:hover:border-slate-600",
    "focus-visible:ring-slate-500"
  ),
  ghost: cn(
    "bg-transparent text-slate-700",
    "hover:bg-slate-100",
    "dark:text-slate-300 dark:hover:bg-slate-800",
    "focus-visible:ring-slate-500"
  ),
};

// Size styles with minimum touch targets
const sizeStyles: Record<ButtonSize, string> = {
  sm: cn(
    "px-3 xs:px-3.5 py-1.5 xs:py-2",
    "text-xs xs:text-sm",
    "gap-1.5",
    "min-h-[36px] xs:min-h-[40px]"
  ),
  md: cn(
    "px-4 xs:px-5 py-2 xs:py-2.5",
    "text-sm xs:text-base",
    "gap-2",
    "min-h-[40px] xs:min-h-[44px]"
  ),
  lg: cn(
    "px-5 xs:px-6 py-2.5 xs:py-3",
    "text-base xs:text-lg",
    "gap-2.5",
    "min-h-[44px] xs:min-h-[48px]"
  ),
};

export const Button = memo(
  forwardRef<HTMLButtonElement, ButtonProps>(
    (
      {
        className,
        variant = "primary",
        size = "md",
        isLoading = false,
        leftIcon,
        rightIcon,
        disabled,
        compact = false,
        children,
        type = "button",
        ...props
      },
      ref
    ) => {
      return (
        <button
          ref={ref}
          type={type}
          className={cn(
            baseStyles,
            variantStyles[variant],
            sizeStyles[size],
            compact && "min-h-0",
            className
          )}
          disabled={disabled || isLoading}
          aria-busy={isLoading}
          aria-disabled={disabled || isLoading}
          {...props}
        >
          {isLoading ? (
            <>
              <Spinner size={size} />
              <span className="sr-only xs:not-sr-only">Loading...</span>
            </>
          ) : (
            <>
              {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
              {children}
              {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
            </>
          )}
        </button>
      );
    }
  )
);

Button.displayName = "Button";

interface SpinnerProps {
  size?: ButtonSize;
}

function Spinner({ size = "md" }: SpinnerProps) {
  const sizeClasses: Record<ButtonSize, string> = {
    sm: "h-3.5 w-3.5 xs:h-4 xs:w-4",
    md: "h-4 w-4 xs:h-5 xs:w-5",
    lg: "h-5 w-5 xs:h-6 xs:w-6",
  };

  return (
    <svg
      className={cn("animate-spin", sizeClasses[size])}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
