"use client";

import { useState } from "react";
import { PageContainer } from "@/src/shared/layouts";
import { useLanguage } from "@/src/shared/lang/context";
import { useEvents, EventList } from "@/src/features/events";
import { cn } from "@/src/lib/utils";
import { designTokens } from "@/src/shared/ui/designTokens";
import { Calendar, Loader2 } from "lucide-react";

export default function UpdatesPage() {
  const { lang } = useLanguage();
  const { upcoming, past, thisMonth, loading, error } = useEvents();
  const [tab] = useState<"events">("events"); // single tab (events only)

  return (
    <PageContainer>
      <div className="relative">
        <div className="absolute inset-0 -z-10 gradient-brand-soft" aria-hidden="true" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-14 space-y-8 sm:space-y-10">
          <header className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-2xl text-white",
                  "shadow-lg shadow-emerald-500/25",
                  "bg-linear-to-br from-emerald-600 via-teal-500 to-amber-400"
                )}
              >
                <Calendar className="w-6 h-6" strokeWidth={2.25} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  {lang.pages.events.eyebrow}
                </p>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-strong leading-tight">
                  {lang.pages.events.title}
                </h1>
              </div>
            </div>
          </header>

          <EventsTab
            lang={lang}
            upcoming={upcoming}
            past={past}
            thisMonthCount={thisMonth.length}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </PageContainer>
  );
}

function EventsTab({
  lang,
  upcoming,
  past,
  thisMonthCount,
  loading,
  error,
}: {
  lang: ReturnType<typeof useLanguage>["lang"];
  upcoming: ReturnType<typeof useEvents>["upcoming"];
  past: ReturnType<typeof useEvents>["past"];
  thisMonthCount: number;
  loading: boolean;
  error: Error | null;
}) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted">
        <Loader2 className="w-4 h-4 animate-spin" />
        {lang.pages.events.loading}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300">
        {lang.common.errorPrefix} events: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-10 sm:space-y-12">
      <div className="flex flex-wrap gap-3">
        <StatChip label={lang.pages.events.heroStats.upcoming} value={upcoming.length} tone="primary" />
        <StatChip label={lang.pages.events.heroStats.thisMonth} value={thisMonthCount} tone="warm" />
        <StatChip label={lang.pages.events.heroStats.past} value={past.length} tone="neutral" />
      </div>
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
  );
}

function NoticesTab() {
  return <NoticeBoard sections={noticeSections} />;
}

function StatChip({ label, value, tone = "primary" }: { label: string; value: number; tone?: Parameters<typeof designTokens.gradient>[0]; }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-white",
        "shadow-md",
        designTokens.gradient(tone as any),
        designTokens.shadow(tone as any)
      )}
    >
      <span className="text-base font-bold tabular-nums">{value}</span>
      <span>{label}</span>
    </span>
  );
}
