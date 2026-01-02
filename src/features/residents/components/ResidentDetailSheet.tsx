"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { format } from "date-fns";
import { cn } from "@/src/lib/utils";
import { useResident } from "../hooks";
import { useLanguage } from "@/src/shared/lang/context";
import { Badge, Spinner } from "@/src/shared/ui";
import { designTokens } from "@/src/shared/ui/designTokens";
import { Home, Shield, CalendarDays, X, Sparkles } from "lucide-react";
import { getAvatarColor, getInitials } from "@/src/lib/utils/avatar";

interface ResidentDetailSheetProps {
  id: string | null;
  onClose: () => void;
}

export function ResidentDetailSheet({ id, onClose }: ResidentDetailSheetProps) {
  const { resident, loading, error } = useResident(id ?? undefined);
  const { lang } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    if (id) document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [id, onClose]);

  if (!id) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={ref}
        className={cn(
          "relative w-full sm:w-[440px] md:w-[480px] max-h-[90vh] overflow-auto",
          "bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl"
        )}
      >
        <div className="flex items-center justify-between px-4 sm:px-5 pt-4 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl text-white flex items-center justify-center shadow-md shadow-emerald-500/20 bg-linear-to-br from-emerald-600 via-teal-500 to-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-sm font-semibold text-strong">{lang.nav.residents}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-muted hover:text-strong hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label={lang.common.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 sm:px-5 py-4 space-y-4">
          {loading && (
            <div className="flex items-center gap-2 text-muted">
              <Spinner size="sm" />
              {lang.pages.residentDetail.loading || lang.pages.meetings.loading}
            </div>
          )}
          {error && (
            <p className="text-sm text-red-500 dark:text-red-400">
              {lang.common.errorPrefix}: {error.message}
            </p>
          )}
          {!loading && !error && resident && (
            <>
              <div className="flex flex-col items-center gap-3">
                <div
                  className={cn(
                    "relative w-32 h-32 rounded-3xl overflow-hidden",
                    "bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900",
                    "shadow-lg shadow-emerald-500/20 border border-white/50 dark:border-slate-800/70"
                  )}
                >
                  {resident.photo_url ? (
                    <Image src={resident.photo_url} alt={resident.nickname} fill className="object-cover" sizes="200px" />
                  ) : (
                    <div
                      className={cn(
                        "absolute inset-0 flex items-center justify-center text-white text-3xl font-bold",
                        "bg-linear-to-br",
                        getAvatarColor(resident.nickname)
                      )}
                    >
                      {getInitials(resident.nickname)}
                    </div>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-strong">{resident.nickname}</h2>
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge size="md" className="bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                    {lang.pages.residentDetail.room}: {resident.room_number}
                  </Badge>
                  <Badge size="md" variant="outline">
                    {lang.pages.residentDetail.floor}: {resident.floor}
                  </Badge>
                  <Badge size="md" variant="outline">
                    {resident.role}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <DetailStat
                  icon={<Home className="w-4 h-4" />}
                  label={lang.pages.residentDetail.room}
                  value={resident.room_number}
                  tone="primary"
                />
                <DetailStat
                  icon={<Shield className="w-4 h-4" />}
                  label={lang.pages.residentDetail.role}
                  value={resident.role}
                  tone="accent"
                />
                <DetailStat
                  icon={<CalendarDays className="w-4 h-4" />}
                  label={lang.pages.residentDetail.moveIn}
                  value={resident.move_in_date ? format(new Date(resident.move_in_date), "yyyy/MM/dd") : lang.pages.residentDetail.notSet}
                  tone="warm"
                />
                <DetailStat
                  icon={<CalendarDays className="w-4 h-4" />}
                  label={lang.pages.residentDetail.moveOut}
                  value={
                    resident.move_out_date
                      ? format(new Date(resident.move_out_date), "yyyy/MM/dd")
                      : lang.pages.residentDetail.notSet
                  }
                  tone="neutral"
                />
              </div>

              {resident.bio && (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-3">
                  <p className="text-sm text-muted leading-relaxed whitespace-pre-line">
                    {resident.bio}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailStat({
  icon,
  label,
  value,
  tone = "primary",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: Parameters<typeof designTokens.gradient>[0];
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl border border-slate-200/80 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm",
        "p-3 shadow-sm",
        designTokens.shadow(tone)
      )}
    >
      <div className={cn("h-9 w-9 rounded-lg text-white flex items-center justify-center", designTokens.gradient(tone))}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-muted font-semibold">{label}</p>
        <p className="text-sm font-semibold text-strong truncate">{value}</p>
      </div>
    </div>
  );
}
