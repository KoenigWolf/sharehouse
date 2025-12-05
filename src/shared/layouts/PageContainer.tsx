"use client";

/**
 * Page Container Layout Component
 * Provides consistent page structure with background effects
 */

import { cn } from "@/src/lib/utils";
import { Header } from "./Header";
import { Footer } from "./Footer";

export interface PageContainerProps {
  children: React.ReactNode;
  showFooter?: boolean;
  className?: string;
}

export function PageContainer({
  children,
  showFooter = true,
  className,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "min-h-screen",
        "bg-[radial-gradient(circle_at_8%_20%,#d5f2ed_0,transparent_32%),radial-gradient(circle_at_85%_15%,#ffe1b6_0,transparent_26%),linear-gradient(180deg,#f6f1e8,#f0f4f6)]",
        "dark:bg-[radial-gradient(circle_at_12%_18%,rgba(59,168,156,0.18),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(255,171,92,0.12),transparent_24%),linear-gradient(180deg,#0b1515,#0f1d1c)]"
      )}
    >
      <Header />

      {/* Background decoration */}
      <BackgroundDecoration />

      <main className={cn("relative", className)}>{children}</main>

      {showFooter && <Footer />}
    </div>
  );
}

function BackgroundDecoration() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div
        className={cn(
          "absolute -top-16 -right-14 sm:-top-36 sm:-right-32",
          "w-36 sm:w-72 h-36 sm:h-72",
          "bg-emerald-200/40 dark:bg-emerald-500/15",
          "rounded-full blur-3xl"
        )}
      />
      <div
        className={cn(
          "absolute top-12 -left-14 sm:top-16 sm:-left-24",
          "w-32 sm:w-56 h-32 sm:h-56",
          "bg-amber-200/40 dark:bg-amber-500/15",
          "rounded-full blur-3xl"
        )}
      />
      <div
        className={cn(
          "absolute bottom-0 right-1/4",
          "w-20 sm:w-40 h-20 sm:h-40",
          "bg-teal-200/30 dark:bg-teal-500/15",
          "rounded-full blur-3xl"
        )}
      />
    </div>
  );
}
