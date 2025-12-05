"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { PageContainer } from "@/src/shared/layouts";
import { useMeetingNote } from "@/src/features/meetings/hooks";
import { t } from "@/src/shared/lang";

export default function MeetingNoteDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;
  const { note, loading, error } = useMeetingNote(id);

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-6">
        <div className="flex items-center gap-3 text-sm text-emerald-600 dark:text-emerald-300 font-semibold">
          <Link href="/meetings" className="hover:underline">
            {t.pages.meetings.title}
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-600 dark:text-slate-300">
            {note?.title || id}
          </span>
        </div>

        {loading && (
          <p className="text-sm text-slate-500 dark:text-slate-400">{t.pages.meetings.loading}</p>
        )}

        {error && (
          <p className="text-sm text-red-500 dark:text-red-400">
            {t.common.errorPrefix} meeting: {error.message}
          </p>
        )}

        {!loading && !error && note && (
          <article className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/70 shadow-sm p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                {format(new Date(note.date), "yyyy/MM/dd")}
              </span>
              {note.attendees.length > 0 && (
                <span className="text-xs text-slate-600 dark:text-slate-300">
                  {t.common.attendees}: {note.attendees.join(", ")}
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{note.title}</h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              {note.summary}
            </p>

            <Section title={t.components.meetingNotes.decisions} items={note.decisions} />
            <Section title={t.components.meetingNotes.actions} items={note.actionItems} />

            {note.content && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">メモ</h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed">
                  {note.content}
                </p>
              </div>
            )}

            {note.docUrl && (
              <a
                href={note.docUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-300 hover:underline"
              >
                {t.common.viewOriginal}
              </a>
            )}
          </article>
        )}

        {!loading && !error && !note && (
          <p className="text-sm text-slate-500 dark:text-slate-400">{t.common.notFound}</p>
        )}
      </div>
    </PageContainer>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
      <ul className="mt-2 space-y-1.5">
        {items.map((item, idx) => (
          <li key={`${title}-${idx}`} className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            • {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
