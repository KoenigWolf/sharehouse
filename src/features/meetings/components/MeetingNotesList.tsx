import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/src/lib/utils";
import { useLanguage } from "@/src/shared/lang/context";
import { Card, CardContent } from "@/components/ui/card";
import type { MeetingNote } from "../types";
import { ExternalLink } from "lucide-react";

interface MeetingNotesListProps {
  notes: MeetingNote[];
}

export function MeetingNotesList({ notes }: MeetingNotesListProps) {
  const { lang } = useLanguage();
  return (
    <div className="space-y-4 sm:space-y-5">
      {notes.map((note) => (
        <Link key={note.id} href={`/meetings/${note.id}`} className="block">
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
    <Card className={cn(
      "hover:shadow-lg transition-all duration-200 hover:-translate-y-1",
      "dark:bg-slate-800/70 dark:border-slate-700/60"
    )}>
      <CardContent className="p-0">
        <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700/60">
          <div className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200">
            {meetingDate}
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
              {note.title}
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {note.summary}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-5 p-4 sm:p-5">
          <InfoList title={lang.components.meetingNotes.decisions} items={note.decisions} />
          <InfoList title={lang.components.meetingNotes.actions} items={note.actionItems} />
        </div>

        <div className="flex flex-wrap gap-2 px-4 sm:px-5 pb-4 sm:pb-5 items-center">
          <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {lang.components.meetingNotes.attendees}
          </span>
          {note.attendees.map((name) => (
            <span
              key={name}
              className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
            >
              {name}
            </span>
          ))}
          {note.docUrl && (
            <a
              href={note.docUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(
                "ml-auto inline-flex items-center gap-1 text-sm font-medium",
                "text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200",
                "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg px-2 py-1"
              )}
            >
              {lang.common.viewOriginal}
              <ExternalLink className="w-4 h-4" strokeWidth={2} />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface InfoListProps {
  title: string;
  items: string[];
}

function InfoList({ title, items }: InfoListProps) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</h4>
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

