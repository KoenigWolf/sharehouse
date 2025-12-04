"use client";

/**
 * Floor Plan Modal Component
 * Displays room details and floor plan
 */

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/src/lib/utils";
import { Spinner } from "@/src/shared/ui";
import { t } from "@/src/shared/lang";
import { getMockRoom } from "@/src/features/residents";
import type { Room } from "@/src/shared/types";
import type { FloorPlanModalProps } from "../types";
import { X, Home, Building2, FolderOpen, ImageIcon } from "lucide-react";

export function FloorPlanModal({ roomNumber, onClose }: FloorPlanModalProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  }, [onClose]);

  // Fetch room data
  useEffect(() => {
    if (!roomNumber) {
      setRoom(null);
      setIsVisible(false);
      return;
    }

    const fetchRoom = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 200));
        const data = getMockRoom(roomNumber);
        setRoom(data);
        setIsVisible(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomNumber]);

  // Handle escape key and scroll lock
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    if (roomNumber) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [roomNumber, handleClose]);

  if (!roomNumber) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={cn(
          "relative w-full sm:w-auto sm:min-w-[400px] sm:max-w-lg",
          "max-h-[90vh] sm:max-h-[85vh] overflow-auto",
          "bg-white dark:bg-slate-800",
          "rounded-t-3xl sm:rounded-3xl shadow-2xl",
          "transition-all duration-300 transform",
          isVisible
            ? "opacity-100 translate-y-0 sm:scale-100"
            : "opacity-0 translate-y-full sm:translate-y-0 sm:scale-95"
        )}
      >
        {/* Drag handle for mobile */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
        </div>

        {/* Header gradient */}
        <div className="absolute top-0 left-0 right-0 h-28 sm:h-32 bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-t-3xl" />

        {/* Close button */}
        <button
          onClick={handleClose}
          className={cn(
            "absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 rounded-full",
            "bg-white/20 text-white backdrop-blur-sm",
            "hover:bg-white/30 active:bg-white/40",
            "transition-colors duration-200 touch-manipulation"
          )}
          aria-label="Close modal"
        >
          <X className="w-5 h-5" strokeWidth={2.5} />
        </button>

        {/* Room icon */}
        <div className="relative pt-6 sm:pt-8 pb-3 sm:pb-4 flex justify-center">
          <div className="relative">
            <div
              className={cn(
                "w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl",
                "bg-white dark:bg-slate-700 shadow-xl",
                "flex items-center justify-center",
                "border-4 border-white dark:border-slate-800"
              )}
            >
              <Home className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-500" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 pb-6 sm:pb-8">
          {loading ? (
            <div className="flex flex-col items-center py-8">
              <Spinner size="lg" />
              <p className="mt-4 text-sm text-slate-500">{t.components.floorPlan.loading}</p>
            </div>
          ) : room ? (
            <>
              {/* Room title */}
              <div className="text-center mb-5 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
                  {t.components.floorPlan.roomTitlePrefix} {room.room_number}
                </h2>
                <p className="text-slate-500 dark:text-slate-400">{room.floor}</p>
              </div>

              {/* Room details */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
                <InfoCard
                  icon={<Building2 className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />}
                  iconBg="bg-indigo-100 dark:bg-indigo-900/30"
                  iconColor="text-indigo-500"
                  label={t.components.floorPlan.roomNumberLabel}
                  value={room.room_number}
                />
                <InfoCard
                  icon={<FolderOpen className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />}
                  iconBg="bg-purple-100 dark:bg-purple-900/30"
                  iconColor="text-purple-500"
                  label={t.components.floorPlan.floorLabel}
                  value={room.floor}
                />
              </div>

              {/* Floor plan */}
              {room.floor_plan_url ? (
                <div className="relative aspect-4/3 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-700">
                  <Image
                    src={room.floor_plan_url}
                    alt={`Floor plan for room ${room.room_number}`}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <FloorPlanPlaceholder />
              )}
            </>
          ) : null}
        </div>

        {/* Safe area for mobile */}
        <div className="h-safe-area-inset-bottom sm:hidden" />
      </div>
    </div>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
}

function InfoCard({ icon, iconBg, iconColor, label, value }: InfoCardProps) {
  return (
    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
      <div
        className={cn(
          "w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-1.5 sm:mb-2",
          "rounded-lg sm:rounded-xl flex items-center justify-center",
          iconBg
        )}
      >
        <span className={iconColor}>{icon}</span>
      </div>
      <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function FloorPlanPlaceholder() {
  return (
    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center">
      <div
        className={cn(
          "w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4",
          "rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-600",
          "flex items-center justify-center"
        )}
      >
        <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" strokeWidth={1.5} />
      </div>
      <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
        Floor plan not available
      </p>
      <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 mt-1">
        Coming soon
      </p>
    </div>
  );
}

