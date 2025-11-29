"use client";

import { cn } from "@/src/lib/utils";

// ============================================
// Types
// ============================================

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "error";
  size?: "sm" | "md";
  className?: string;
}

// ============================================
// Styles
// ============================================

const variantStyles = {
  default:
    "bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 border border-white/20",
  primary:
    "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300",
  success:
    "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
  warning:
    "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
  error: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-xs",
};

// ============================================
// Component
// ============================================

export function Badge({
  children,
  variant = "default",
  size = "md",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold",
        "shadow-lg backdrop-blur-sm",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}
