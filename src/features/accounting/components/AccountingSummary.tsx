"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";

interface AccountingSummaryProps {
  statement: MonthlyStatement;
  /** 前月のステートメント（トレンド表示用） */
  previousStatement?: MonthlyStatement | null;
  /** コンパクト表示 */
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

  // トレンド計算
  const trends = useMemo(() => {
    if (!previousStatement) return null;
    return {
      income: statement.totalIncome - previousStatement.totalIncome,
      expense: statement.totalExpense - previousStatement.totalExpense,
      balance: statement.balance - previousStatement.balance,
    };
  }, [statement, previousStatement]);

  // 収支比率（円グラフ用）
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
    <section className="space-y-4 sm:space-y-5">
      {/* ヘッダー */}
      <header className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex items-center justify-center w-12 h-12 rounded-2xl",
            "bg-gradient-to-br",
            positive
              ? "from-emerald-400 to-teal-500"
              : "from-rose-400 to-pink-500",
            "shadow-lg shadow-emerald-500/20 dark:shadow-emerald-900/30"
          )}>
            <Calendar className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              {lang.pages.accounting.eyebrow}
            </p>
            <h2 className="text-xl sm:text-2xl font-bold">
              {monthLabel}
            </h2>
          </div>
        </div>
        <Badge
          variant={positive ? "default" : "destructive"}
          className={cn(
            "gap-1.5 px-3 py-1.5",
            positive
              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-200"
              : "bg-rose-100 text-rose-700 hover:bg-rose-100 dark:bg-rose-900/50 dark:text-rose-200"
          )}
        >
          {positive ? (
            <CheckCircle className="w-4 h-4" strokeWidth={2.5} />
          ) : (
            <AlertCircle className="w-4 h-4" strokeWidth={2.5} />
          )}
          {positive ? lang.components.accounting.status.surplus : lang.components.accounting.status.deficit}
        </Badge>
      </header>

      {/* メインカード */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* 収入カード */}
        <SummaryCard
          label={lang.components.accounting.summary.income}
          amount={statement.totalIncome}
          tone="positive"
          icon={<ArrowUp className="w-5 h-5" strokeWidth={2.5} />}
          trend={trends?.income}
        />

        {/* 支出カード */}
        <SummaryCard
          label={lang.components.accounting.summary.expense}
          amount={statement.totalExpense}
          tone="negative"
          icon={<ArrowDown className="w-5 h-5" strokeWidth={2.5} />}
          trend={trends?.expense}
        />

        {/* 残高カード（大きめ） */}
        <div className="lg:col-span-2">
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
 * Sub-components
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
      "relative overflow-hidden group py-0",
      "hover:shadow-md transition-shadow duration-200"
    )}>
      {/* 背景グラデーション */}
      <div className={cn(
        "absolute inset-0 opacity-[0.03] dark:opacity-[0.08]",
        "bg-gradient-to-br",
        isPositive
          ? "from-emerald-500 to-teal-500"
          : "from-rose-500 to-pink-500"
      )} />

      <CardContent className="relative p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-muted-foreground">
            {label}
          </span>
          <div className={cn(
            "flex items-center justify-center w-9 h-9 rounded-xl",
            "transition-transform group-hover:scale-110",
            isPositive
              ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300"
              : "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300"
          )}>
            {icon}
          </div>
        </div>

        <div className="space-y-1">
          <span className={cn(
            "text-2xl sm:text-3xl font-bold tracking-tight",
            isPositive
              ? "text-emerald-600 dark:text-emerald-300"
              : "text-rose-600 dark:text-rose-300"
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
      "relative overflow-hidden h-full py-0",
      "bg-gradient-to-br",
      positive
        ? "from-emerald-50 to-teal-50/50 dark:from-emerald-900/20 dark:to-teal-900/10"
        : "from-rose-50 to-pink-50/50 dark:from-rose-900/20 dark:to-pink-900/10"
    )}>
      <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 h-full">
        <div className="space-y-2">
          <span className="text-sm font-semibold text-muted-foreground">
            {lang.components.accounting.summary.balance}
          </span>
          <div className="flex items-baseline gap-2">
            <span className={cn(
              "text-3xl sm:text-4xl font-bold tracking-tight",
              positive
                ? "text-emerald-600 dark:text-emerald-300"
                : "text-rose-600 dark:text-rose-300"
            )}>
              ¥{Math.abs(balance).toLocaleString()}
            </span>
            {!positive && (
              <Badge variant="destructive" className="text-xs">
                赤字
              </Badge>
            )}
          </div>
          {trend !== undefined && trend !== null && (
            <TrendIndicator value={trend} size="lg" />
          )}
        </div>

        {/* ミニ円グラフ */}
        <div className="flex items-center gap-4">
          <MiniPieChart percentage={100 - expenseRatio} />
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>収入 {100 - expenseRatio}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>支出 {expenseRatio}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MiniPieChart({ percentage }: { percentage: number }) {
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-16 h-16">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
        {/* 背景の円 */}
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-rose-200 dark:text-rose-800"
        />
        {/* 前景の円（収入率） */}
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
          className="text-emerald-500 dark:text-emerald-400 transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold">
          {percentage}%
        </span>
      </div>
    </div>
  );
}

interface TrendIndicatorProps {
  value: number;
  inverted?: boolean;
  size?: "sm" | "lg";
}

function TrendIndicator({ value, inverted = false, size = "sm" }: TrendIndicatorProps) {
  const isPositive = inverted ? value < 0 : value > 0;
  const isNeutral = value === 0;

  if (isNeutral) return null;

  return (
    <Badge
      variant="secondary"
      className={cn(
        "gap-1",
        size === "lg" ? "text-sm px-2.5 py-1" : "text-xs px-2 py-0.5",
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
      <span className="font-medium">
        {value > 0 ? "+" : ""}¥{Math.abs(value).toLocaleString()}
      </span>
    </Badge>
  );
}

interface CompactSummaryProps {
  statement: MonthlyStatement;
  monthLabel: string;
  positive: boolean;
  lang: ReturnType<typeof useLanguage>["lang"];
}

function CompactSummary({ statement, monthLabel, positive, lang }: CompactSummaryProps) {
  return (
    <Card className={cn(
      "py-0 hover:shadow-md transition-shadow cursor-pointer"
    )}>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-2 h-8 rounded-full",
            positive ? "bg-emerald-500" : "bg-rose-500"
          )} />
          <div>
            <p className="text-sm font-bold">{monthLabel}</p>
            <p className="text-xs text-muted-foreground">
              {lang.components.accounting.summary.balance}
            </p>
          </div>
        </div>
        <span className={cn(
          "text-lg font-bold",
          positive ? "text-emerald-600 dark:text-emerald-300" : "text-rose-600 dark:text-rose-300"
        )}>
          ¥{statement.balance.toLocaleString()}
        </span>
      </CardContent>
    </Card>
  );
}

