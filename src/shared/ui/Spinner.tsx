"use client";

import { cn } from "@/src/lib/utils";

// ============================================
// Types
// ============================================

export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

// ============================================
// Styles
// ============================================

const sizeStyles = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-3",
  lg: "w-12 h-12 border-4",
};

// ============================================
// Component
// ============================================

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <div
      className={cn(
        "border-indigo-200 border-t-indigo-500 rounded-full animate-spin",
        sizeStyles[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
