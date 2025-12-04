"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PageContainer } from "@/src/shared/layouts";
import { AccountingSummary, TransactionList, useAccounting } from "@/src/features/accounting";
import { usePermission } from "@/src/features/residents";
import { useLanguage } from "@/src/shared/lang/context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { MonthlyStatement } from "@/src/features/accounting";

type ViewMode = "dashboard" | "history";

export default function AccountingPage() {
  const { statements, loading, error } = useAccounting();
  const { isAccountingAdmin } = usePermission();
  const { lang } = useLanguage();
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("dashboard");

  const selectedStatement = statements[selectedMonthIndex] ?? null;
  const previousStatement = statements[selectedMonthIndex + 1] ?? null;

  // 全期間の集計
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

  // 直近3ヶ月のトレンドデータ
  const trendData = useMemo(() => {
    return statements.slice(0, 3).reverse().map((s) => ({
      month: s.month.slice(5),
      income: s.totalIncome,
      expense: s.totalExpense,
      balance: s.balance,
    }));
  }, [statements]);

  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-6 sm:space-y-8">
        {/* ヘッダー */}
        <Header
          lang={lang}
          isAccountingAdmin={isAccountingAdmin}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {/* ローディング・エラー状態 */}
        {loading && <LoadingState lang={lang} />}
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
                trendData={trendData}
                lang={lang}
              />
            ) : (
              <HistoryView statements={statements} lang={lang} />
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

/* ============================================
 * Header
 * ============================================ */

interface HeaderProps {
  lang: ReturnType<typeof useLanguage>["lang"];
  isAccountingAdmin: boolean;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

function Header({ lang, isAccountingAdmin, viewMode, setViewMode }: HeaderProps) {
  return (
    <header className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wide">
            {lang.pages.accounting.eyebrow}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {lang.pages.accounting.title}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            {lang.pages.accounting.description}
          </p>
        </div>

        {isAccountingAdmin && (
          <Button asChild className="self-start bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">
            <Link href="/accounting/manage">
              <SettingsIcon className="w-4 h-4 mr-2" />
              {lang.nav.accountingAdmin}
            </Link>
          </Button>
        )}
      </div>

      {/* ビュー切替タブ */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)} className="w-fit">
        <TabsList>
          <TabsTrigger value="dashboard" className="gap-2">
            <DashboardIcon className="w-4 h-4" />
            <span className="hidden sm:inline">{lang.pages.accounting.dashboard}</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <HistoryIcon className="w-4 h-4" />
            <span className="hidden sm:inline">{lang.pages.accounting.history}</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </header>
  );
}

/* ============================================
 * Dashboard View
 * ============================================ */

interface DashboardViewProps {
  statements: MonthlyStatement[];
  selectedStatement: MonthlyStatement | null;
  previousStatement: MonthlyStatement | null;
  selectedMonthIndex: number;
  setSelectedMonthIndex: (index: number) => void;
  allTimeSummary: { income: number; expense: number; balance: number };
  trendData: { month: string; income: number; expense: number; balance: number }[];
  lang: ReturnType<typeof useLanguage>["lang"];
}

function DashboardView({
  statements,
  selectedStatement,
  previousStatement,
  selectedMonthIndex,
  setSelectedMonthIndex,
  allTimeSummary,
  trendData,
  lang,
}: DashboardViewProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 月選択タブ（横スクロール） */}
      <MonthTabs
        statements={statements}
        selectedIndex={selectedMonthIndex}
        onSelect={setSelectedMonthIndex}
      />

      {/* クイック統計カード */}
      <QuickStats allTimeSummary={allTimeSummary} trendData={trendData} />

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

/* ============================================
 * Month Tabs
 * ============================================ */

interface MonthTabsProps {
  statements: MonthlyStatement[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

function MonthTabs({ statements, selectedIndex, onSelect }: MonthTabsProps) {
  return (
    <div className="relative">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {statements.map((s, i) => {
          const [year, month] = s.month.split("-");
          const isSelected = i === selectedIndex;
          const positive = s.balance >= 0;

          return (
            <Card
              key={s.month}
              className={cn(
                "flex-shrink-0 min-w-[100px] cursor-pointer transition-all duration-200",
                isSelected
                  ? "border-rose-500 bg-rose-50 dark:bg-rose-900/20"
                  : "hover:border-rose-300 dark:hover:border-rose-700"
              )}
              onClick={() => onSelect(i)}
            >
              <CardContent className="p-3">
                <p className={cn(
                  "text-xs font-medium",
                  isSelected ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground"
                )}>
                  {year}
                </p>
                <p className={cn(
                  "text-lg font-bold",
                  isSelected ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"
                )}>
                  {month}月
                </p>
                <Badge
                  variant="secondary"
                  className={cn(
                    "mt-1 gap-1",
                    positive
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                      : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400"
                  )}
                >
                  <span className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    positive ? "bg-emerald-500" : "bg-rose-500"
                  )} />
                  ¥{s.balance.toLocaleString()}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {/* Gradient fade */}
      <div className="absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />
    </div>
  );
}

/* ============================================
 * Quick Stats
 * ============================================ */

interface QuickStatsProps {
  allTimeSummary: { income: number; expense: number; balance: number };
  trendData: { month: string; income: number; expense: number; balance: number }[];
}

function QuickStats({ allTimeSummary, trendData }: QuickStatsProps) {
  const maxValue = Math.max(...trendData.map((d) => Math.max(d.income, d.expense)));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* 累計残高 */}
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
              <WalletIcon className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-muted-foreground">
              累計残高
            </p>
          </div>
          <p className={cn(
            "text-2xl sm:text-3xl font-bold",
            allTimeSummary.balance >= 0
              ? "text-indigo-600 dark:text-indigo-400"
              : "text-rose-600 dark:text-rose-400"
          )}>
            ¥{allTimeSummary.balance.toLocaleString()}
          </p>
        </CardContent>
      </Card>

      {/* ミニ棒グラフ */}
      <Card className="lg:col-span-2">
        <CardContent className="p-5">
          <p className="text-sm font-semibold text-muted-foreground mb-4">
            直近3ヶ月の推移
          </p>
          <div className="flex items-end justify-around gap-4 h-24">
            {trendData.map((d) => (
              <div key={d.month} className="flex flex-col items-center gap-2 flex-1">
                <div className="flex items-end gap-1 h-16">
                  <div
                    className="w-6 bg-emerald-400 dark:bg-emerald-500 rounded-t transition-all duration-500"
                    style={{ height: `${(d.income / maxValue) * 100}%` }}
                  />
                  <div
                    className="w-6 bg-rose-400 dark:bg-rose-500 rounded-t transition-all duration-500"
                    style={{ height: `${(d.expense / maxValue) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {d.month}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
              <span>収入</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-400" />
              <span>支出</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ============================================
 * History View
 * ============================================ */

interface HistoryViewProps {
  statements: MonthlyStatement[];
  lang: ReturnType<typeof useLanguage>["lang"];
}

function HistoryView({ statements, lang }: HistoryViewProps) {
  return (
    <div className="space-y-6">
      {statements.map((statement, index) => (
        <section
          key={statement.month}
          className="space-y-4 animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <AccountingSummary
            statement={statement}
            previousStatement={statements[index + 1] ?? null}
            compact={index > 0}
          />
          {index === 0 && (
            <TransactionList entries={statement.entries} />
          )}
        </section>
      ))}
    </div>
  );
}

/* ============================================
 * States
 * ============================================ */

function LoadingState({ lang }: { lang: ReturnType<typeof useLanguage>["lang"] }) {
  return (
    <div className="space-y-6">
      {/* スケルトンカード */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-32 rounded-2xl skeleton",
              i === 2 && "lg:col-span-2"
            )}
          />
        ))}
      </div>
      <div className="h-64 rounded-2xl skeleton" />
    </div>
  );
}

function ErrorState({ error, lang }: { error: Error; lang: ReturnType<typeof useLanguage>["lang"] }) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-16 px-6",
      "rounded-2xl border-2 border-dashed border-rose-200 dark:border-rose-800",
      "bg-rose-50/50 dark:bg-rose-900/10"
    )}>
      <div className="w-16 h-16 mb-4 rounded-2xl bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center">
        <AlertIcon className="w-8 h-8 text-rose-500" />
      </div>
      <p className="text-sm font-medium text-rose-600 dark:text-rose-400">
        {lang.common.errorPrefix}: {error.message}
      </p>
    </div>
  );
}

function EmptyState({ lang }: { lang: ReturnType<typeof useLanguage>["lang"] }) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-16 px-6",
      "rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700",
      "bg-slate-50/50 dark:bg-slate-800/30"
    )}>
      <div className="w-16 h-16 mb-4 rounded-2xl bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center">
        <EmptyIcon className="w-8 h-8 text-slate-400 dark:text-slate-500" />
      </div>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
        会計データがありません
      </p>
    </div>
  );
}

/* ============================================
 * Icons
 * ============================================ */

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  );
}

function HistoryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function WalletIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function EmptyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );
}
