"use client";

/**
 * Resident Detail Page
 * Displays detailed information about a single resident
 */

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { PageContainer } from "@/src/shared/layouts";
import { Badge } from "@/src/shared/ui";
import { useResident } from "@/src/features/residents";
import { useLanguage } from "@/src/shared/lang/context";
import { getAvatarColor, getInitials } from "@/src/lib/utils/avatar";
import { cn } from "@/src/lib/utils";

export default function ResidentDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;
  const { resident, loading, error } = useResident(id);
  const { lang } = useLanguage();

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Back link */}
        <Link
          href="/"
          className={cn(
            "inline-flex items-center gap-2",
            "text-sm text-indigo-600 dark:text-indigo-400",
            "hover:text-indigo-700 dark:hover:text-indigo-300",
            "font-medium mb-6",
            "transition-colors"
          )}
        >
          <ArrowLeftIcon className="w-4 h-4" />
          {lang.pages.residentDetail.backToList}
        </Link>

        {/* Loading state */}
        {loading && (
          <div className="animate-pulse space-y-6">
            <div className="aspect-square max-w-xs mx-auto rounded-2xl bg-slate-200 dark:bg-slate-700" />
            <div className="space-y-3">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mx-auto" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mx-auto" />
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400">
              {lang.common.errorPrefix}: {error.message}
            </p>
          </div>
        )}

        {/* Not found */}
        {!loading && !error && !resident && (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">
              {lang.common.notFound}
            </p>
          </div>
        )}

        {/* Resident detail */}
        {!loading && !error && resident && (
          <article className="space-y-6">
            {/* Photo */}
            <div
              className={cn(
                "aspect-square max-w-xs mx-auto relative overflow-hidden",
                "rounded-2xl sm:rounded-3xl",
                "shadow-lg",
                "bg-gradient-to-br from-slate-100 to-slate-50",
                "dark:from-slate-700 dark:to-slate-800"
              )}
            >
              {resident.photo_url ? (
                <Image
                  src={resident.photo_url}
                  alt={resident.nickname}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 80vw, 320px"
                  priority
                />
              ) : (
                <div
                  className={cn(
                    "absolute inset-0 flex items-center justify-center",
                    "bg-gradient-to-br",
                    getAvatarColor(resident.nickname)
                  )}
                >
                  <span className="text-5xl sm:text-6xl font-bold text-white drop-shadow-sm">
                    {getInitials(resident.nickname)}
                  </span>
                </div>
              )}
            </div>

            {/* Name and badge */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                {resident.nickname}
              </h1>
              <Badge size="md">{resident.floor}</Badge>
            </div>

            {/* Info card */}
            <div
              className={cn(
                "rounded-2xl border border-slate-200 dark:border-slate-700/60",
                "bg-white dark:bg-slate-800/70",
                "shadow-sm p-5 sm:p-6",
                "space-y-4"
              )}
            >
              <InfoRow
                label={lang.pages.residentDetail.room}
                value={resident.room_number}
              />
              <InfoRow
                label={lang.pages.residentDetail.floor}
                value={resident.floor}
              />
              <InfoRow
                label={lang.pages.residentDetail.moveIn}
                value={
                  resident.move_in_date
                    ? format(new Date(resident.move_in_date), "yyyy/MM/dd")
                    : lang.pages.residentDetail.notSet
                }
              />
              <InfoRow
                label={lang.pages.residentDetail.moveOut}
                value={
                  resident.move_out_date
                    ? format(new Date(resident.move_out_date), "yyyy/MM/dd")
                    : lang.pages.residentDetail.notSet
                }
                highlight={!!resident.move_out_date}
              />
            </div>

            {/* Back button */}
            <div className="text-center pt-4">
              <Link
                href="/"
                className={cn(
                  "inline-flex items-center justify-center",
                  "px-4 xs:px-5 py-2 xs:py-2.5",
                  "text-sm xs:text-base font-medium",
                  "rounded-lg xs:rounded-xl",
                  "border-2 border-slate-200 dark:border-slate-700",
                  "text-slate-700 dark:text-slate-300",
                  "hover:bg-slate-50 dark:hover:bg-slate-800",
                  "transition-all duration-200",
                  "min-h-[40px] xs:min-h-[44px]"
                )}
              >
                {lang.pages.residentDetail.backToList}
              </Link>
            </div>
          </article>
        )}
      </div>
    </PageContainer>
  );
}

// ============================================
// Sub-components
// ============================================

interface InfoRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function InfoRow({ label, value, highlight }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700/50 last:border-0">
      <span className="text-sm text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <span
        className={cn(
          "text-sm font-medium",
          highlight
            ? "text-amber-600 dark:text-amber-400"
            : "text-slate-900 dark:text-white"
        )}
      >
        {value}
      </span>
    </div>
  );
}

// ============================================
// Icons
// ============================================

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 19l-7-7m0 0l7-7m-7 7h18"
      />
    </svg>
  );
}
