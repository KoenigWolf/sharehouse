"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/src/shared/lang/context";
import type { MonthlyStatement } from "../types";
import {
  Calendar,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Wallet,
  Coins,
  Receipt,
  PieChart,
  Sparkles,
} from "lucide-react";

interface AccountingSummaryProps {
  statement: MonthlyStatement;
  previousStatement?: MonthlyStatement | null;
  compact?: boolean;
}

export function AccountingSummary({
  statement,
  previousStatement,
  compact = false
}: AccountingSummaryProps) {
  const { lang } = useLanguage();
  const monthLabel = format(new Date(`${statement.month}-01`), "yyyy/MM");
  const positive = statement.balance >= 0;

  const trends = useMemo(() => {
    if (!previousStatement) return null;
    return {
      income: statement.totalIncome - previousStatement.totalIncome,
      expense: statement.totalExpense - previousStatement.totalExpense,
      balance: statement.balance - previousStatement.balance,
    };
  }, [statement, previousStatement]);

  const expenseRatio = useMemo(() => {
    const total = statement.totalIncome + statement.totalExpense;
    if (total === 0) return 0;
    return Math.round((statement.totalExpense / total) * 100);
  }, [statement]);

  if (compact) {
    return (
      <CompactSummary
        statement={statement}
        monthLabel={monthLabel}
        positive={positive}
        lang={lang}
      />
    );
  }

  return (
    <section className="space-y-6">
      {/* ヘッダー */}
      <header className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-4">
          <div className={cn(
            "relative flex items-center justify-center w-14 h-14 rounded-2xl",
            "bg-linear-to-br shadow-xl",
            positive
              ? "from-emerald-400 to-teal-500 shadow-emerald-500/25"
              : "from-rose-400 to-pink-500 shadow-rose-500/25"
          )}>
            <Calendar className="w-7 h-7 text-white" strokeWidth={2} />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center shadow-lg">
              {positive ? (
                <CheckCircle className="w-4 h-4 text-emerald-500" strokeWidth={2.5} />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-500" strokeWidth={2.5} />
              )}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
              {lang.pages.accounting.eyebrow}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {monthLabel}
            </h2>
          </div>
        </div>
        <Badge
          className={cn(
            "gap-2 px-4 py-2 text-sm font-semibold",
            positive
              ? "bg-linear-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-lg shadow-emerald-500/25"
              : "bg-linear-to-r from-rose-500 to-pink-500 text-white border-0 shadow-lg shadow-rose-500/25"
          )}
        >
          {positive ? (
            <TrendingUp className="w-4 h-4" strokeWidth={2.5} />
          ) : (
            <TrendingDown className="w-4 h-4" strokeWidth={2.5} />
          )}
          {positive ? lang.components.accounting.status.surplus : lang.components.accounting.status.deficit}
        </Badge>
      </header>

      {/* メインカード */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 収入カード */}
        <div className="lg:col-span-3">
          <SummaryCard
            label={lang.components.accounting.summary.income}
            amount={statement.totalIncome}
            tone="positive"
            icon={<ArrowUp className="w-5 h-5" strokeWidth={2.5} />}
            trend={trends?.income}
          />
        </div>

        {/* 支出カード */}
        <div className="lg:col-span-3">
          <SummaryCard
            label={lang.components.accounting.summary.expense}
            amount={statement.totalExpense}
            tone="negative"
            icon={<ArrowDown className="w-5 h-5" strokeWidth={2.5} />}
            trend={trends?.expense}
          />
        </div>

        {/* 残高カード（大きめ） */}
        <div className="lg:col-span-6">
          <BalanceCard
            balance={statement.balance}
            positive={positive}
            trend={trends?.balance}
            expenseRatio={expenseRatio}
            lang={lang}
          />
        </div>
      </div>
    </section>
  );
}

/* ============================================
 * Summary Card
 * ============================================ */

interface SummaryCardProps {
  label: string;
  amount: number;
  tone: "positive" | "negative";
  icon: React.ReactNode;
  trend?: number | null;
}

