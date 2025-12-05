"use client";

/**
 * Profile Edit Loading UI
 * Shows skeleton during page load
 */

import { PageContainer } from "@/src/shared/layouts";
import { Skeleton } from "@/src/shared/ui";

export default function ProfileEditLoading() {
  return (
    <PageContainer showFooter={false}>
      <div className="relative animate-pulse">
        <div
          className="absolute inset-0 -z-10 bg-linear-to-b from-emerald-50/80 via-white to-transparent dark:from-teal-950/40 dark:via-slate-950/70 dark:to-transparent"
          aria-hidden="true"
        />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 sm:space-y-8">
          {/* Breadcrumb Skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <span className="text-subtle">/</span>
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Header Skeleton */}
          <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-white/90 dark:bg-slate-900/70 backdrop-blur-xl shadow-[0_25px_80px_-40px] shadow-emerald-500/25 p-6 sm:p-8">
            <div className="absolute inset-0 opacity-70 pointer-events-none" aria-hidden="true">
              <div className="absolute -left-8 top-0 h-28 w-28 sm:h-36 sm:w-36 rounded-full bg-emerald-500/18 blur-3xl" />
              <div className="absolute right-0 bottom-0 h-32 w-40 sm:h-44 sm:w-52 rounded-full bg-emerald-400/10 blur-3xl" />
            </div>
            <div className="relative space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <Skeleton className="h-7 w-28 rounded-full" />
              </div>
              <Skeleton className="h-10 w-48 sm:w-64" />
              <Skeleton className="h-5 w-full max-w-lg" />
            </div>
          </section>

          {/* Form Skeleton */}
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.4fr,1fr]">
            <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-white/90 dark:bg-slate-900/70 backdrop-blur-xl shadow-[0_25px_80px_-40px] shadow-emerald-500/20 p-6 sm:p-8 space-y-6">
              {/* Avatar Skeleton */}
              <div className="flex flex-col items-center gap-4">
                <Skeleton className="w-24 h-24 rounded-full" variant="circular" />
                <Skeleton className="h-10 w-32 rounded-lg" />
              </div>

              {/* Form Fields Skeleton */}
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                  </div>
                ))}
              </div>

              {/* Button Skeleton */}
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>

            {/* Side Panel Skeleton */}
            <aside className="rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-white/90 dark:bg-slate-900/70 backdrop-blur-xl shadow-[0_25px_80px_-40px] shadow-emerald-500/20 p-5 sm:p-6 space-y-4 h-fit">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-2 w-2 rounded-full" variant="circular" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
