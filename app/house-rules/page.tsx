"use client";

import { useMemo, useState, useCallback } from "react";
import { ShieldCheck, Sparkles, Clock3, Waves, LayoutGrid, ArrowRight } from "lucide-react";
import { PageContainer } from "@/src/shared/layouts";
import { HouseRulesList, HouseRuleDetailSheet, useHouseRules } from "@/src/features/house-rules";
import { useLanguage } from "@/src/shared/lang/context";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/src/lib/utils";
import { designTokens } from "@/src/shared/ui/designTokens";
import { NoticeBoard, noticeSections } from "@/src/features/notices";

export default function HouseRulesPage() {
  const { lang } = useLanguage();
  const { rules, loading, error } = useHouseRules();
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);

  const categoryCount = useMemo(() => new Set(rules.map((r) => r.category)).size, [rules]);

  const handleSelect = useCallback((id: string) => {
    setSelectedRuleId(id);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedRuleId(null);
  }, []);

  return (
    <PageContainer>
      <div className="relative">
        <div
          className={cn(
            "absolute inset-0 -z-10",
            "bg-linear-to-b from-emerald-50/70 via-amber-50/40 to-transparent",
            "dark:from-teal-950/40 dark:via-slate-950/70 dark:to-transparent"
          )}
          aria-hidden="true"
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-14 space-y-8 sm:space-y-10">
          <HeroSection lang={lang} totalRules={rules.length} categoryCount={categoryCount} />

          {loading && (
            <div className="text-sm text-subtle dark:text-subtle">
              {lang.pages.houseRules.loading}
            </div>
          )}

          {error && (
            <div
              className="text-sm rounded-xl border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-red-600 dark:text-red-400"
            >
              {lang.common.errorPrefix} rules: {error.message}
            </div>
          )}

          {!loading && !error && (
            <div className="grid gap-8 lg:gap-10 lg:grid-cols-[1.65fr,1fr] items-start">
              <div className="space-y-6">
                <section className="rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-white/85 dark:bg-slate-900/70 backdrop-blur-xl shadow-[0_25px_80px_-40px] shadow-emerald-500/20 p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div>
                      <p className="text-xs font-semibold tracking-[0.14em] uppercase text-emerald-600 dark:text-emerald-300">
                        {lang.pages.houseRules.eyebrow}
                      </p>
                      <h2 className="text-lg sm:text-xl font-semibold text-strong dark:text-white">
                        {lang.pages.houseRules.title}
                      </h2>
                    </div>
                    <Badge variant="inverted">
                      {lang.pages.houseRules.reviewValue}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    <HighlightCard title={lang.pages.houseRules.stats.rules} value={rules.length} tone="primary" />
                    <HighlightCard title={lang.pages.houseRules.stats.categories} value={categoryCount} tone="accent" />
                    <HighlightCard title={lang.pages.houseRules.stats.quietHours} value={lang.pages.houseRules.quietHoursValue} tone="warm" />
                  </div>
                  <HouseRulesList rules={rules} onSelect={handleSelect} />
                </section>

                <section
                  id="notices"
                  className="rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-white/85 dark:bg-slate-900/70 backdrop-blur-xl shadow-[0_25px_80px_-40px] shadow-emerald-500/20 p-5 sm:p-6 space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-linear-to-br from-emerald-600 via-teal-500 to-amber-400 text-white flex items-center justify-center shadow-md shadow-emerald-500/25">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                        {lang.pages.notices.title}
                      </p>
                      <p className="text-sm text-muted">
                        荒天・Wi-Fi・設備などの運用メモ
                      </p>
                    </div>
                  </div>
                  <NoticeBoard sections={noticeSections} />
                </section>
              </div>

              <AsidePanel lang={lang} />
            </div>
          )}
        </div>
      </div>

      <HouseRuleDetailSheet id={selectedRuleId} onClose={handleClose} />
    </PageContainer>
  );
}

interface HeroSectionProps {
  lang: ReturnType<typeof useLanguage>["lang"];
  totalRules: number;
  categoryCount: number;
}

