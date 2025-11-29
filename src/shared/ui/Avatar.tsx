"use client";

import Image from "next/image";
import { cn } from "@/src/lib/utils";
import { getAvatarColor, getInitials } from "@/src/lib/utils/avatar";

// ============================================
// Types
// ============================================

export interface AvatarProps {
  src?: string | null;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

// ============================================
// Styles
// ============================================

const sizeStyles = {
  sm: "w-8 h-8 text-xs",
  md: "w-12 h-12 text-sm",
  lg: "w-20 h-20 text-2xl",
  xl: "w-32 h-32 text-4xl",
};

// ============================================
// Component
// ============================================

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const initials = getInitials(name);
  const color = getAvatarColor(name);

  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden",
        sizeStyles[size],
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          fill
          className="object-cover"
          sizes={getSizes(size)}
        />
      ) : (
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br flex items-center justify-center",
            color
          )}
        >
          <span className="font-bold text-white drop-shadow-sm select-none">
            {initials}
          </span>
          {/* Decorative circles */}
          <div className="absolute -bottom-2 -right-2 w-1/3 h-1/3 bg-white/10 rounded-full" />
          <div className="absolute -top-1 -left-1 w-1/4 h-1/4 bg-white/10 rounded-full" />
        </div>
      )}
    </div>
  );
}

// ============================================
// Helpers
// ============================================

function getSizes(size: AvatarProps["size"]): string {
  switch (size) {
    case "sm":
      return "32px";
    case "md":
      return "48px";
    case "lg":
      return "80px";
    case "xl":
      return "128px";
    default:
      return "48px";
  }
}
