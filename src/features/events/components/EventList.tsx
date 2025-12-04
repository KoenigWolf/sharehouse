"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import { format, differenceInDays, isToday, isTomorrow, isYesterday } from "date-fns";
import { cn } from "@/src/lib/utils";
import { useLanguage } from "@/src/shared/lang/context";
import type { EventInfo } from "../types";
import {
  Calendar,
  MapPin,
  ChevronRight,
  Sparkles,
  PartyPopper,
  Clock,
  CheckCircle,
  CalendarDays,
} from "lucide-react";

interface EventListProps {
  title: string;
  events: EventInfo[];
  emptyText: string;
  variant?: "upcoming" | "past";
}

export const EventList = memo(function EventList({
  title,
  events,
  emptyText,
  variant = "upcoming",
}: EventListProps) {
  const { lang } = useLanguage();
  const isUpcoming = variant === "upcoming";

  return (
    <section className="space-y-4 sm:space-y-6" aria-labelledby={`event-list-${variant}`}>
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-xl",
              "shadow-lg",
              isUpcoming
                ? "bg-linear-to-br from-indigo-500 to-purple-600 shadow-indigo-500/25"
                : "bg-linear-to-br from-slate-500 to-slate-600 shadow-slate-500/25"
            )}
          >
            {isUpcoming ? (
              <Sparkles className="w-5 h-5 text-white" strokeWidth={2} />
            ) : (
              <CheckCircle className="w-5 h-5 text-white" strokeWidth={2} />
            )}
          </div>
          <h2
            id={`event-list-${variant}`}
            className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white"
          >
            {title}
          </h2>
        </div>
        <span
          className={cn(
            "text-xs font-bold px-3 py-1.5 rounded-full",
            "shadow-sm",
            isUpcoming
              ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
          )}
        >
          {lang.components.events.countLabel(events.length)}
        </span>
      </header>

      {events.length === 0 ? (
        <EmptyState message={emptyText} isUpcoming={isUpcoming} />
      ) : (
        <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
          {events.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              index={index}
              isUpcoming={isUpcoming}
            />
          ))}
        </div>
      )}
    </section>
  );
});

interface EventCardProps {
  event: EventInfo;
  index: number;
  isUpcoming: boolean;
}

const EventCard = memo(function EventCard({ event, index, isUpcoming }: EventCardProps) {
  const { lang } = useLanguage();
  const eventDate = new Date(event.date);
  const dateLabel = format(eventDate, "M/d (EEE)");

  const relativeLabel = useMemo(() => {
    const now = new Date();
    const days = differenceInDays(eventDate, now);

    if (isToday(eventDate)) return lang.components.events.today;
    if (isTomorrow(eventDate)) return lang.components.events.tomorrow;
    if (isYesterday(eventDate)) return lang.components.events.yesterday;

    if (days > 0) return lang.components.events.daysUntil(days);
    if (days < 0) return lang.components.events.daysAgo(Math.abs(days));

    return null;
  }, [eventDate, lang]);

  return (
    <Link
      href={`/events/${event.id}`}
      className={cn(
        "group relative block",
        "rounded-2xl overflow-hidden",
        "transition-all duration-300",
        "hover:shadow-xl hover:-translate-y-1",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        isUpcoming
          ? "focus-visible:ring-indigo-500"
          : "focus-visible:ring-slate-500"
      )}
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100",
          "transition-opacity duration-300",
          "bg-linear-to-br",
          isUpcoming
            ? "from-indigo-500/5 to-purple-500/5"
            : "from-slate-500/5 to-slate-400/5"
        )}
      />

      <div
        className={cn(
          "relative p-5 sm:p-6",
          "bg-white dark:bg-slate-800/90",
          "border border-slate-200/80 dark:border-slate-700/60",
          "rounded-2xl",
          "shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50"
        )}
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex-shrink-0 flex flex-col items-center justify-center",
              "w-14 h-14 sm:w-16 sm:h-16 rounded-xl",
              "shadow-lg",
              "transition-transform duration-300 group-hover:scale-105",
              isUpcoming
                ? "bg-linear-to-br from-indigo-500 to-purple-600 shadow-indigo-500/25"
                : "bg-linear-to-br from-slate-400 to-slate-500 shadow-slate-500/25"
            )}
          >
            <span className="text-[10px] sm:text-xs font-medium text-white/80 uppercase">
              {format(eventDate, "MMM")}
            </span>
            <span className="text-xl sm:text-2xl font-bold text-white leading-none">
              {format(eventDate, "d")}
            </span>
          </div>

          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {event.title}
              </h3>
              <ChevronRight
                className={cn(
                  "flex-shrink-0 w-5 h-5 mt-0.5",
                  "text-slate-400 dark:text-slate-500",
                  "transition-all duration-300",
                  "group-hover:text-indigo-500 group-hover:translate-x-1"
                )}
                strokeWidth={2}
              />
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
                {event.location}
              </span>
              {relativeLabel && (
                <span
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium",
                    isUpcoming
                      ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                  )}
                >
                  <Clock className="w-3 h-3" strokeWidth={2.5} />
                  {relativeLabel}
                </span>
              )}
            </div>
          </div>
        </div>

        {event.description && (
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
            {event.description}
          </p>
        )}

        {event.tags && event.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {event.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className={cn(
                  "text-xs px-2.5 py-1 rounded-full font-medium",
                  "bg-slate-100 dark:bg-slate-700/80",
                  "text-slate-600 dark:text-slate-300",
                  "border border-slate-200/50 dark:border-slate-600/50"
                )}
              >
                #{tag}
              </span>
            ))}
            {event.tags.length > 3 && (
              <span className="text-xs px-2.5 py-1 text-slate-400 dark:text-slate-500">
                +{event.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
});

interface EmptyStateProps {
  message: string;
  isUpcoming: boolean;
}

const EmptyState = memo(function EmptyState({ message, isUpcoming }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 sm:py-16",
        "rounded-2xl border-2 border-dashed",
        isUpcoming
          ? "border-indigo-200 dark:border-indigo-800/50 bg-indigo-50/50 dark:bg-indigo-950/20"
          : "border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center w-14 h-14 rounded-full mb-4",
          isUpcoming
            ? "bg-indigo-100 dark:bg-indigo-900/50"
            : "bg-slate-100 dark:bg-slate-800"
        )}
      >
        <CalendarDays
          className={cn(
            "w-7 h-7",
            isUpcoming
              ? "text-indigo-500 dark:text-indigo-400"
              : "text-slate-400 dark:text-slate-500"
          )}
          strokeWidth={1.5}
        />
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-xs">
        {message}
      </p>
    </div>
  );
});
