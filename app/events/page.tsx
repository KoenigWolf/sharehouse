"use client";

import { memo } from "react";
import { PageContainer } from "@/src/shared/layouts";
import { EventList, useEvents } from "@/src/features/events";
import { useLanguage } from "@/src/shared/lang/context";
import { cn } from "@/src/lib/utils";
import {
  CalendarDays,
  Sparkles,
  CheckCircle,
  Calendar,
  PartyPopper,
  TrendingUp,
} from "lucide-react";

export default function EventsPage() {
  const { lang } = useLanguage();
  const { upcoming, past, thisMonth, loading, error } = useEvents();

  return (
    <PageContainer>
      <div className="relative">
        <div
          className={cn(
            "absolute inset-0 -z-10",
            "bg-linear-to-b from-indigo-50/80 via-purple-50/40 to-transparent",
            "dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-transparent"
          )}
          aria-hidden="true"
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-14 space-y-10 sm:space-y-12 lg:space-y-16">
          <HeroSection
            lang={lang}
            upcomingCount={upcoming.length}
            pastCount={past.length}
            thisMonthCount={thisMonth.length}
          />

          {loading && <LoadingState lang={lang} />}

          {error && (
            <div
              className={cn(
                "p-4 rounded-xl",
                "bg-red-50 dark:bg-red-950/30",
                "border border-red-200 dark:border-red-800/50",
                "text-sm text-red-600 dark:text-red-400"
              )}
            >
              {lang.common.errorPrefix} events: {error.message}
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-12 sm:space-y-16">
              <EventList
                title={lang.pages.events.upcomingTitle}
                events={upcoming}
                emptyText={lang.pages.events.upcomingEmpty}
                variant="upcoming"
              />
              <EventList
                title={lang.pages.events.pastTitle}
                events={past}
                emptyText={lang.pages.events.pastEmpty}
                variant="past"
              />
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

interface HeroSectionProps {
  lang: ReturnType<typeof useLanguage>["lang"];
  upcomingCount: number;
  pastCount: number;
  thisMonthCount: number;
}

const HeroSection = memo(function HeroSection({
  lang,
  upcomingCount,
  pastCount,
  thisMonthCount,
}: HeroSectionProps) {
  return (
    <header className="relative">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl",
                "bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500",
                "shadow-xl shadow-indigo-500/25"
              )}
            >
              <PartyPopper className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2} />
            </div>
            <span
              className={cn(
                "text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider",
                "bg-linear-to-r from-indigo-500 to-purple-500 text-white",
                "shadow-lg shadow-indigo-500/25"
              )}
            >
              {lang.pages.events.eyebrow}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
            {lang.pages.events.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            {lang.pages.events.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 sm:gap-4">
          <StatCard
            icon={<Sparkles className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />}
            label={lang.pages.events.heroStats.upcoming}
            value={upcomingCount}
            variant="upcoming"
          />
          <StatCard
            icon={<Calendar className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />}
            label={lang.pages.events.heroStats.thisMonth}
            value={thisMonthCount}
            variant="thisMonth"
          />
          <StatCard
            icon={<CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />}
            label={lang.pages.events.heroStats.past}
            value={pastCount}
            variant="past"
          />
        </div>
      </div>
    </header>
  );
});

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  variant: "upcoming" | "thisMonth" | "past";
}

const StatCard = memo(function StatCard({ icon, label, value, variant }: StatCardProps) {
  const gradients = {
    upcoming: "from-indigo-500 to-purple-600",
    thisMonth: "from-amber-500 to-orange-600",
    past: "from-slate-500 to-slate-600",
  };

  const shadows = {
    upcoming: "shadow-indigo-500/20",
    thisMonth: "shadow-amber-500/20",
    past: "shadow-slate-500/20",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 rounded-xl",
        "bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm",
        "border border-slate-200/80 dark:border-slate-700/60",
        "shadow-lg",
        shadows[variant]
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg",
          "bg-linear-to-br text-white",
          gradients[variant]
        )}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
          {value}
        </p>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
          {label}
        </p>
      </div>
    </div>
  );
});

interface LoadingStateProps {
  lang: ReturnType<typeof useLanguage>["lang"];
}

const LoadingState = memo(function LoadingState({ lang }: LoadingStateProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 animate-pulse">
        <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
        <div className="h-6 w-40 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-40 rounded-2xl bg-slate-200 dark:bg-slate-700 animate-pulse"
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
    </div>
  );
});
