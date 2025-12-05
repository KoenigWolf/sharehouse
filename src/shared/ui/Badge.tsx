"use client";

import { cn } from "@/src/lib/utils";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "error" | "outline";
  size?: "sm" | "md";
  className?: string;
}

const variantStyles = {
  default:
    "bg-white/90 dark:bg-slate-900/90 text-muted dark:text-muted border border-white/20",
  primary:
    "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-200",
  success:
    "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
  warning:
    "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
  error: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
  outline:
    "bg-transparent border border-slate-300 dark:border-slate-600 text-muted dark:text-muted",
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-xs",
};

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
