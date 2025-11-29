"use client";

import { PageContainer } from "@/src/shared/layouts";
import { MeetingNotesList, useMeetingNotes } from "@/src/features/meetings";
import { t } from "@/src/shared/lang";

export default function MeetingNotesPage() {
  const { notes, loading, error } = useMeetingNotes();

  return (
    <PageContainer>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <header className="mb-6 sm:mb-8">
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-300 uppercase tracking-wide">
            {t.pages.meetings.eyebrow}
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {t.pages.meetings.title}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
            {t.pages.meetings.description}
          </p>
        </header>

        {loading && (
          <div className="text-sm text-slate-500 dark:text-slate-400">{t.pages.meetings.loading}</div>
        )}

        {error && (
          <div className="text-sm text-red-500 dark:text-red-400">
            {t.common.errorPrefix} meeting notes: {error.message}
          </div>
        )}

        {!loading && !error && <MeetingNotesList notes={notes} />}
      </div>
    </PageContainer>
  );
}
