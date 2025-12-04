"use client";

/**
 * Home Page
 * Displays the resident directory with filtering and search
 */

import { useState } from "react";
import { PageContainer } from "@/src/shared/layouts";
import { ResidentGrid, useResidents } from "@/src/features/residents";
import { FloorPlanModal } from "@/src/features/rooms";
import { TOTAL_ROOMS } from "@/src/shared/constants";
import { useLanguage } from "@/src/shared/lang/context";

export default function HomePage() {
  const { residents, loading, error } = useResidents();
  const { lang } = useLanguage();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const occupancy = calculateOccupancy(residents);

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Page Header */}
        <PageHeader
          lang={lang}
          residentCount={residents.length}
          vacant={occupancy.vacant}
          moveIns={occupancy.moveIns}
          moveOuts={occupancy.moveOuts}
        />

        {/* Main Content */}
        {error ? (
          <ErrorState message={error.message} lang={lang} />
        ) : (
          <ResidentGrid
            residents={residents}
            isLoading={loading}
            onRoomClick={setSelectedRoom}
          />
        )}
      </div>

      {/* Floor Plan Modal */}
      <FloorPlanModal
        roomNumber={selectedRoom}
        onClose={() => setSelectedRoom(null)}
      />
    </PageContainer>
  );
}

interface PageHeaderProps {
  residentCount: number;
  vacant: number;
  moveIns: number;
  moveOuts: number;
}

function PageHeader({ residentCount, vacant, moveIns, moveOuts, lang }: PageHeaderProps & { lang: ReturnType<typeof useLanguage>["lang"] }) {
  return (
    <div className="mb-6 sm:mb-8 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Title */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">
            {lang.pages.home.title.replace(lang.pages.home.titleAccent, "")}
            <span className="gradient-text">{lang.pages.home.titleAccent}</span>
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {lang.pages.home.subtitle}
          </p>
        </div>

        {/* Stats - inline */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          <StatPill value={residentCount} label={lang.pages.home.residentsLabel} color="indigo" />
          <StatPill value={vacant} label={lang.pages.home.vacantLabel} color="purple" />
          <StatPill value={moveIns} label={lang.pages.home.moveInsLabel} color="emerald" icon="down" />
          <StatPill value={moveOuts} label={lang.pages.home.moveOutsLabel} color="rose" icon="up" />
        </div>
      </div>
    </div>
  );
}

interface StatPillProps {
  value: number;
  label: string;
  color: "indigo" | "purple" | "emerald" | "rose";
  icon?: "up" | "down";
}

function StatPill({ value, label, color, icon }: StatPillProps) {
  const styles = {
    indigo: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  };

  return (
    <div className={`${styles[color]} flex items-center gap-1.5 px-3 py-1.5 rounded-full`}>
      {icon === "down" && <span className="text-xs">↓</span>}
      {icon === "up" && <span className="text-xs">↑</span>}
      <span className="text-lg font-bold">{value}</span>
      <span className="text-xs font-medium opacity-80 hidden sm:inline">{label}</span>
    </div>
  );
}

function ErrorState({ message, lang }: { message: string; lang: ReturnType<typeof useLanguage>["lang"] }) {
  return (
    <div className="text-center py-12 sm:py-16 animate-fade-in">
      <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
        <svg
          className="w-7 h-7 sm:w-8 sm:h-8 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 className="text-base sm:text-lg font-medium text-slate-800 dark:text-white">
        {lang.pages.home.errorTitle}
      </h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{message || lang.pages.home.errorMessage}</p>
    </div>
  );
}

function calculateOccupancy(residents: ReturnType<typeof useResidents>["residents"]) {
  const today = new Date();
  const currentMonth = today.toISOString().slice(0, 7); // yyyy-MM

  const occupied = residents.filter((resident) => {
    if (resident.move_out_date && new Date(resident.move_out_date) < today) return false;
    return true;
  }).length;

  const vacant = Math.max(TOTAL_ROOMS - occupied, 0);

  const moveIns = residents.filter(
    (r) => r.move_in_date && r.move_in_date.startsWith(currentMonth)
  ).length;
  const moveOuts = residents.filter(
    (r) => r.move_out_date && r.move_out_date.startsWith(currentMonth)
  ).length;

  return { occupied, vacant, moveIns, moveOuts };
}
