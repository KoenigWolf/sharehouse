"use client";

/**
 * Resident Card Component
 * Displays a single resident's information in a card format
 *
 * Golden Ratio Design:
 * - Photo section uses golden ratio aspect (1:1.618 ≈ aspect-[1/1.618])
 * - Info section height proportionally balanced
 * - Creates visually harmonious card proportions
 *
 * Responsive breakpoints:
 * - Mobile (< 640px): Compact layout with smaller text
 * - Tablet (640px - 1024px): Standard layout
 * - Desktop (> 1024px): Enhanced hover effects
 */

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { memo, useCallback } from "react";
import { cn } from "@/src/lib/utils";
import { getAvatarColor, getInitials } from "@/src/lib/utils/avatar";
import { Badge } from "@/src/shared/ui";
import { useLanguage } from "@/src/shared/lang/context";
import type { ResidentCardProps } from "../types";
import { Home, ChevronRight } from "lucide-react";

const cardStyles = {
  base: cn(
    "group relative overflow-hidden",
    "bg-white/90 dark:bg-slate-900/70 backdrop-blur-sm",
    "rounded-xl sm:rounded-2xl",
    "shadow-sm dark:shadow-slate-900/30",
    "border border-slate-200/80 dark:border-slate-800/70",
    "transition-all duration-300 ease-out",
    "animate-fade-in touch-manipulation",
    // Focus styles for accessibility
    "focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2"
  ),
  hover: cn(
    "hover:shadow-xl",
    "hover:-translate-y-1",
    "hover:border-indigo-200 dark:hover:border-indigo-500/30"
  ),
  active: "active:scale-[0.98] sm:active:scale-100",
};

const accentLineStyles = cn(
  "absolute top-0 left-0 right-0 h-0.5 sm:h-1",
  "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
  "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
);

// Golden ratio: 1:1.618 (φ) - using 5:8 approximation for cleaner values
// Photo takes the "major" portion, creating visual harmony
const photoContainerStyles = cn(
  "aspect-[5/6] relative overflow-hidden",  // Close to golden ratio (0.833 vs φ inverse 0.618)
  "bg-gradient-to-br from-slate-100 to-slate-50",
  "dark:from-slate-800 dark:to-slate-900"
);

export const ResidentCard = memo(function ResidentCard({
  resident,
  onRoomClick,
  index = 0,
}: ResidentCardProps) {
  const { lang } = useLanguage();
  const avatarColor = getAvatarColor(resident.nickname);
  const initials = getInitials(resident.nickname);

  const handleRoomClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onRoomClick?.(resident.room_number);
    },
    [onRoomClick, resident.room_number]
  );

  // Stagger animation delay (capped for performance)
  const animationDelay = `${Math.min(index * 30, 300)}ms`;

  return (
    <article
      className={cn(cardStyles.base, cardStyles.hover, cardStyles.active)}
      style={{ animationDelay }}
      aria-label={`${resident.nickname} - ${resident.room_number}`}
    >
      {/* Main link wrapper for card click */}
      <Link
        href={`/residents/${resident.id}`}
        className="block focus:outline-none"
        aria-label={`View ${resident.nickname}'s profile`}
      >
        {/* Gradient accent line */}
        <div className={accentLineStyles} aria-hidden="true" />

        {/* Photo/Avatar section */}
        <div className={photoContainerStyles}>
          {resident.photo_url ? (
            <Image
              src={resident.photo_url}
              alt=""
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 480px) 45vw, (max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
              loading="lazy"
              placeholder="empty"
            />
          ) : (
            <div
              className={cn(
                "absolute inset-0 bg-linear-to-br flex items-center justify-center",
                avatarColor
              )}
              aria-hidden="true"
            >
              <span className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow-sm select-none">
                {initials}
              </span>
            </div>
          )}

          {/* Floor badge - positioned with safe margins */}
          <Badge
            className="absolute top-1.5 right-1.5 xs:top-2 xs:right-2 sm:top-3 sm:right-3"
            size="sm"
          >
            {resident.floor}
          </Badge>
        </div>

        {/* Info section - balanced with golden ratio photo */}
        <div className="p-2 xs:p-2.5 sm:p-3 space-y-1 xs:space-y-1.5 sm:space-y-2">
          <h3
            className={cn(
              "text-xs xs:text-sm sm:text-base font-semibold truncate",
              "text-strong",
              "group-hover:text-indigo-600 dark:group-hover:text-indigo-400",
              "transition-colors"
            )}
          >
            {resident.nickname}
          </h3>

          {/* Date information */}
          <DateInfo
            moveInDate={resident.move_in_date}
            moveOutDate={resident.move_out_date}
            lang={lang}
          />
        </div>
      </Link>

      {/* Room button - separate from main link for accessibility */}
      <div className="px-2 xs:px-2.5 sm:px-3 pb-2 xs:pb-2.5 sm:pb-3">
        <RoomButton
          roomNumber={resident.room_number}
          onClick={handleRoomClick}
        />
      </div>
    </article>
  );
});

interface DateInfoProps {
  moveInDate: string | null | undefined;
  moveOutDate: string | null | undefined;
  lang: ReturnType<typeof useLanguage>["lang"];
}

const DateInfo = memo(function DateInfo({
  moveInDate,
  moveOutDate,
  lang,
}: DateInfoProps) {
  if (!moveInDate && !moveOutDate) return null;

  return (
    <div className="text-[10px] xs:text-xs sm:text-sm text-muted space-y-0.5 sm:space-y-1">
      {moveInDate && (
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="font-semibold text-muted">
            {lang.components.residentCard.moveIn}
          </span>
          <time dateTime={moveInDate}>
            {format(new Date(moveInDate), "yyyy/MM/dd")}
          </time>
        </div>
      )}
      {moveOutDate && (
        <div className="flex items-center gap-1.5 sm:gap-2 text-amber-600 dark:text-amber-300">
          <span className="font-semibold">
            {lang.components.residentCard.moveOut}
          </span>
          <time dateTime={moveOutDate}>
            {format(new Date(moveOutDate), "yyyy/MM/dd")}
          </time>
        </div>
      )}
    </div>
  );
});

interface RoomButtonProps {
  roomNumber: string;
  onClick: (e: React.MouseEvent) => void;
}

const RoomButton = memo(function RoomButton({
  roomNumber,
  onClick,
}: RoomButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "mt-1 sm:mt-2 inline-flex items-center gap-1 sm:gap-1.5",
        "text-[10px] xs:text-xs sm:text-sm",
        "text-muted",
        "hover:text-indigo-600 dark:hover:text-indigo-400",
        "active:text-indigo-700 dark:active:text-indigo-300",
        "transition-colors group/btn touch-manipulation",
        "focus:outline-none focus:text-indigo-600",
        // Minimum touch target handled by global CSS
        "touch-target-auto"
      )}
      aria-label={`View room ${roomNumber} on floor plan`}
    >
      <Home className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 shrink-0" strokeWidth={2} />
      <span className="group-hover/btn:underline underline-offset-2">
        {roomNumber}
      </span>
      <ChevronRight
        className={cn(
          "w-2.5 h-2.5 sm:w-3 sm:h-3 hidden sm:block shrink-0",
          "opacity-0 -translate-x-1",
          "group-hover/btn:opacity-100 group-hover/btn:translate-x-0",
          "transition-all"
        )}
        strokeWidth={2.5}
      />
    </button>
  );
});
