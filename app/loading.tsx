"use client";

/**
 * Global Loading UI
 * Shows during page transitions with skeleton UI
 */

import { PageContainer } from "@/src/shared/layouts";
import { Skeleton, SkeletonCard } from "@/src/shared/ui";

export default function Loading() {
  return (
    <PageContainer>
      <div className="relative animate-pulse">
        <div
          className="absolute inset-0 -z-10 bg-linear-to-b from-emerald-50/80 via-white to-transparent dark:from-teal-950/40 dark:via-slate-950/70 dark:to-transparent"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-14 space-y-8 sm:space-y-10">
          {/* Header Skeleton */}
          <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-white/85 dark:bg-slate-900/70 backdrop-blur-xl shadow-[0_25px_80px_-40px] shadow-emerald-500/25 p-6 sm:p-8 lg:p-10">
            <div className="absolute inset-0 opacity-70 pointer-events-none" aria-hidden="true">
              <div className="absolute -left-12 top-0 h-32 w-32 sm:h-44 sm:w-44 rounded-full bg-emerald-400/18 blur-3xl" />
              <div className="absolute right-0 top-10 h-32 w-40 sm:h-48 sm:w-52 rounded-full bg-amber-200/20 blur-3xl" />
            </div>

            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 sm:gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-2xl" />
                  <Skeleton className="h-7 w-24 rounded-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-10 w-64 sm:w-80" />
                  <Skeleton className="h-5 w-full max-w-md" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-8 w-20 rounded-full" />
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-8 w-20 rounded-full" />
                  <Skeleton className="h-8 w-24 rounded-full" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full lg:max-w-md">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-2xl" />
                ))}
              </div>
            </div>
          </section>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 lg:gap-5">
            {[...Array(14)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
