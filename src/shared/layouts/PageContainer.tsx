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
        "bg-gradient-to-br from-slate-50 via-white to-indigo-50/30",
        "dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/20"
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
          "absolute -top-20 -right-20 sm:-top-40 sm:-right-40",
          "w-40 sm:w-80 h-40 sm:h-80",
          "bg-indigo-200/30 dark:bg-indigo-500/10",
          "rounded-full blur-3xl"
        )}
      />
      <div
        className={cn(
          "absolute top-10 -left-10 sm:top-20 sm:-left-20",
          "w-32 sm:w-60 h-32 sm:h-60",
          "bg-purple-200/30 dark:bg-purple-500/10",
          "rounded-full blur-3xl"
        )}
      />
      <div
        className={cn(
          "absolute bottom-0 right-1/4",
          "w-20 sm:w-40 h-20 sm:h-40",
          "bg-pink-200/20 dark:bg-pink-500/10",
          "rounded-full blur-3xl"
        )}
      />
    </div>
  );
}
