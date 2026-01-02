"use client";

import { useEffect, useRef } from "react";
import { format } from "date-fns";
import { X, ExternalLink, Users, Clock3, FileText } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useLanguage } from "@/src/shared/lang/context";
import { useMeetingNote } from "../hooks";

interface MeetingDetailSheetProps {
  noteId: string | null;
  onClose: () => void;
}

export function MeetingDetailSheet({ noteId, onClose }: MeetingDetailSheetProps) {
  const { lang } = useLanguage();
  const { note, loading, error } = useMeetingNote(noteId || undefined);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Focus trap starter
  useEffect(() => {
    if (noteId) {
      dialogRef.current?.focus();
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [noteId]);

  if (!noteId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        tabIndex={-1}
        className={cn(
          "relative w-full sm:w-[540px] max-h-[90vh] overflow-auto",
          "bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl",
          "outline-none"
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-4 sm:px-5 pt-4 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-emerald-600 via-teal-500 to-amber-400 text-white flex items-center justify-center shadow shadow-emerald-500/20">
              <FileText className="w-4 h-4" />
            </div>
            <p className="text-sm font-semibold text-strong">{lang.pages.meetings.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-muted hover:text-strong hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label={lang.common.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 sm:px-5 py-4 space-y-4">
          {loading && <p className="text-sm text-muted">{lang.pages.meetings.loading}</p>}
          {error && (
            <p className="text-sm text-red-500 dark:text-red-400">
              {lang.common.errorPrefix} meeting: {error.message}
            </p>
          )}
          {!loading && !error && note && (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                  {format(new Date(note.date), "yyyy/MM/dd")}
                </span>
                {note.attendees.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                    <Users className="w-3.5 h-3.5" />
                    {lang.common.attendees}: {note.attendees.join(", ")}
                  </span>
                )}
                {note.docUrl && (
                  <button
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    onClick={() => window.open(note.docUrl!, "_blank", "noreferrer")}
                  >
                    {lang.common.viewOriginal}
                    <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold text-strong">{note.title}</h2>
                <p className="text-sm text-muted leading-relaxed whitespace-pre-line">{note.summary}</p>
              </div>

              <Section title={lang.components.meetingNotes.decisions} items={note.decisions} />
              <Section title={lang.components.meetingNotes.actions} items={note.actionItems} />

              {note.content && (
                <Section title="メモ" items={note.content.split("\n")} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-semibold text-strong">
        <Clock3 className="w-4 h-4 text-emerald-600" />
        {title}
      </div>
      <ul className="space-y-1.5 text-sm text-muted leading-relaxed">
        {items.map((item, idx) => (
          <li key={`${title}-${idx}`}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}