function SummaryCard({ label, amount, tone, icon, trend }: SummaryCardProps) {
  const isPositive = tone === "positive";

  return (
    <Card className={cn(
      "relative overflow-hidden h-full group",
      "border-0 shadow-lg hover:shadow-xl transition-all duration-300",
      "bg-linear-to-br",
      isPositive
        ? "from-emerald-50 to-teal-50/50 dark:from-emerald-900/20 dark:to-teal-900/10"
        : "from-rose-50 to-pink-50/50 dark:from-rose-900/20 dark:to-pink-900/10"
    )}>
      {/* 装飾 */}
      <div className={cn(
        "absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20",
        isPositive ? "bg-emerald-400" : "bg-rose-400"
      )} />

      <CardContent className="relative p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-muted-foreground">
            {label}
          </span>
          <div className={cn(
            "flex items-center justify-center w-11 h-11 rounded-xl",
            "transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
            "shadow-lg",
            isPositive
              ? "bg-linear-to-br from-emerald-400 to-emerald-600 text-white shadow-emerald-500/30"
              : "bg-linear-to-br from-rose-400 to-rose-600 text-white shadow-rose-500/30"
          )}>
            {icon}
          </div>
        </div>

        <div className="space-y-2">
          <span className={cn(
            "text-3xl sm:text-4xl font-bold tracking-tight",
            isPositive
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-rose-600 dark:text-rose-400"
          )}>
            ¥{amount.toLocaleString()}
          </span>

          {trend !== undefined && trend !== null && (
            <TrendIndicator value={trend} inverted={!isPositive} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/* ============================================
 * Balance Card
 * ============================================ */

interface BalanceCardProps {
  balance: number;
  positive: boolean;
  trend?: number | null;
  expenseRatio: number;
  lang: ReturnType<typeof useLanguage>["lang"];
}

function BalanceCard({ balance, positive, trend, expenseRatio, lang }: BalanceCardProps) {
  return (
    <Card className={cn(
      "relative overflow-hidden h-full",
      "border-0 shadow-xl",
      "bg-linear-to-br",
      positive
        ? "from-indigo-500 via-purple-500 to-pink-500"
        : "from-rose-500 via-pink-500 to-orange-500"
    )}>
      {/* 装飾パターン */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -translate-x-1/3 translate-y-1/3" />
      </div>

      <CardContent className="relative p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 h-full">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-white/80" strokeWidth={2} />
            <span className="text-sm font-semibold text-white/80">
              {lang.components.accounting.summary.balance}
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
              ¥{Math.abs(balance).toLocaleString()}
            </span>
            {!positive && (
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                {lang.components.accounting.status.deficit}
              </Badge>
            )}
          </div>

          {trend !== undefined && trend !== null && (
            <TrendIndicator value={trend} size="lg" light />
          )}
        </div>

        {/* ミニ円グラフ */}
        <div className="flex items-center gap-5 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <MiniPieChart percentage={100 - expenseRatio} />
          <div className="text-sm space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-white shadow-lg" />
              <span className="text-white/90 font-medium">{lang.components.accounting.summary.incomePercent(100 - expenseRatio)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-white/40" />
              <span className="text-white/70 font-medium">{lang.components.accounting.summary.expensePercent(expenseRatio)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ============================================
 * Mini Pie Chart
 * ============================================ */

function MiniPieChart({ percentage }: { percentage: number }) {
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-20 h-20">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-white/20"
        />
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="text-white transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-white">
          {percentage}%
        </span>
      </div>
    </div>
  );
}

/* ============================================
 * Trend Indicator
 * ============================================ */

interface TrendIndicatorProps {
  value: number;
  inverted?: boolean;
  size?: "sm" | "lg";
  light?: boolean;
}

function TrendIndicator({ value, inverted = false, size = "sm", light = false }: TrendIndicatorProps) {
  const isPositive = inverted ? value < 0 : value > 0;
  const isNeutral = value === 0;

  if (isNeutral) return null;

  if (light) {
    return (
      <div className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full",
        "bg-white/20 backdrop-blur-sm",
        size === "lg" ? "text-sm" : "text-xs"
      )}>
        {value > 0 ? (
          <TrendingUp className={cn(size === "lg" ? "w-4 h-4" : "w-3 h-3", "text-white")} strokeWidth={2.5} />
        ) : (
          <TrendingDown className={cn(size === "lg" ? "w-4 h-4" : "w-3 h-3", "text-white")} strokeWidth={2.5} />
        )}
        <span className="font-semibold text-white">
          {value > 0 ? "+" : ""}¥{Math.abs(value).toLocaleString()}
        </span>
      </div>
    );
  }

  return (
    <Badge
      variant="secondary"
      className={cn(
        "gap-1.5 font-semibold",
        size === "lg" ? "text-sm px-3 py-1.5" : "text-xs px-2.5 py-1",
        isPositive
          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-300"
          : "bg-rose-100 text-rose-700 hover:bg-rose-100 dark:bg-rose-900/40 dark:text-rose-300"
      )}
    >
      {value > 0 ? (
        <TrendingUp className={cn(size === "lg" ? "w-4 h-4" : "w-3 h-3")} strokeWidth={2.5} />
      ) : (
        <TrendingDown className={cn(size === "lg" ? "w-4 h-4" : "w-3 h-3")} strokeWidth={2.5} />
      )}
      <span>
        {value > 0 ? "+" : ""}¥{Math.abs(value).toLocaleString()}
      </span>
    </Badge>
  );
}

/* ============================================
 * Compact Summary
 * ============================================ */

interface CompactSummaryProps {
  statement: MonthlyStatement;
  monthLabel: string;
  positive: boolean;
  lang: ReturnType<typeof useLanguage>["lang"];
}

function CompactSummary({ statement, monthLabel, positive, lang }: CompactSummaryProps) {
  return (
    <Card className={cn(
      "group border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer",
      "bg-linear-to-r",
      positive
        ? "from-white to-emerald-50/50 dark:from-slate-800 dark:to-emerald-900/10"
        : "from-white to-rose-50/50 dark:from-slate-800 dark:to-rose-900/10"
    )}>
      <CardContent className="flex items-center justify-between p-5">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            "transition-transform group-hover:scale-110",
            positive
              ? "bg-linear-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/25"
              : "bg-linear-to-br from-rose-400 to-rose-600 shadow-lg shadow-rose-500/25"
          )}>
            <Receipt className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{monthLabel}</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5" />
              {lang.components.accounting.summary.balance}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={cn(
            "text-2xl font-bold",
            positive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
          )}>
            {positive ? "+" : ""}¥{statement.balance.toLocaleString()}
          </span>
          {positive ? (
            <TrendingUp className="w-5 h-5 text-emerald-500" strokeWidth={2.5} />
          ) : (
            <TrendingDown className="w-5 h-5 text-rose-500" strokeWidth={2.5} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
