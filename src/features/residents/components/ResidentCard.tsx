"use client";

/**
 * Resident Card Component
 * Displays a single resident's information in a card format
 */

import Image from "next/image";
import { format } from "date-fns";
import { cn } from "@/src/lib/utils";
import { getAvatarColor, getInitials } from "@/src/lib/utils/avatar";
import { Badge } from "@/src/shared/ui";
import { t } from "@/src/shared/lang";
import type { ResidentCardProps } from "../types";

// ============================================
// Component
// ============================================

export function ResidentCard({
  resident,
  onRoomClick,
  index = 0,
}: ResidentCardProps) {
  const avatarColor = getAvatarColor(resident.nickname);
  const initials = getInitials(resident.nickname);

  return (
    <div
      className={cn(
        "group relative bg-white dark:bg-slate-800/50 rounded-xl sm:rounded-2xl overflow-hidden",
        "shadow-sm hover:shadow-xl dark:shadow-slate-900/30",
        "border border-slate-100 dark:border-slate-700/50",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:border-indigo-200 dark:hover:border-indigo-500/30",
        "active:scale-[0.98] sm:active:scale-100",
        "animate-fade-in touch-manipulation"
      )}
      style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
    >
      {/* Gradient accent line */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-0.5 sm:h-1",
          "bg-indigo-500",
          "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        )}
      />

      {/* Photo/Avatar section */}
      <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800">
        {resident.photo_url ? (
          <Image
            src={resident.photo_url}
            alt={resident.nickname}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
            loading="lazy"
          />
        ) : (
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br flex items-center justify-center",
              avatarColor
            )}
          >
            <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow-sm select-none">
              {initials}
            </span>
          </div>
        )}

        {/* Floor badge */}
        <Badge className="absolute top-2 right-2 sm:top-3 sm:right-3" size="sm">
          {resident.floor}
        </Badge>
        {resident.status && (
          <Badge
            className="absolute top-2 left-2 sm:top-3 sm:left-3"
            size="sm"
            variant={resident.status === "in" ? "success" : "warning"}
          >
            {resident.status === "in"
              ? t.components.residentCard.status.in
              : t.components.residentCard.status.out}
          </Badge>
        )}
      </div>

      {/* Info section */}
      <div className="p-3 sm:p-4 space-y-2">
        <h3
          className={cn(
            "text-sm sm:text-base font-semibold truncate",
            "text-slate-800 dark:text-slate-100",
            "group-hover:text-indigo-600 dark:group-hover:text-indigo-400",
            "transition-colors"
          )}
        >
          {resident.nickname}
        </h3>

        <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 space-y-1">
          {resident.move_in_date && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                {t.components.residentCard.moveIn}
              </span>
              <span>{format(new Date(resident.move_in_date), "yyyy/MM/dd")}</span>
            </div>
          )}
          {resident.move_out_date && (
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-300">
              <span className="font-semibold">
                {t.components.residentCard.moveOut}
              </span>
              <span>{format(new Date(resident.move_out_date), "yyyy/MM/dd")}</span>
            </div>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onRoomClick?.(resident.room_number);
          }}
          className={cn(
            "mt-1.5 sm:mt-2 inline-flex items-center gap-1 sm:gap-1.5",
            "text-xs sm:text-sm text-slate-500 dark:text-slate-400",
            "hover:text-indigo-600 dark:hover:text-indigo-400",
            "active:text-indigo-700 dark:active:text-indigo-300",
            "transition-colors group/btn touch-manipulation"
          )}
        >
          <HomeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="group-hover/btn:underline underline-offset-2">
            {resident.room_number}
          </span>
          <ChevronRightIcon
            className={cn(
              "w-2.5 h-2.5 sm:w-3 sm:h-3 hidden sm:block",
              "opacity-0 -translate-x-1",
              "group-hover/btn:opacity-100 group-hover/btn:translate-x-0",
              "transition-all"
            )}
          />
        </button>
      </div>
    </div>
  );
}

// ============================================
// Icons
// ============================================

function HomeIcon({ className }: { className?: string }) {
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
        strokeWidth={1.5}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
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
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}
