"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/src/lib/utils";
import type { ButtonVariant, ButtonSize } from "@/src/shared/types";

// ============================================
// Types
// ============================================

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// ============================================
// Styles
// ============================================

const baseStyles = `
  inline-flex items-center justify-center font-medium rounded-xl
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
  active:scale-[0.98]
`;

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-indigo-600 text-white
    hover:bg-indigo-700
    shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30
    hover:-translate-y-0.5
    focus:ring-indigo-500
  `,
  secondary: `
    bg-slate-600 text-white
    hover:bg-slate-700
    shadow-lg shadow-slate-500/25
    hover:-translate-y-0.5
    focus:ring-slate-500
  `,
  outline: `
    border-2 border-slate-200 bg-transparent text-slate-700
    hover:bg-slate-50 hover:border-slate-300
    dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:border-slate-600
    focus:ring-slate-500
  `,
  ghost: `
    bg-transparent text-slate-700
    hover:bg-slate-100
    dark:text-slate-300 dark:hover:bg-slate-800
    focus:ring-slate-500
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2.5 text-base gap-2",
  lg: "px-6 py-3 text-lg gap-2.5",
};

// ============================================
// Component
// ============================================

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

// ============================================
// Sub-components
// ============================================

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
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
