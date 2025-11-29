"use client";

import { PageContainer } from "@/src/shared/layouts";
import { EventList, useEvents } from "@/src/features/events";
import { t } from "@/src/shared/lang";

export default function EventsPage() {
  const { upcoming, past, loading, error } = useEvents();

  return (
    <PageContainer>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-8 sm:space-y-10">
        <header className="space-y-2 sm:space-y-3">
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-300 uppercase tracking-wide">
            {t.pages.events.eyebrow}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {t.pages.events.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
            {t.pages.events.description}
          </p>
        </header>

        {loading && (
          <div className="text-sm text-slate-500 dark:text-slate-400">{t.pages.events.loading}</div>
        )}
        {error && (
          <div className="text-sm text-red-500 dark:text-red-400">
            {t.common.errorPrefix} events: {error.message}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-8 sm:space-y-10">
            <EventList title={t.pages.events.upcomingTitle} events={upcoming} emptyText={t.pages.events.upcomingEmpty} />
            <EventList title={t.pages.events.pastTitle} events={past} emptyText={t.pages.events.pastEmpty} />
          </div>
        )}
      </div>
    </PageContainer>
  );
}
