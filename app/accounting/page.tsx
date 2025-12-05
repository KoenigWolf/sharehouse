"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { PageContainer } from "@/src/shared/layouts";
import { AccountingSummary, TransactionList, TrendLineChart, useAccounting } from "@/src/features/accounting";
import { usePermission } from "@/src/features/residents";
import { useLanguage } from "@/src/shared/lang/context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { MonthlyStatement } from "@/src/features/accounting";
import {
  Settings,
  LayoutDashboard,
  Clock,
  Wallet,
  AlertCircle,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  ChevronRight,
  Calendar,
  BarChart3,
  PiggyBank,
  Receipt,
} from "lucide-react";

type ViewMode = "dashboard" | "history";

export default function AccountingPage() {
  const { statements, loading, error } = useAccounting();
  const { isAccountingAdmin } = usePermission();
  const { lang } = useLanguage();
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("dashboard");
  const [isMobileLite, setIsMobileLite] = useState(false);

  const selectedStatement = statements[selectedMonthIndex] ?? null;
  const previousStatement = statements[selectedMonthIndex + 1] ?? null;

  // Avoid heavy rendering on very small devices (e.g., iPhone SE)
  useEffect(() => {
    const handleResize = () => setIsMobileLite(window.innerWidth <= 400);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const allTimeSummary = useMemo(() => {
    return statements.reduce(
      (acc, s) => ({
        income: acc.income + s.totalIncome,
        expense: acc.expense + s.totalExpense,
        balance: acc.balance + s.balance,
      }),
      { income: 0, expense: 0, balance: 0 }
    );
  }, [statements]);

  return (
    <PageContainer>
      {/* Hero Section */}
      <HeroSection
        lang={lang}
        isAccountingAdmin={isAccountingAdmin}
        allTimeSummary={allTimeSummary}
        statementsCount={statements.length}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-8">
        {/* ビュー切替タブ */}
        <div className="flex items-center justify-center">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
            <TabsList className="bg-white/85 dark:bg-slate-800/85 backdrop-blur-sm shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-1">
              <TabsTrigger
                value="dashboard"
                className="gap-2 data-[state=active]:bg-linear-to-r data-[state=active]:from-emerald-600 data-[state=active]:via-teal-500 data-[state=active]:to-amber-400 data-[state=active]:text-white"
              >
                <LayoutDashboard className="w-4 h-4" strokeWidth={2} />
                <span>{lang.pages.accounting.dashboard}</span>
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="gap-2 data-[state=active]:bg-linear-to-r data-[state=active]:from-emerald-600 data-[state=active]:via-teal-500 data-[state=active]:to-amber-400 data-[state=active]:text-white"
              >
                <Clock className="w-4 h-4" strokeWidth={2} />
                <span>{lang.pages.accounting.history}</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* ローディング・エラー状態 */}
        {loading && <LoadingState />}
        {error && <ErrorState error={error} lang={lang} />}

        {!loading && !error && statements.length > 0 && (
          <>
            {viewMode === "dashboard" ? (
              <DashboardView
                statements={statements}
                selectedStatement={selectedStatement}
                previousStatement={previousStatement}
                selectedMonthIndex={selectedMonthIndex}
                setSelectedMonthIndex={setSelectedMonthIndex}
                allTimeSummary={allTimeSummary}
                lang={lang}
                isMobileLite={isMobileLite}
              />
            ) : (
              <HistoryView statements={statements} lang={lang} isMobileLite={isMobileLite} />
            )}
          </>
        )}

        {!loading && !error && statements.length === 0 && (
          <EmptyState lang={lang} />
        )}
      </div>
    </PageContainer>
  );
}

interface HeroSectionProps {
  lang: ReturnType<typeof useLanguage>["lang"];
  isAccountingAdmin: boolean;
  allTimeSummary: { income: number; expense: number; balance: number };
  statementsCount: number;
}

function HeroSection({ lang, isAccountingAdmin, allTimeSummary, statementsCount }: HeroSectionProps) {
  const positive = allTimeSummary.balance >= 0;

  return (
    <section
      className="relative overflow-hidden border-b border-white/25 dark:border-slate-800/80 bg-gradient-to-br from-emerald-700 via-teal-600 to-amber-500 text-white shadow-strong"
      role="presentation"
    >
      <div className="absolute inset-0 opacity-40" aria-hidden="true">
        <div className="absolute -left-20 top-[-40px] h-64 w-64 rounded-full bg-white/25 blur-3xl" />
        <div className="absolute right-[-30px] bottom-[-60px] h-72 w-72 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-white/40" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm shadow-md shadow-black/20">
                <Wallet className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                <Sparkles className="w-3 h-3 mr-1" />
                {statementsCount}
                {lang.pages.accounting.monthsOfData}
              </Badge>
            </div>
            <h1 className="type-display text-white">{lang.pages.accounting.title}</h1>
            <p className="type-body text-white/80">{lang.pages.accounting.description}</p>

            {isAccountingAdmin && (
              <Button asChild size="lg" className="bg-white text-emerald-700 hover:bg-white/90 shadow-xl shadow-black/15">
                <Link href="/accounting/manage">
                  <Settings className="w-5 h-5 mr-2" strokeWidth={2} />
                  {lang.nav.accountingAdmin}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 lg:w-auto">
            <HeroStatCard
              icon={ArrowUpRight}
              label={lang.pages.accounting.totalIncome}
              value={allTimeSummary.income}
              colorClass="emerald"
            />
            <HeroStatCard
              icon={ArrowDownRight}
              label={lang.pages.accounting.totalExpense}
              value={allTimeSummary.expense}
              colorClass="rose"
            />
            <HeroStatCard
              icon={PiggyBank}
              label={lang.pages.accounting.totalBalance}
              value={allTimeSummary.balance}
              colorClass={positive ? "emerald" : "red"}
              highlight
              className="col-span-2 sm:col-span-1"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

interface HeroStatCardProps {
  icon: typeof Wallet;
  label: string;
  value: number;
  colorClass: "emerald" | "rose" | "indigo" | "red";
  highlight?: boolean;
  className?: string;
}

function HeroStatCard({ icon: Icon, label, value, colorClass, highlight, className }: HeroStatCardProps) {
  const colors = {
    emerald: "from-emerald-500 via-teal-500 to-amber-400",
    rose: "from-rose-500 to-pink-500",
    red: "from-red-500 to-orange-500",
    indigo: "from-emerald-500 via-teal-500 to-amber-400",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-4 sm:p-5",
        "bg-white/10 backdrop-blur-md border border-white/20",
        "transition-all duration-300 hover:scale-105 hover:bg-white/20",
        highlight && "ring-2 ring-white/40",
        className
      )}
    >
      {highlight && (
        <div className="absolute top-2 right-2">
          <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
        </div>
      )}
      <div className={cn(
        "inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3",
        "bg-linear-to-br shadow-lg",
        colors[colorClass]
      )}>
        <Icon className="w-5 h-5 text-white" strokeWidth={2} />
      </div>
      <p className="text-sm text-white/70 mb-1">{label}</p>
      <p className="text-xl sm:text-2xl font-bold text-white">
        ¥{value.toLocaleString()}
      </p>
    </div>
  );
}

interface DashboardViewProps {
  statements: MonthlyStatement[];
  selectedStatement: MonthlyStatement | null;
  previousStatement: MonthlyStatement | null;
  selectedMonthIndex: number;
  setSelectedMonthIndex: (index: number) => void;
  allTimeSummary: { income: number; expense: number; balance: number };
  lang: ReturnType<typeof useLanguage>["lang"];
  isMobileLite: boolean;
}

function DashboardView({
  statements,
  selectedStatement,
  previousStatement,
  selectedMonthIndex,
  setSelectedMonthIndex,
  allTimeSummary,
  lang,
  isMobileLite,
}: DashboardViewProps) {
  const mobileList = useMemo(() => statements.slice(0, 3), [statements]);

  return (
    <div className="space-y-8">
      {/* 月選択カルーセル */}
      <MonthSelector
        statements={statements}
        selectedIndex={selectedMonthIndex}
        onSelect={setSelectedMonthIndex}
        lang={lang}
      />

      {/* 収支推移グラフ */}
      {!isMobileLite ? (
        <TrendLineChart statements={statements} months={6} />
      ) : (
        <MobileTrendSummary statements={mobileList} lang={lang} />
      )}

      {/* メインダッシュボード */}
      {selectedStatement && (
        <>
          <AccountingSummary
            statement={selectedStatement}
            previousStatement={previousStatement}
          />
          <TransactionList entries={selectedStatement.entries} />
        </>
      )}
    </div>
  );
}

interface MonthSelectorProps {
  statements: MonthlyStatement[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  lang: ReturnType<typeof useLanguage>["lang"];
}

function MonthSelector({ statements, selectedIndex, onSelect, lang }: MonthSelectorProps) {
  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-emerald-600" strokeWidth={2} />
        <h2 className="text-lg font-bold text-strong">{lang.pages.accounting.selectMonth}</h2>
      </div>

      <div className="relative">
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {statements.map((s, i) => {
            const [year, month] = s.month.split("-");
            const isSelected = i === selectedIndex;
            const positive = s.balance >= 0;
            const isLatest = i === 0;

            return (
              <button
                key={s.month}
                onClick={() => onSelect(i)}
                className={cn(
                  "relative shrink-0 min-w-[140px] sm:min-w-[160px] snap-start",
                  "rounded-2xl p-4 sm:p-5 transition-all duration-300",
                  "border-2 group",
                  isSelected
                    ? "bg-linear-to-br from-emerald-600 via-teal-500 to-amber-400 border-emerald-500 text-white shadow-xl shadow-emerald-500/25 scale-105"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-lg"
                )}
              >
                {isLatest && !isSelected && (
                  <Badge className="absolute -top-2 -right-2 bg-linear-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg text-xs">
                    {lang.pages.accounting.latest}
                  </Badge>
                )}

                <div className="flex items-center justify-between mb-3">
                  <span className={cn(
                    "text-xs font-medium",
                    isSelected ? "text-white/80" : "text-muted-foreground"
                  )}>
                    {year}{lang.pages.accounting.year}
                  </span>
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110",
                    isSelected
                      ? "bg-white/20"
                      : positive
                        ? "bg-emerald-100 dark:bg-emerald-900/30"
                        : "bg-rose-100 dark:bg-rose-900/30"
                  )}>
                    {positive ? (
                      <TrendingUp className={cn(
                        "w-4 h-4",
                        isSelected ? "text-white" : "text-emerald-600 dark:text-emerald-400"
                      )} strokeWidth={2.5} />
                    ) : (
                      <TrendingDown className={cn(
                        "w-4 h-4",
                        isSelected ? "text-white" : "text-rose-600 dark:text-rose-400"
                      )} strokeWidth={2.5} />
                    )}
                  </div>
                </div>

                <p className={cn(
                  "text-3xl font-bold mb-2",
                  isSelected ? "text-white" : "text-strong"
                )}>
                  {parseInt(month)}<span className="text-lg font-medium ml-0.5">{lang.pages.accounting.month}</span>
                </p>

                <div className={cn(
                  "flex items-center gap-1.5 text-sm font-semibold",
                  isSelected
                    ? "text-white"
                    : positive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                )}>
                  <span className={cn(
                    "w-2 h-2 rounded-full",
                    isSelected
                      ? "bg-white"
                      : positive
                        ? "bg-emerald-500"
                        : "bg-rose-500"
                  )} />
                  {positive ? "+" : ""}¥{s.balance.toLocaleString()}
                </div>
              </button>
            );
          })}
        </div>

        {/* フェードグラデーション */}
        <div className="absolute right-0 top-0 bottom-4 w-16 bg-linear-to-l from-slate-50 dark:from-slate-900 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

interface HistoryViewProps {
  statements: MonthlyStatement[];
  lang: ReturnType<typeof useLanguage>["lang"];
  isMobileLite: boolean;
}

function HistoryView({ statements, lang, isMobileLite }: HistoryViewProps) {
  const visibleStatements = isMobileLite ? statements.slice(0, 3) : statements;

  return (
    <div className="space-y-8">
      {/* タイムライン */}
      <div className="relative">
        {/* 縦線 */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-teal-500 to-amber-400 hidden sm:block" />

        {visibleStatements.map((statement, index) => {
          const [year, month] = statement.month.split("-");
          const positive = statement.balance >= 0;

          return (
            <div
              key={statement.month}
              className="relative pl-0 sm:pl-16 pb-8 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* タイムラインドット */}
              <div className={cn(
                "absolute left-4 top-0 w-5 h-5 rounded-full border-4 border-white dark:border-slate-900 shadow-lg hidden sm:flex items-center justify-center",
                positive ? "bg-emerald-500" : "bg-rose-500"
              )}>
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>

              {/* 月ラベル */}
              <div className="flex items-center gap-3 mb-4">
                <div className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full",
                  "bg-linear-to-r shadow-lg",
                  positive
                    ? "from-emerald-500 to-teal-500"
                    : "from-rose-500 to-pink-500"
                )}>
                  <BarChart3 className="w-4 h-4 text-white" strokeWidth={2} />
                  <span className="text-sm font-bold text-white">
                    {year}年{parseInt(month)}月
                  </span>
                </div>
                <Badge
                  variant="secondary"
                  className={cn(
                    "gap-1",
                    positive
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                      : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                  )}
                >
                  {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {positive ? lang.pages.accounting.surplus : lang.components.accounting.status.deficit}
                </Badge>
              </div>

              <AccountingSummary
                statement={statement}
                previousStatement={visibleStatements[index + 1] ?? null}
                compact={index > 0 || isMobileLite}
              />

              {index === 0 && (
                <div className="mt-6">
                  <TransactionList entries={statement.entries} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MobileTrendSummary({
  statements,
  lang,
}: {
  statements: MonthlyStatement[];
  lang: ReturnType<typeof useLanguage>["lang"];
}) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm p-4 space-y-3">
        <div className="flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-emerald-600" />
        <p className="text-sm font-semibold text-strong">
          {lang.pages.accounting.recentTrend}
        </p>
      </div>
      <div className="grid gap-3">
        {statements.map((s) => {
          const [year, month] = s.month.split("-");
          const positive = s.balance >= 0;
          return (
            <div
              key={s.month}
              className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 px-3.5 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-strong">
                  {year}/{month.padStart(2, "0")}
                </p>
                <p className="text-xs text-muted">
                  {lang.pages.accounting.income} ¥{s.totalIncome.toLocaleString()} / {lang.pages.accounting.expense} ¥{s.totalExpense.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    positive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                  )}
                >
                  {positive ? "+" : "-"}¥{Math.abs(s.balance).toLocaleString()}
                </p>
                <p className="text-[11px] text-muted">{lang.pages.accounting.totalBalance}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* 月選択スケルトン */}
      <div className="flex gap-3 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex-shrink-0 w-40 h-32 rounded-2xl bg-slate-200 dark:bg-slate-700" />
        ))}
      </div>

      {/* グラフスケルトン */}
      <div className="h-96 rounded-2xl bg-slate-200 dark:bg-slate-700" />

      {/* カードスケルトン */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-32 rounded-2xl bg-slate-200 dark:bg-slate-700",
              i === 2 && "lg:col-span-2"
            )}
          />
        ))}
      </div>
    </div>
  );
}

function ErrorState({ error, lang }: { error: Error; lang: ReturnType<typeof useLanguage>["lang"] }) {
  return (
    <Card className="border-2 border-dashed border-rose-300 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-900/10">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6">
        <div className="w-20 h-20 mb-6 rounded-3xl bg-linear-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-xl shadow-rose-500/25">
          <AlertCircle className="w-10 h-10 text-white" strokeWidth={2} />
        </div>
        <h3 className="text-lg font-bold text-strong mb-2">
          {lang.pages.accounting.errorOccurred}
        </h3>
        <p className="text-sm text-muted text-center max-w-md">
          {lang.common.errorPrefix}: {error.message}
        </p>
        <Button variant="outline" className="mt-6" onClick={() => window.location.reload()}>
          {lang.common.reload}
        </Button>
      </CardContent>
    </Card>
  );
}

function EmptyState({ lang }: { lang: ReturnType<typeof useLanguage>["lang"] }) {
  return (
    <Card className="border-2 border-dashed border-slate-300 dark:border-slate-700">
      <CardContent className="flex flex-col items-center justify-center py-20 px-6">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
            <ClipboardList className="w-12 h-12 text-subtle" strokeWidth={1.5} />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg">
            <Receipt className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
        </div>
        <h3 className="text-lg font-bold text-strong mb-2">
          {lang.pages.accounting.noData}
        </h3>
        <p className="text-sm text-muted text-center max-w-md mb-6">
          {lang.pages.accounting.noDataDescription}
        </p>
      </CardContent>
    </Card>
  );
}
