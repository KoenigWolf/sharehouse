"use client";

import { PageContainer } from "@/src/shared/layouts";
import { MeetingNotesList, useMeetingNotes } from "@/src/features/meetings";

export default function MeetingNotesPage() {
  const { notes, loading, error } = useMeetingNotes();

  return (
    <PageContainer>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <header className="mb-6 sm:mb-8">
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-300 uppercase tracking-wide">
            Residents Meeting
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            月次議事録アーカイブ
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
            毎月の住民会議の決定事項・アクションを保存します。日付順で最新から並びます。
          </p>
        </header>

        {loading && (
          <div className="text-sm text-slate-500 dark:text-slate-400">Loading meeting notes...</div>
        )}

        {error && (
          <div className="text-sm text-red-500 dark:text-red-400">
            Failed to load meeting notes: {error.message}
          </div>
        )}

        {!loading && !error && <MeetingNotesList notes={notes} />}
      </div>
    </PageContainer>
  );
}
