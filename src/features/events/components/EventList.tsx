"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import { format, differenceInDays, isToday, isTomorrow, isYesterday } from "date-fns";
import { cn } from "@/src/lib/utils";
import { useLanguage } from "@/src/shared/lang/context";
import type { EventInfo } from "../types";
import { MapPin, ChevronRight, Sparkles, Clock, CheckCircle } from "lucide-react";
import { designTokens, TagList, CardFooterMeta, EmptyStateCard } from "@/src/shared/ui";

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
    <section className="space-y-5 sm:space-y-7" aria-labelledby={`event-list-${variant}`}>
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-xl text-white",
              designTokens.gradient(isUpcoming ? "primary" : "neutral"),
              "shadow-lg shadow-emerald-500/25"
            )}
          >
            {isUpcoming ? (
              <Sparkles className="w-5 h-5" strokeWidth={2} />
            ) : (
              <CheckCircle className="w-5 h-5" strokeWidth={2} />
            )}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              {lang.components.events.eyebrow}
            </p>
            <h2
              id={`event-list-${variant}`}
              className="text-lg sm:text-xl font-bold text-strong"
            >
              {title}
            </h2>
          </div>
        </div>
        <span
          className={cn(
            "text-xs font-bold px-3 py-1.5 rounded-full",
            "shadow-sm",
            isUpcoming
              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-200"
              : "bg-slate-100 dark:bg-slate-800 text-muted dark:text-subtle"
          )}
        >
          {lang.components.events.countLabel(events.length)}
        </span>
      </header>

      {events.length === 0 ? (
        <EmptyStateCard message={emptyText} tone={isUpcoming ? "primary" : "neutral"} />
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
  const eventDate = useMemo(() => new Date(event.date), [event.date]);

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
        "group relative block rounded-3xl overflow-hidden",
        "transition-all duration-300 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl",
        "border border-slate-200/70 dark:border-slate-800/70 shadow-[0_18px_60px_-40px] shadow-emerald-500/18",
        "hover:-translate-y-[6px] hover:shadow-2xl hover:shadow-emerald-500/25 hover:border-emerald-200/80 dark:hover:border-emerald-700/60",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500"
      )}
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      <div
        className={cn(
          "absolute inset-0 pointer-events-none",
          "transition-opacity duration-300",
          isUpcoming ? "opacity-100" : "opacity-80"
        )}
      >
        <div className="absolute inset-0 bg-linear-to-r from-emerald-500/4 via-teal-500/4 to-amber-400/6 dark:from-emerald-400/6 dark:via-teal-400/5 dark:to-amber-300/7" />
        <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-white/50 dark:from-white/5 to-transparent" />
      </div>

      <div
        className={cn(
          "relative p-5 sm:p-6 space-y-4",
          "rounded-3xl"
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
                ? "bg-linear-to-br from-emerald-600 via-teal-500 to-amber-400 shadow-emerald-500/25"
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
              <h3 className="text-base sm:text-lg font-bold text-strong dark:text-white leading-tight line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {event.title}
              </h3>
              <ChevronRight
                className={cn(
                  "flex-shrink-0 w-5 h-5 mt-0.5",
                  "text-subtle dark:text-subtle",
                  "transition-all duration-300",
                  "group-hover:text-emerald-600 group-hover:translate-x-1"
                )}
                strokeWidth={2}
              />
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-subtle dark:text-subtle">
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
                      : "bg-slate-100 dark:bg-slate-700 text-muted dark:text-subtle"
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
          <p className="mt-3 text-sm text-muted dark:text-subtle leading-relaxed line-clamp-2">
            {event.description}
          </p>
        )}

        <TagList tags={event.tags || []} />

        <CardFooterMeta
          label={isUpcoming ? lang.components.events.spotlight : lang.components.events.archive}
          tone={isUpcoming ? "primary" : "neutral"}
          cta={lang.pages.common?.viewMore ?? "詳細を見る"}
          ctaIcon={<ChevronRight className="h-3.5 w-3.5" />}
        />
      </div>
    </Link>
  );
});