function HeroSection({ lang, totalRules, categoryCount }: HeroSectionProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl border border-slate-200/70 dark:border-slate-800/70",
        "bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl",
        "shadow-[0_25px_80px_-40px] shadow-emerald-500/25"
      )}
    >
      <div className="absolute inset-0 opacity-70" aria-hidden="true">
        <div className="absolute -left-10 sm:-left-16 top-0 w-40 sm:w-56 h-40 sm:h-56 bg-linear-to-br from-emerald-500/18 via-teal-400/18 to-amber-300/14 blur-3xl" />
        <div className="absolute right-0 -bottom-16 w-48 sm:w-64 h-48 sm:h-64 bg-linear-to-tr from-amber-400/20 via-rose-300/15 to-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative grid gap-8 lg:gap-10 lg:grid-cols-[1.4fr,1fr] p-6 sm:p-8 lg:p-10">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-600 via-teal-500 to-amber-400 text-white shadow-lg shadow-emerald-500/30">
              <ShieldCheck className="h-6 w-6" strokeWidth={2.25} />
            </div>
            <Badge variant="inverted" className="shadow-lg shadow-emerald-500/20">
              {lang.pages.houseRules.eyebrow}
            </Badge>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-strong dark:text-white">
              {lang.pages.houseRules.title}
            </h1>
            <p className="text-base sm:text-lg text-muted dark:text-subtle leading-relaxed max-w-2xl">
              {lang.pages.houseRules.description}
            </p>
            <p className="text-base sm:text-lg text-muted dark:text-muted leading-relaxed max-w-2xl">
              {lang.pages.houseRules.heroSub}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            {lang.pages.houseRules.focusItems.map((item) => (
              <Badge
                key={item}
                variant="outline"
                className="border-slate-200/80 bg-white/70 text-muted dark:border-slate-700 dark:bg-slate-800/80 dark:text-strong"
              >
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                {item}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <StatCard
              icon={<LayoutGrid className="h-4 w-4" />}
              label={lang.pages.houseRules.stats.rules}
              value={totalRules}
              accent="from-emerald-600 to-teal-500"
            />
            <StatCard
              icon={<ShieldCheck className="h-4 w-4" />}
              label={lang.pages.houseRules.stats.categories}
              value={categoryCount}
              accent="from-emerald-500 to-teal-500"
            />
            <StatCard
              icon={<Waves className="h-4 w-4" />}
              label={lang.pages.houseRules.stats.quietHours}
              value={lang.pages.houseRules.quietHoursValue}
              accent="from-amber-500 to-orange-400"
              compact
            />
            <StatCard
              icon={<Clock3 className="h-4 w-4" />}
              label={lang.pages.houseRules.stats.review}
              value={lang.pages.houseRules.reviewValue}
              accent="from-slate-900 to-slate-700"
              compact
            />
          </div>

          <Card className="border-0 bg-linear-to-r from-slate-900 via-emerald-900 to-amber-800 text-white shadow-xl shadow-emerald-500/25">
            <div className="flex items-start gap-3 p-4 sm:p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                <ArrowRight className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-wide uppercase text-white/70">
                  {lang.pages.houseRules.focusTitle}
                </p>
                <p className="mt-1 text-base sm:text-lg font-medium leading-relaxed">
                  {lang.pages.houseRules.heroNote}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  accent: string;
  compact?: boolean;
}

function StatCard({ icon, label, value, accent, compact }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 dark:border-slate-800/70",
        "bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm",
        "shadow-md shadow-emerald-500/15",
        "p-3 sm:p-4",
        compact ? "col-span-2 sm:col-span-1" : ""
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn("h-9 w-9 rounded-xl text-white flex items-center justify-center bg-linear-to-br", accent)}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-subtle dark:text-subtle font-semibold">
            {label}
          </p>
          <p className="text-lg sm:text-xl font-semibold text-strong dark:text-white leading-tight break-words">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function HighlightCard({
  title,
  value,
  tone,
}: {
  title: string;
  value: number | string;
  tone: Parameters<typeof designTokens.gradient>[0];
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/70 dark:border-slate-800/70",
        "bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm",
        "shadow-md shadow-emerald-500/15 p-4 flex flex-col gap-2"
      )}
    >
      <p className="text-xs uppercase tracking-wide text-subtle dark:text-subtle font-semibold">
        {title}
      </p>
      <p className="text-2xl font-bold text-strong">{value}</p>
      <div className={cn("h-1 w-16 rounded-full", designTokens.gradient(tone))} />
    </div>
  );
}

interface AsidePanelProps {
  lang: ReturnType<typeof useLanguage>["lang"];
}

function AsidePanel({ lang }: AsidePanelProps) {
  return (
    <aside className="space-y-4 sticky top-24">
      <Card className="overflow-hidden border-slate-200/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/70">
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-linear-to-br from-emerald-600 to-amber-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300 font-semibold">
                {lang.pages.houseRules.sidebarTitle}
              </p>
              <p className="text-sm text-subtle dark:text-subtle">
                {lang.pages.houseRules.sidebarDescription}
              </p>
            </div>
          </div>

          <div className="grid gap-2">
            {lang.pages.houseRules.sidebarChecks.map((check) => (
              <div
                key={check}
                className="flex items-start gap-3 rounded-xl border border-slate-200/80 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-800/60 px-3.5 py-3"
              >
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px] shadow-emerald-500/20" />
                <p className="text-sm text-muted dark:text-muted leading-relaxed">{check}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-linear-to-r from-emerald-600 via-teal-600 to-slate-900 text-white px-4 py-3 shadow-md shadow-emerald-500/20">
            <p className="text-sm font-semibold">{lang.pages.houseRules.sidebarContact}</p>
            <p className="text-xs text-white/80 mt-1">{lang.pages.houseRules.sidebarContactNote}</p>
          </div>
        </div>
      </Card>
    </aside>
  );
}
