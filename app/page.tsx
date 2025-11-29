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

// ============================================
// Component
// ============================================

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

// ============================================
// Sub-components
// ============================================

interface PageHeaderProps {
  residentCount: number;
  vacant: number;
  moveIns: number;
  moveOuts: number;
}

function PageHeader({ residentCount, vacant, moveIns, moveOuts, lang }: PageHeaderProps & { lang: ReturnType<typeof useLanguage>["lang"] }) {
  return (
    <div className="mb-6 sm:mb-8 lg:mb-10 animate-slide-up">
      {/* Title */}
      <div className="mb-5 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white">
          {lang.pages.home.title.replace(lang.pages.home.titleAccent, "")}
          <span className="gradient-text">{lang.pages.home.titleAccent}</span>
        </h2>
        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-lg">
          {lang.pages.home.subtitle}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          value={residentCount}
          label={lang.pages.home.residentsLabel}
          icon={<UsersIcon className="w-5 h-5" />}
          color="indigo"
        />
        <StatCard
          value={vacant}
          label={lang.pages.home.vacantLabel}
          icon={<DoorIcon className="w-5 h-5" />}
          color="purple"
        />
        <StatCard
          value={moveIns}
          label={lang.pages.home.moveInsLabel}
          icon={<ArrowDownIcon className="w-5 h-5" />}
          color="emerald"
        />
        <StatCard
          value={moveOuts}
          label={lang.pages.home.moveOutsLabel}
          icon={<ArrowUpIcon className="w-5 h-5" />}
          color="rose"
        />
      </div>
    </div>
  );
}

interface StatCardProps {
  value: number;
  label: string;
  icon: React.ReactNode;
  color: "indigo" | "purple" | "emerald" | "rose";
}

function StatCard({ value, label, icon, color }: StatCardProps) {
  const styles = {
    indigo: {
      bg: "bg-indigo-50 dark:bg-indigo-950/30",
      border: "border-indigo-100 dark:border-indigo-900/50",
      icon: "text-indigo-500 dark:text-indigo-400",
      value: "text-indigo-600 dark:text-indigo-400",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-950/30",
      border: "border-purple-100 dark:border-purple-900/50",
      icon: "text-purple-500 dark:text-purple-400",
      value: "text-purple-600 dark:text-purple-400",
    },
    emerald: {
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      border: "border-emerald-100 dark:border-emerald-900/50",
      icon: "text-emerald-500 dark:text-emerald-400",
      value: "text-emerald-600 dark:text-emerald-400",
    },
    rose: {
      bg: "bg-rose-50 dark:bg-rose-950/30",
      border: "border-rose-100 dark:border-rose-900/50",
      icon: "text-rose-500 dark:text-rose-400",
      value: "text-rose-600 dark:text-rose-400",
    },
  };

  const s = styles[color];

  return (
    <div className={`${s.bg} ${s.border} border rounded-2xl p-3 sm:p-4`}>
      <div className="flex items-center gap-2 mb-1.5">
        <span className={s.icon}>{icon}</span>
        <span className={`text-2xl sm:text-3xl font-bold ${s.value}`}>{value}</span>
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium truncate">
        {label}
      </p>
    </div>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function DoorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function ArrowDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  );
}

function ArrowUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
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
