import { format } from "date-fns";
import { cn } from "@/src/lib/utils";
import { t } from "@/src/shared/lang";
import { Card, CardContent } from "@/components/ui/card";
import type { EventInfo } from "../types";

interface EventListProps {
  title: string;
  events: EventInfo[];
  emptyText: string;
}

export function EventList({ title, events, emptyText }: EventListProps) {
  return (
    <section className="space-y-3 sm:space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
          {title}
        </h2>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          {t.components.events.countLabel(events.length)}
        </span>
      </header>
      {events.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">{emptyText}</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </section>
  );
}

interface EventCardProps {
  event: EventInfo;
}

function EventCard({ event }: EventCardProps) {
  const dateLabel = format(new Date(event.date), "yyyy/MM/dd");

  return (
    <Card className={cn(
      "hover:shadow-lg transition-all duration-200 hover:-translate-y-1",
      "dark:bg-slate-800/70 dark:border-slate-700/60"
    )}>
      <CardContent className="p-4 sm:p-5 space-y-3">
        <div className="flex items-start gap-3">
          <div className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200">
            {dateLabel}
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
              {event.title}
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{event.location}</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {event.description}
        </p>

        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
