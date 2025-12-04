import Link from "next/link";
import { format } from "date-fns";
import { ExternalLink, ListChecks, Users, FileText, ArrowUpRight } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useLanguage } from "@/src/shared/lang/context";
import type { MeetingNote } from "../types";

interface MeetingNotesListProps {
  notes: MeetingNote[];
}

export function MeetingNotesList({ notes }: MeetingNotesListProps) {
  const { lang } = useLanguage();
  return (
    <div className="space-y-4 sm:space-y-5">
      {notes.map((note) => (
        <Link key={note.id} href={`/meetings/${note.id}`} className="block group">
          <MeetingNoteCard note={note} lang={lang} />
        </Link>
      ))}
    </div>
  );
}

interface MeetingNoteCardProps {
  note: MeetingNote;
  lang: ReturnType<typeof useLanguage>["lang"];
}

function MeetingNoteCard({ note, lang }: MeetingNoteCardProps) {
  const meetingDate = format(new Date(note.date), "yyyy/MM/dd");

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/70",
        "bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm",
        "transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-200 dark:hover:border-indigo-700/60"
      )}
    >
      <div
        className={cn(
          "absolute inset-y-0 left-0 w-1.5 bg-linear-to-b from-indigo-500 to-purple-500",
          "group-hover:w-2 transition-all duration-300"
        )}
        aria-hidden="true"
      />
      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-900/40 dark:text-indigo-100">
            <FileText className="h-3.5 w-3.5" />
            {meetingDate}
          </span>
          {note.docUrl && (
            <button
              type="button"
              className={cn(
                "inline-flex items-center gap-1 text-xs font-semibold rounded-full px-3 py-1",
                "bg-slate-900 text-white dark:bg-white dark:text-slate-900",
                "hover:opacity-90 transition-colors"
              )}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(note.docUrl, "_blank", "noreferrer");
              }}
            >
              {lang.common.viewOriginal}
              <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white leading-tight">
              {note.title}
            </h3>
            <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 mt-1 shrink-0" />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {note.summary}
          </p>
        </div>

        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
          <InfoList title={lang.components.meetingNotes.decisions} items={note.decisions} />
          <InfoList title={lang.components.meetingNotes.actions} items={note.actionItems} />
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200">
            <Users className="h-3.5 w-3.5" />
            {lang.components.meetingNotes.attendees}
          </span>
          {note.attendees.map((name) => (
            <span
              key={name}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200 border border-slate-200/70 dark:border-slate-700/60"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

interface InfoListProps {
  title: string;
  items: string[];
}

function InfoList({ title, items }: InfoListProps) {
  return (
    <div className="rounded-xl border border-slate-100 dark:border-slate-800/70 bg-slate-50/60 dark:bg-slate-800/50 p-3 sm:p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
        <ListChecks className="h-4 w-4 text-indigo-500" />
        {title}
      </div>
      <ul className="mt-2 space-y-1.5">
        {items.map((item, idx) => (
          <li
            key={`${title}-${idx}`}
            className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed"
          >
            • {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
