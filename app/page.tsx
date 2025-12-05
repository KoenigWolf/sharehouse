"use client";

/**
 * Home Page
 * Displays the resident directory with filtering and search
 */

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/src/lib/utils";
import { PageContainer } from "@/src/shared/layouts";
import { ResidentGrid, useResidents } from "@/src/features/residents";
import { TOTAL_ROOMS } from "@/src/shared/constants";
import { useLanguage } from "@/src/shared/lang/context";

const FloorPlanModal = dynamic(
  () => import("@/src/features/rooms").then((mod) => ({ default: mod.FloorPlanModal })),
  { ssr: false }
);

export default function HomePage() {
  const { residents, loading, error } = useResidents();
  const { lang } = useLanguage();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const occupancy = useMemo(() => calculateOccupancy(residents), [residents]);

  return (
    <PageContainer>
      <div className="relative">
        <div
          className="absolute inset-0 -z-10 bg-linear-to-b from-emerald-50/80 via-white to-transparent dark:from-teal-950/40 dark:via-slate-950/70 dark:to-transparent"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-14 space-y-8 sm:space-y-10">
          <PageHeader
            lang={lang}
            residentCount={residents.length}
            vacant={occupancy.vacant}
            moveIns={occupancy.moveIns}
            moveOuts={occupancy.moveOuts}
          />

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
      </div>

      {/* Floor Plan Modal - lazy loaded */}
      {selectedRoom && (
        <FloorPlanModal
          roomNumber={selectedRoom}
          onClose={() => setSelectedRoom(null)}
        />
      )}
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
    <section
      className="relative overflow-hidden rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-white/85 dark:bg-slate-900/70 backdrop-blur-xl shadow-[0_25px_80px_-40px] shadow-emerald-500/25 p-6 sm:p-8 lg:p-10"
    >
      <div className="absolute inset-0 opacity-70 pointer-events-none" aria-hidden="true">
        <div className="absolute -left-12 top-0 h-32 w-32 sm:h-44 sm:w-44 rounded-full bg-emerald-400/18 blur-3xl" />
        <div className="absolute right-0 top-10 h-32 w-40 sm:h-48 sm:w-52 rounded-full bg-amber-200/20 blur-3xl" />
      </div>

      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 sm:gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-600 via-teal-500 to-amber-400 text-white shadow-lg shadow-emerald-500/30">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M3 9l9-6 9 6v9a3 3 0 0 1-3 3h-3" />
                <path d="M9 22V12h6v10" />
              </svg>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-[0.18em] bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md shadow-emerald-500/20">
              {lang.pages.home.eyebrow || "Residents"}
            </span>
          </div>
          <div className="space-y-2">
            <h2 className="type-display text-strong">
              {lang.pages.home.title.replace(lang.pages.home.titleAccent, "")}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-400 bg-clip-text text-transparent">
                {lang.pages.home.titleAccent}
              </span>
            </h2>
            <p className="type-body text-muted max-w-2xl">{lang.pages.home.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <HeroPill label={lang.pages.home.residentsLabel} value={residentCount} accent="from-emerald-600 to-teal-500" />
            <HeroPill label={lang.pages.home.vacantLabel} value={vacant} accent="from-amber-500 to-orange-400" />
            <HeroPill label={lang.pages.home.moveInsLabel} value={moveIns} accent="from-teal-500 to-cyan-400" />
            <HeroPill label={lang.pages.home.moveOutsLabel} value={moveOuts} accent="from-rose-500 to-amber-400" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full lg:max-w-md">
          <HeroStat label={lang.pages.home.residentsLabel} value={residentCount} accent="from-emerald-600 to-teal-500" />
          <HeroStat label={lang.pages.home.vacantLabel} value={vacant} accent="from-amber-500 to-orange-400" />
          <HeroStat label={lang.pages.home.moveInsLabel} value={moveIns} accent="from-teal-500 to-cyan-400" />
          <HeroStat label={lang.pages.home.moveOutsLabel} value={moveOuts} accent="from-rose-500 to-amber-400" />
        </div>
      </div>
    </section>
  );
}

function HeroPill({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-white",
        "bg-linear-to-r shadow-md shadow-emerald-500/20",
        accent
      )}
    >
      <span className="text-base font-bold tabular-nums">{value}</span>
      <span className="hidden sm:inline">{label}</span>
    </span>
  );
}

function HeroStat({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/30 dark:border-slate-800/70",
        "bg-white/15 dark:bg-white/5 backdrop-blur-lg",
        "shadow-md shadow-black/10",
        "p-3 sm:p-4 text-white"
      )}
    >
      <div className="flex items-center gap-2">
        <div className={cn("h-9 w-9 rounded-xl bg-linear-to-br text-white flex items-center justify-center shadow", accent)}>
          <span className="text-sm font-bold">＋</span>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-white/80 font-semibold">{label}</p>
          <p className="text-lg sm:text-xl font-semibold tabular-nums">{value}</p>
        </div>
      </div>
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
