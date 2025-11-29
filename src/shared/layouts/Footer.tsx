"use client";

/**
 * Footer Layout Component
 */

import { cn } from "@/src/lib/utils";

// ============================================
// Component
// ============================================

export function Footer() {
  return (
    <footer className="py-6 sm:py-8 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            ShareHouse Resident Directory
          </p>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
            <span>Built with</span>
            <HeartIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
            <span>by our residents</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// Icons
// ============================================

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}
