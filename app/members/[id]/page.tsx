"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { format, differenceInCalendarDays } from "date-fns";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Home,
  Shield,
  Users,
  Sparkles,
  Lock,
} from "lucide-react";
import { PageContainer } from "@/src/shared/layouts";
import { Badge } from "@/src/shared/ui";
import { useResident } from "@/src/features/residents";
import { useLanguage } from "@/src/shared/lang/context";
import { getAvatarColor, getInitials } from "@/src/lib/utils/avatar";
import { cn } from "@/src/lib/utils";
import { designTokens } from "@/src/shared/ui/designTokens";

export default function MemberDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;
  const { resident, loading, error } = useResident(id);
  const { lang } = useLanguage();

  const now = useMemo(() => new Date(), []);
  const moveInDate = resident?.move_in_date ? new Date(resident.move_in_date) : null;
  const moveOutDate = resident?.move_out_date ? new Date(resident.move_out_date) : null;
  const stayDays = moveInDate ? differenceInCalendarDays(moveOutDate ?? now, moveInDate) : null;
  const isMovingOut = moveOutDate ? moveOutDate.getTime() > now.getTime() : false;
  const daysUntilMoveOut =
    moveOutDate && moveOutDate.getTime() > now.getTime()
      ? differenceInCalendarDays(moveOutDate, now)
      : null;
  const roleLabel = resident ? lang.pages.residentDetail.roleLabels[resident.role] ?? resident.role : "";

  return (
    <PageContainer>
      <div className="relative">
        <div
          className={cn(
            "absolute inset-0 -z-10",
            "gradient-brand-soft",
            "dark:from-teal-950/40 dark:via-slate-950/60 dark:to-transparent"
          )}
          aria-hidden="true"
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-14">
          <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8">
            <Link
              href="/members"
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5",
                "text-sm text-emerald-600 dark:text-emerald-300 hover:text-emerald-700 dark:hover:text-emerald-200",
                "hover:bg-emerald-50/70 dark:hover:bg-emerald-950/30 transition-colors"
              )}
            >
              <ArrowLeft className="w-4 h-4" />
              {lang.pages.residentDetail.backToList}
            </Link>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
                <Lock className="h-3 w-3" />
                認証済み
              </span>
              {resident && (
                <span
                  className={cn(
                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold",
                    isMovingOut
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"
                      : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                  )}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isMovingOut ? lang.pages.residentDetail.statusMovingOut : lang.pages.residentDetail.statusActive}
                </span>
              )}
            </div>
          </div>

          {loading && (
            <div className="animate-pulse space-y-6">
              <div className="aspect-square max-w-xs mx-auto rounded-3xl bg-slate-200 dark:bg-slate-700" />
              <div className="space-y-3">
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mx-auto" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mx-auto" />
              </div>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 dark:text-red-400">
                {lang.common.errorPrefix}: {error.message}
              </p>
            </div>
          )}

          {!loading && !error && !resident && (
            <div className="text-center py-12">
              <p className="text-subtle dark:text-subtle">
                {lang.common.notFound}
              </p>
            </div>
          )}

          {!loading && !error && resident && (
            <article className="space-y-6 sm:space-y-8">
              <HeroCard
                resident={resident}
                roleLabel={roleLabel}
                lang={lang}
                isMovingOut={isMovingOut}
                stayDays={stayDays}
                moveInDate={moveInDate}
                moveOutDate={moveOutDate}
                daysUntilMoveOut={daysUntilMoveOut}
              />

              <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.4fr,1fr]">
                <InfoGrid
                  resident={resident}
                  lang={lang}
                  moveInDate={moveInDate}
                  moveOutDate={moveOutDate}
                  stayDays={stayDays}
                />
                <TimelineCard
                  lang={lang}
                  moveInDate={moveInDate}
                  moveOutDate={moveOutDate}
                  isMovingOut={isMovingOut}
                />
              </div>

              <BioCard lang={lang} bio={resident.bio} />
            </article>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

function HeroCard({
  resident,
  roleLabel,
  lang,
  isMovingOut,
  stayDays,
  moveInDate,
  moveOutDate,
  daysUntilMoveOut,
}: {
  resident: NonNullable<ReturnType<typeof useResident>["resident"]>;
  roleLabel: string;
  lang: ReturnType<typeof useLanguage>["lang"];
  isMovingOut: boolean;
  stayDays: number | null;
  moveInDate: Date | null;
  moveOutDate: Date | null;
  daysUntilMoveOut: number | null;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl border border-slate-200/70 dark:border-slate-800/70",
        "bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl",
        "shadow-[0_25px_80px_-40px] shadow-emerald-500/25 p-6 sm:p-8"
      )}
    >
      <div className="absolute inset-0 opacity-70" aria-hidden="true">
        <div className="absolute -left-10 sm:-left-16 top-0 w-40 sm:w-56 h-40 sm:h-56 bg-linear-to-br from-emerald-500/18 via-teal-400/18 to-amber-300/14 blur-3xl" />
        <div className="absolute right-0 -bottom-16 w-48 sm:w-64 h-48 sm:h-64 bg-linear-to-tr from-amber-400/20 via-rose-300/15 to-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative grid gap-6 sm:gap-8 lg:grid-cols-[1.1fr,1.2fr] items-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              "relative w-40 h-40 sm:w-48 sm:h-48 rounded-[30px] overflow-hidden",
              "shadow-2xl shadow-emerald-500/20 border border-white/40 dark:border-slate-800/70",
              "bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900"
            )}
            aria-label={resident.nickname}
          >
            {resident.photo_url ? (
              <Image
                src={resident.photo_url}
                alt={resident.nickname}
                fill
                className="object-cover"
                sizes="200px"
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
                <span className="text-4xl sm:text-5xl font-bold text-white drop-shadow-sm">
                  {getInitials(resident.nickname)}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge size="md" className="bg-slate-900 text-white dark:bg-white dark:text-slate-900">
              {roleLabel}
            </Badge>
            <Badge size="md" variant="outline">
              {lang.pages.residentDetail.room}: {resident.room_number}
            </Badge>
            <Badge size="md" variant="outline">
              {lang.pages.residentDetail.floor}: {resident.floor}
            </Badge>
          </div>
        </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-600 via-teal-500 to-amber-400 text-white shadow-lg shadow-emerald-500/30">
              <Users className="h-6 w-6" strokeWidth={2.25} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">
                {lang.nav.residents}
              </p>
              <p className="text-sm text-muted dark:text-subtle">{lang.pages.residentDetail.heroSub}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-strong dark:text-white leading-tight">
              {resident.nickname}
            </h1>
            <div className="flex flex-wrap gap-2">
              <StatusPill
                icon={<Home className="h-4 w-4" />}
                label={resident.room_number}
                accent="from-emerald-600 via-teal-500 to-amber-400"
              />
              <StatusPill
                icon={<Shield className="h-4 w-4" />}
                label={roleLabel}
                accent="from-emerald-500 to-teal-500"
              />
              <StatusPill
                icon={<CalendarDays className="h-4 w-4" />}
                label={
                  moveInDate
                    ? `${lang.pages.residentDetail.moveIn}: ${format(moveInDate, "yyyy/MM/dd")}`
                    : lang.pages.residentDetail.notSet
                }
                accent="from-amber-500 to-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            <StatCard
              icon={<Clock3 className="h-4 w-4" />}
              label={lang.pages.residentDetail.stayLength}
              value={stayDays !== null ? `${stayDays}d` : lang.pages.residentDetail.notSet}
              accent="from-emerald-600 via-teal-500 to-amber-400"
            />
            <StatCard
              icon={<CalendarDays className="h-4 w-4" />}
              label={lang.pages.residentDetail.moveOut}
              value={
                moveOutDate
                  ? format(moveOutDate, "yyyy/MM/dd")
                  : lang.pages.residentDetail.notSet
              }
              accent={isMovingOut ? "from-amber-500 to-orange-500" : "from-emerald-500 to-teal-500"}
            />
            <StatCard
              icon={<CalendarDays className="h-4 w-4" />}
              label={lang.pages.residentDetail.daysUntilMoveOut}
              value={
                daysUntilMoveOut !== null ? `${daysUntilMoveOut}d` : lang.pages.residentDetail.notSet
              }
              accent="from-amber-500 to-orange-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatusPill({ icon, label, accent }: { icon: React.ReactNode; label: string; accent: string }) {
  const gradient = accent || designTokens.gradient("primary");
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-white",
        "bg-linear-to-r shadow-md shadow-emerald-500/15",
        gradient
      )}
    >
      {icon}
      {label}
    </span>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  const gradient = accent || designTokens.gradient("primary");
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 dark:border-slate-800/70",
        "bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm",
        "shadow-md shadow-emerald-500/12 p-4"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn("h-9 w-9 rounded-xl text-white flex items-center justify-center bg-linear-to-br", gradient)}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-subtle dark:text-subtle font-semibold">
            {label}
          </p>
          <p className="text-base sm:text-lg font-semibold text-strong dark:text-white leading-tight break-words">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoGrid({
  resident,
  lang,
  moveInDate,
  moveOutDate,
  stayDays,
}: {
  resident: NonNullable<ReturnType<typeof useResident>["resident"]>;
  lang: ReturnType<typeof useLanguage>["lang"];
  moveInDate: Date | null;
  moveOutDate: Date | null;
  stayDays: number | null;
}) {
  const items = [
    {
      label: lang.pages.residentDetail.room,
      value: resident.room_number,
    },
    {
      label: lang.pages.residentDetail.floor,
      value: resident.floor,
    },
    {
      label: lang.pages.residentDetail.nickname,
      value: resident.nickname,
    },
    {
      label: lang.pages.residentDetail.fullName,
      value: resident.full_name || lang.pages.residentDetail.notSet,
    },
    {
      label: lang.pages.residentDetail.moveIn,
      value: moveInDate ? format(moveInDate, "yyyy/MM/dd") : lang.pages.residentDetail.notSet,
    },
    {
      label: lang.pages.residentDetail.moveOut,
      value: moveOutDate ? format(moveOutDate, "yyyy/MM/dd") : lang.pages.residentDetail.notSet,
    },
    {
      label: lang.pages.residentDetail.stayLength,
      value: stayDays !== null ? `${stayDays}d` : lang.pages.residentDetail.notSet,
    },
    {
      label: "ID",
      value: resident.id,
    },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm shadow-lg shadow-emerald-500/5 p-5 sm:p-6">
      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
        {items.map((item, index) => (
          <div
            key={`${item.label}-${index}`}
            className="rounded-xl border border-slate-100 dark:border-slate-800/60 bg-slate-50/70 dark:bg-slate-800/50 px-3.5 py-3 flex flex-col gap-1"
          >
            <span className="text-xs uppercase tracking-wide text-subtle dark:text-subtle font-semibold">
              {item.label}
            </span>
            <span className="text-sm sm:text-base font-semibold text-strong dark:text-white break-words">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function TimelineCard({
  lang,
  moveInDate,
  moveOutDate,
  isMovingOut,
}: {
  lang: ReturnType<typeof useLanguage>["lang"];
  moveInDate: Date | null;
  moveOutDate: Date | null;
  isMovingOut: boolean;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm shadow-lg shadow-emerald-500/5 p-5 sm:p-6 space-y-4">
      <div className="flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-emerald-600" />
        <h2 className="text-lg font-semibold text-strong dark:text-white">
          {lang.pages.residentDetail.moveIn} / {lang.pages.residentDetail.moveOut}
        </h2>
      </div>

      <div className="space-y-3">
        <TimelineRow
          label={lang.pages.residentDetail.moveIn}
          value={moveInDate ? format(moveInDate, "yyyy/MM/dd") : lang.pages.residentDetail.notSet}
          accent="from-emerald-500 to-teal-500"
        />
        <TimelineRow
          label={lang.pages.residentDetail.moveOut}
          value={moveOutDate ? format(moveOutDate, "yyyy/MM/dd") : lang.pages.residentDetail.notSet}
          accent={isMovingOut ? "from-amber-500 to-orange-500" : "from-slate-500 to-slate-700"}
        />
      </div>
    </section>
  );
}

function TimelineRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800/60 bg-slate-50/70 dark:bg-slate-800/50 px-3.5 py-3">
      <div className={cn("h-9 w-9 rounded-xl text-white flex items-center justify-center bg-linear-to-br", accent)}>
        <CalendarDays className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-subtle dark:text-subtle font-semibold">{label}</p>
        <p className="text-sm sm:text-base font-semibold text-strong dark:text-white leading-tight">{value}</p>
      </div>
    </div>
  );
}

function BioCard({
  lang,
  bio,
}: {
  lang: ReturnType<typeof useLanguage>["lang"];
  bio?: string | null;
}) {
  const content = bio?.trim() || null;
  return (
    <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm shadow-lg shadow-emerald-500/10 p-5 sm:p-6 space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-emerald-600" />
        <h2 className="text-lg font-semibold text-strong dark:text-white">
          {lang.pages.residentDetail.bioTitle}
        </h2>
      </div>
      {content ? (
        <p className="text-sm sm:text-base leading-relaxed text-muted dark:text-muted whitespace-pre-line">
          {content}
        </p>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 px-4 py-3 text-sm text-subtle dark:text-subtle">
          {lang.pages.residentDetail.bioEmpty}
        </div>
      )}
    </section>
  );
}
