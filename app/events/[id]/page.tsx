"use client";

import { use } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { PageContainer } from "@/src/shared/layouts";
import { useEvent } from "@/src/features/events";
import { useLanguage } from "@/src/shared/lang/context";
import { cn } from "@/src/lib/utils";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Tag,
  Clock,
  Sparkles,
  PartyPopper,
  CheckCircle,
} from "lucide-react";

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = use(params);
  const { lang } = useLanguage();
  const { event, loading, error } = useEvent(id);

  if (loading) {
    return (
      <PageContainer>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <EventDetailSkeleton />
        </div>
      </PageContainer>
    );
  }

  if (error || !event) {
    return (
      <PageContainer>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              {lang.common.notFound}
            </h2>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline mt-4"
            >
              <ArrowLeft className="w-4 h-4" />
              {lang.pages.events.backToEvents}
            </Link>
          </div>
        </div>
      </PageContainer>
    );
  }

  const dateLabel = format(new Date(event.date), "yyyy/MM/dd (EEE)");
  const isUpcoming = event.type === "upcoming";

  return (
    <PageContainer>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <Link
          href="/events"
          className={cn(
            "inline-flex items-center gap-2 mb-6 sm:mb-8",
            "text-sm font-medium text-slate-600 dark:text-slate-400",
            "hover:text-indigo-600 dark:hover:text-indigo-400",
            "transition-colors duration-200"
          )}
        >
          <ArrowLeft className="w-4 h-4" />
          {lang.pages.events.backToEvents}
        </Link>

        <div className="relative">
          <div
            className={cn(
              "absolute -inset-4 sm:-inset-6 rounded-3xl opacity-50",
              "bg-linear-to-br",
              isUpcoming
                ? "from-indigo-100 via-purple-50 to-pink-50 dark:from-indigo-950/50 dark:via-purple-950/30 dark:to-pink-950/20"
                : "from-slate-100 via-slate-50 to-slate-100 dark:from-slate-800/50 dark:via-slate-900/30 dark:to-slate-800/20"
            )}
          />

          <div className="relative space-y-6 sm:space-y-8">
            <header className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold",
                    isUpcoming
                      ? "bg-linear-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  )}
                >
                  {isUpcoming ? (
                    <Sparkles className="w-3 h-3" />
                  ) : (
                    <CheckCircle className="w-3 h-3" />
                  )}
                  {isUpcoming ? lang.components.events.upcoming : lang.components.events.past}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                {event.title}
              </h1>
            </header>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div
                className={cn(
                  "flex items-center gap-4 p-4 rounded-2xl",
                  "bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm",
                  "border border-slate-200/50 dark:border-slate-700/50",
                  "shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-xl",
                    "bg-linear-to-br from-amber-400 to-orange-500",
                    "shadow-lg shadow-amber-500/25"
                  )}
                >
                  <Calendar className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">
                    {lang.pages.events.date}
                  </p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {dateLabel}
                  </p>
                </div>
              </div>

              <div
                className={cn(
                  "flex items-center gap-4 p-4 rounded-2xl",
                  "bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm",
                  "border border-slate-200/50 dark:border-slate-700/50",
                  "shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-xl",
                    "bg-linear-to-br from-emerald-400 to-teal-500",
                    "shadow-lg shadow-emerald-500/25"
                  )}
                >
                  <MapPin className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">
                    {lang.pages.events.location}
                  </p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {event.location}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={cn(
                "p-6 sm:p-8 rounded-2xl",
                "bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm",
                "border border-slate-200/50 dark:border-slate-700/50",
                "shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50"
              )}
            >
              <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {event.description || lang.pages.events.noDescription}
              </p>
            </div>

            {event.tags && event.tags.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                  <Tag className="w-4 h-4" />
                  {lang.pages.events.tags}
                </div>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium",
                        "bg-linear-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700",
                        "text-slate-700 dark:text-slate-200",
                        "border border-slate-200/50 dark:border-slate-600/50",
                        "shadow-sm"
                      )}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </PageContainer>
  );
}

function EventDetailSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-pulse">
      <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
      <div className="space-y-4">
        <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded-full" />
        <div className="h-10 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
        <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
      </div>
      <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
    </div>
  );
}
