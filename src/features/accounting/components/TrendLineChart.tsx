"use client";

import { useMemo, useState, useCallback } from "react";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
  ReferenceLine,
  Bar,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Receipt,
  PiggyBank,
  Eye,
  EyeOff,
  Calendar,
  CalendarDays,
  CalendarRange,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { MonthlyStatement } from "../types";

interface TrendLineChartProps {
  statements: MonthlyStatement[];
  /** 表示する月数（デフォルト: 6） */
  months?: number;
}

type ViewMode = "daily" | "monthly" | "yearly";
type DataKey = "income" | "expense" | "cumulative";

interface ChartDataPoint {
  key: string;
  label: string;
  fullLabel: string;
  income: number;
  expense: number;
  balance: number;
  cumulative: number;
}

const DATA_CONFIG: Record<DataKey, {
  label: string;
  color: string;
  gradientId: string;
  icon: typeof TrendingUp;
  bgClass: string;
  textClass: string;
}> = {
  income: {
    label: "収入",
    color: "#10b981",
    gradientId: "incomeGradient",
    icon: ArrowUpRight,
    bgClass: "bg-emerald-500/10",
    textClass: "text-emerald-600 dark:text-emerald-400",
  },
  expense: {
    label: "支出",
    color: "#f43f5e",
    gradientId: "expenseGradient",
    icon: ArrowDownRight,
    bgClass: "bg-rose-500/10",
    textClass: "text-rose-600 dark:text-rose-400",
  },
  cumulative: {
    label: "累計残高",
    color: "#0f766e",
    gradientId: "cumulativeGradient",
    icon: Wallet,
    bgClass: "bg-emerald-500/10",
    textClass: "text-emerald-600 dark:text-emerald-400",
  },
};

const VIEW_CONFIG: Record<ViewMode, {
  label: string;
  icon: typeof Calendar;
  description: string;
}> = {
  daily: {
    label: "日別",
    icon: Calendar,
    description: "直近30日間の推移",
  },
  monthly: {
    label: "月別",
    icon: CalendarDays,
    description: "月単位の推移",
  },
  yearly: {
    label: "年別",
    icon: CalendarRange,
    description: "年単位の推移",
  },
};

export function TrendLineChart({ statements, months = 6 }: TrendLineChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("monthly");
  const [visibleLines, setVisibleLines] = useState<Record<DataKey, boolean>>({
    income: true,
    expense: true,
    cumulative: true,
  });
  const [hoveredLine, setHoveredLine] = useState<DataKey | null>(null);

  // 日別データを生成
  const dailyData = useMemo((): ChartDataPoint[] => {
    // 直近の月のエントリーを取得
    const recentMonth = statements[0];
    if (!recentMonth) return [];

    // 日付ごとに集約
    const dailyMap = new Map<string, { income: number; expense: number }>();

    // 直近30日分の日付を生成
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split("T")[0];
      dailyMap.set(key, { income: 0, expense: 0 });
    }

    // エントリーを日付ごとに集計
    statements.slice(0, 2).forEach((s) => {
      s.entries.forEach((entry) => {
        const existing = dailyMap.get(entry.date);
        if (existing) {
          if (entry.type === "income") {
            existing.income += entry.amount;
          } else {
            existing.expense += entry.amount;
          }
        }
      });
    });

    // 累計計算して配列に変換
    let cumulative = 0;
    return Array.from(dailyMap.entries()).map(([date, data]) => {
      const balance = data.income - data.expense;
      cumulative += balance;
      const d = new Date(date);
      return {
        key: date,
        label: `${d.getMonth() + 1}/${d.getDate()}`,
        fullLabel: `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`,
        income: data.income,
        expense: data.expense,
        balance,
        cumulative,
      };
    });
  }, [statements]);

  // 月別データを生成
  const monthlyData = useMemo((): ChartDataPoint[] => {
    const recentStatements = statements.slice(0, months).reverse();

    return recentStatements.reduce<ChartDataPoint[]>((acc, s) => {
      const cumulative = (acc.at(-1)?.cumulative ?? 0) + s.balance;
      const [year, month] = s.month.split("-");
      acc.push({
        key: s.month,
        label: `${parseInt(month)}月`,
        fullLabel: `${year}年${parseInt(month)}月`,
        income: s.totalIncome,
        expense: s.totalExpense,
        balance: s.balance,
        cumulative,
      });
      return acc;
    }, []);
  }, [statements, months]);

  // 年別データを生成
  const yearlyData = useMemo((): ChartDataPoint[] => {
    const yearMap = new Map<string, { income: number; expense: number }>();

    statements.forEach((s) => {
      const year = s.month.split("-")[0];
      const existing = yearMap.get(year) || { income: 0, expense: 0 };
      existing.income += s.totalIncome;
      existing.expense += s.totalExpense;
      yearMap.set(year, existing);
    });

    // 年をソート（古い順）
    const sortedYears = Array.from(yearMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));

    return sortedYears.reduce<ChartDataPoint[]>((acc, [year, data]) => {
      const balance = data.income - data.expense;
      const cumulative = (acc.at(-1)?.cumulative ?? 0) + balance;
      acc.push({
        key: year,
        label: `${year}年`,
        fullLabel: `${year}年`,
        income: data.income,
        expense: data.expense,
        balance,
        cumulative,
      });
      return acc;
    }, []);
  }, [statements]);

  // 現在のビューモードに応じたデータを選択
  const chartData = useMemo(() => {
    switch (viewMode) {
      case "daily":
        return dailyData;
      case "yearly":
        return yearlyData;
      default:
        return monthlyData;
    }
  }, [viewMode, dailyData, monthlyData, yearlyData]);

  // サマリー統計
  const summary = useMemo(() => {
    if (chartData.length < 2) return null;

    const latest = chartData[chartData.length - 1];
    const previous = chartData[chartData.length - 2];

    const incomeChange = latest.income - previous.income;
    const expenseChange = latest.expense - previous.expense;
    const incomeChangePercent = previous.income ? ((incomeChange / previous.income) * 100).toFixed(1) : "0";
    const expenseChangePercent = previous.expense ? ((expenseChange / previous.expense) * 100).toFixed(1) : "0";

    const totalIncome = chartData.reduce((sum, d) => sum + d.income, 0);
    const totalExpense = chartData.reduce((sum, d) => sum + d.expense, 0);
    const avgBalance = chartData.reduce((sum, d) => sum + d.balance, 0) / chartData.length;

    const periodLabels: Record<ViewMode, string> = {
      daily: "今日",
      monthly: "今月",
      yearly: "今年",
    };

    return {
      latest,
      incomeChange,
      expenseChange,
      incomeChangePercent,
      expenseChangePercent,
      totalIncome,
      totalExpense,
      avgBalance,
      cumulative: latest.cumulative,
      periodLabel: periodLabels[viewMode],
    };
  }, [chartData, viewMode]);

  // Y軸の範囲を計算
  const yAxisDomain = useMemo(() => {
    if (chartData.length === 0) return [0, 100000];
    const visibleKeys = (Object.keys(visibleLines) as DataKey[]).filter(k => visibleLines[k]);
    const allValues = chartData.flatMap((d) => visibleKeys.map(k => d[k]));
    if (allValues.length === 0) return [0, 100000];
    const max = Math.max(...allValues);
    const min = Math.min(...allValues, 0);
    const padding = (max - min) * 0.15;

    // ビューモードに応じて丸め単位を調整
    const roundUnit = viewMode === "yearly" ? 100000 : 10000;
    return [
      Math.floor((min - padding) / roundUnit) * roundUnit,
      Math.ceil((max + padding) / roundUnit) * roundUnit,
    ];
  }, [chartData, visibleLines, viewMode]);

  // Y軸フォーマッタ
  const yAxisFormatter = useCallback((value: number) => {
    if (viewMode === "yearly" || Math.abs(value) >= 1000000) {
      return `¥${(value / 10000).toFixed(0)}万`;
    }
    return `¥${(value / 10000).toFixed(0)}万`;
  }, [viewMode]);

  const toggleLine = useCallback((key: DataKey) => {
    setVisibleLines(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  if (chartData.length === 0) {
    return null;
  }

  const viewConfig = VIEW_CONFIG[viewMode];

  return (
    <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      {/* ヘッダー */}
      <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex flex-col gap-4">
          {/* タイトル行 */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-500 to-amber-400 text-white shadow-lg shadow-emerald-500/25">
                  <TrendingUp className="w-6 h-6" strokeWidth={2} />
                </div>
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                  収支推移グラフ
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {viewConfig.description}
                </p>
              </div>
            </div>

            {/* 期間切り替えタブ */}
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
              <TabsList className="bg-slate-100/80 dark:bg-slate-800/80 p-1">
                {(Object.keys(VIEW_CONFIG) as ViewMode[]).map((mode) => {
                  const config = VIEW_CONFIG[mode];
                  const Icon = config.icon;
                  return (
                    <TabsTrigger
                      key={mode}
                      value={mode}
                      className={cn(
                        "gap-1.5 text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700",
                        "data-[state=active]:shadow-sm"
                      )}
                    >
                      <Icon className="w-4 h-4" strokeWidth={2} />
                      <span className="hidden sm:inline">{config.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
          </div>

          {/* インタラクティブ凡例 */}
          <div className="flex flex-wrap gap-2">
            {(Object.keys(DATA_CONFIG) as DataKey[]).map((key) => {
              const config = DATA_CONFIG[key];
              const isVisible = visibleLines[key];
              const Icon = isVisible ? Eye : EyeOff;

              return (
                <button
                  key={key}
                  onClick={() => toggleLine(key)}
                  onMouseEnter={() => setHoveredLine(key)}
                  onMouseLeave={() => setHoveredLine(null)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                    "border-2 hover:scale-105 active:scale-95",
                    isVisible
                      ? "border-current opacity-100"
                      : "border-slate-300 dark:border-slate-600 opacity-50",
                    config.textClass
                  )}
                >
                  <span
                    className={cn(
                      "w-3 h-3 rounded-full transition-all",
                      isVisible ? "scale-100" : "scale-75"
                    )}
                    style={{ backgroundColor: isVisible ? config.color : "#94a3b8" }}
                  />
                  <span>{config.label}</span>
                  <Icon className="w-3.5 h-3.5 opacity-60" />
                </button>
              );
            })}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 pb-4">
        {/* サマリーカード */}
        {summary && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <SummaryCard
              icon={ArrowUpRight}
              label={`${summary.periodLabel}の収入`}
              value={summary.latest.income}
              change={summary.incomeChange}
              changePercent={summary.incomeChangePercent}
              positive={summary.incomeChange >= 0}
              colorClass="emerald"
            />
            <SummaryCard
              icon={ArrowDownRight}
              label={`${summary.periodLabel}の支出`}
              value={summary.latest.expense}
              change={summary.expenseChange}
              changePercent={summary.expenseChangePercent}
              positive={summary.expenseChange <= 0}
              colorClass="rose"
            />
            <SummaryCard
              icon={PiggyBank}
              label="平均収支"
              value={Math.round(summary.avgBalance)}
              positive={summary.avgBalance >= 0}
              colorClass="amber"
            />
            <SummaryCard
              icon={Wallet}
              label="累計残高"
              value={summary.cumulative}
              positive={summary.cumulative >= 0}
              colorClass="emerald"
              highlight
            />
          </div>
        )}

        {/* グラフ本体 */}
        <div className="h-[320px] sm:h-[380px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
            >
              {/* グラデーション定義 */}
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="cumulativeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f766e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0f766e" stopOpacity={0.05} />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* グリッド線 */}
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                className="text-slate-200/60 dark:text-slate-700/60"
                vertical={false}
              />

              {/* ゼロライン */}
              <ReferenceLine
                y={0}
                stroke="currentColor"
                className="text-slate-400 dark:text-slate-500"
                strokeWidth={1}
              />

              {/* X軸 */}
              <XAxis
                dataKey="label"
                tick={{ fontSize: viewMode === "daily" ? 10 : 12, fill: "currentColor" }}
                tickLine={false}
                axisLine={false}
                className="text-slate-500 dark:text-slate-400"
                dy={10}
                interval={viewMode === "daily" ? 4 : 0}
              />

              {/* Y軸 */}
              <YAxis
                domain={yAxisDomain}
                tick={{ fontSize: 11, fill: "currentColor" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={yAxisFormatter}
                className="text-slate-500 dark:text-slate-400"
                width={55}
              />

              {/* ツールチップ */}
              <Tooltip
                content={<CustomTooltip visibleLines={visibleLines} viewMode={viewMode} />}
                cursor={{
                  stroke: "currentColor",
                  strokeWidth: 1,
                  strokeDasharray: "5 5",
                  className: "text-slate-400 dark:text-slate-500",
                }}
              />

              {/* 日別表示では棒グラフを使用 */}
              {viewMode === "daily" ? (
                <>
                  {visibleLines.income && (
                    <Bar
                      dataKey="income"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                      opacity={0.8}
                      animationDuration={1000}
                    />
                  )}
                  {visibleLines.expense && (
                    <Bar
                      dataKey="expense"
                      fill="#f43f5e"
                      radius={[4, 4, 0, 0]}
                      opacity={0.8}
                      animationDuration={1000}
                    />
                  )}
                  {visibleLines.cumulative && (
                    <Line
                      type="monotone"
                      dataKey="cumulative"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot={false}
                      animationDuration={1500}
                    />
                  )}
                </>
              ) : (
                <>
                  {/* 収入のエリア */}
                  {visibleLines.income && (
                    <Area
                      type="monotone"
                      dataKey="income"
                      fill="url(#incomeGradient)"
                      stroke="none"
                      animationDuration={1000}
                      animationEasing="ease-out"
                    />
                  )}

                  {/* 支出のエリア */}
                  {visibleLines.expense && (
                    <Area
                      type="monotone"
                      dataKey="expense"
                      fill="url(#expenseGradient)"
                      stroke="none"
                      animationDuration={1000}
                      animationEasing="ease-out"
                    />
                  )}

                  {/* 累計残高のエリア */}
                  {visibleLines.cumulative && (
                    <Area
                      type="monotone"
                      dataKey="cumulative"
                      fill="url(#cumulativeGradient)"
                      stroke="none"
                      animationDuration={1000}
                      animationEasing="ease-out"
                    />
                  )}

                  {/* 収入の折れ線 */}
                  {visibleLines.income && (
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke="#10b981"
                      strokeWidth={hoveredLine === "income" ? 4 : 3}
                      dot={{
                        r: hoveredLine === "income" ? 6 : 5,
                        fill: "#10b981",
                        strokeWidth: 3,
                        stroke: "#fff",
                      }}
                      activeDot={{
                        r: 8,
                        fill: "#10b981",
                        strokeWidth: 3,
                        stroke: "#fff",
                        filter: "url(#glow)",
                      }}
                      animationDuration={1500}
                      animationEasing="ease-out"
                      style={{
                        filter: hoveredLine === "income" ? "url(#glow)" : undefined,
                        transition: "all 0.2s ease",
                      }}
                    />
                  )}

                  {/* 支出の折れ線 */}
                  {visibleLines.expense && (
                    <Line
                      type="monotone"
                      dataKey="expense"
                      stroke="#f43f5e"
                      strokeWidth={hoveredLine === "expense" ? 4 : 3}
                      dot={{
                        r: hoveredLine === "expense" ? 6 : 5,
                        fill: "#f43f5e",
                        strokeWidth: 3,
                        stroke: "#fff",
                      }}
                      activeDot={{
                        r: 8,
                        fill: "#f43f5e",
                        strokeWidth: 3,
                        stroke: "#fff",
                        filter: "url(#glow)",
                      }}
                      animationDuration={1500}
                      animationEasing="ease-out"
                      animationBegin={200}
                      style={{
                        filter: hoveredLine === "expense" ? "url(#glow)" : undefined,
                        transition: "all 0.2s ease",
                      }}
                    />
                  )}

                  {/* 累計残高の折れ線 */}
                  {visibleLines.cumulative && (
                    <Line
                      type="monotone"
                      dataKey="cumulative"
                      stroke="#6366f1"
                      strokeWidth={hoveredLine === "cumulative" ? 4 : 3}
                      strokeDasharray="8 4"
                      dot={{
                        r: hoveredLine === "cumulative" ? 6 : 5,
                        fill: "#6366f1",
                        strokeWidth: 3,
                        stroke: "#fff",
                      }}
                      activeDot={{
                        r: 8,
                        fill: "#6366f1",
                        strokeWidth: 3,
                        stroke: "#fff",
                        filter: "url(#glow)",
                      }}
                      animationDuration={1500}
                      animationEasing="ease-out"
                      animationBegin={400}
                      style={{
                        filter: hoveredLine === "cumulative" ? "url(#glow)" : undefined,
                        transition: "all 0.2s ease",
                      }}
                    />
                  )}
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* フッター */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-muted-foreground">
          <span>※ 凡例をクリックで表示/非表示を切り替え</span>
          <Badge variant="secondary" className="text-xs">
            {chartData[0]?.fullLabel} 〜 {chartData[chartData.length - 1]?.fullLabel}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

/* ============================================
 * Summary Card
 * ============================================ */

interface SummaryCardProps {
  icon: typeof TrendingUp;
  label: string;
  value: number;
  change?: number;
  changePercent?: string;
  positive: boolean;
  colorClass: "emerald" | "rose" | "amber" | "brand";
  highlight?: boolean;
}

const colorStyles = {
  emerald: {
    bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    text: "text-emerald-600 dark:text-emerald-400",
    icon: "text-emerald-500",
  },
  rose: {
    bg: "bg-rose-500/10 dark:bg-rose-500/20",
    text: "text-rose-600 dark:text-rose-400",
    icon: "text-rose-500",
  },
  amber: {
    bg: "bg-amber-500/10 dark:bg-amber-500/20",
    text: "text-amber-600 dark:text-amber-400",
    icon: "text-amber-500",
  },
  brand: {
    bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    text: "text-emerald-600 dark:text-emerald-400",
    icon: "text-emerald-500",
  },
};

function SummaryCard({
  icon: Icon,
  label,
  value,
  change,
  changePercent,
  positive,
  colorClass,
  highlight,
}: SummaryCardProps) {
  const styles = colorStyles[colorClass];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl p-3 sm:p-4 transition-all duration-200 hover:scale-[1.02]",
        styles.bg,
        highlight && "ring-2 ring-emerald-500/30"
      )}
    >
      {highlight && (
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full -translate-y-10 translate-x-10" />
      )}
      <div className="flex items-start justify-between gap-2 mb-2">
        <Icon className={cn("w-4 h-4 sm:w-5 sm:h-5", styles.icon)} strokeWidth={2} />
        {change !== undefined && (
          <div
            className={cn(
              "flex items-center gap-0.5 text-xs font-medium",
              positive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
            )}
          >
            {positive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>{changePercent}%</span>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className={cn("text-base sm:text-lg font-bold", styles.text)}>
        ¥{value.toLocaleString()}
      </p>
    </div>
  );
}

/* ============================================
 * Custom Tooltip
 * ============================================ */

interface TooltipPayload {
  dataKey: string;
  value: number;
  color: string;
  payload: ChartDataPoint;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
  visibleLines: Record<DataKey, boolean>;
  viewMode: ViewMode;
}

function CustomTooltip({ active, payload, visibleLines, viewMode }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const data = payload[0]?.payload;
  if (!data) return null;

  const periodLabel: Record<ViewMode, string> = {
    daily: "当日",
    monthly: "当月",
    yearly: "当年",
  };

  return (
    <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-4 min-w-[200px]">
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-200 dark:border-slate-700">
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-teal-500 to-amber-400" />
        <p className="text-sm font-bold text-slate-900 dark:text-white">
          {data.fullLabel}
        </p>
      </div>

      <div className="space-y-3">
        {visibleLines.income && (
          <TooltipRow
            color="#10b981"
            label="収入"
            value={data.income}
            icon={<ArrowUpRight className="w-3.5 h-3.5" />}
          />
        )}
        {visibleLines.expense && (
          <TooltipRow
            color="#f43f5e"
            label="支出"
            value={data.expense}
            icon={<ArrowDownRight className="w-3.5 h-3.5" />}
          />
        )}
        {visibleLines.income && visibleLines.expense && (
          <div className="pt-2 border-t border-dashed border-slate-200 dark:border-slate-700">
            <TooltipRow
              color={data.balance >= 0 ? "#10b981" : "#f43f5e"}
              label={`${periodLabel[viewMode]}収支`}
              value={data.balance}
              icon={<Receipt className="w-3.5 h-3.5" />}
              highlight
            />
          </div>
        )}
        {visibleLines.cumulative && (
          <TooltipRow
            color="#6366f1"
            label="累計残高"
            value={data.cumulative}
            icon={<Wallet className="w-3.5 h-3.5" />}
          />
        )}
      </div>
    </div>
  );
}

interface TooltipRowProps {
  color: string;
  label: string;
  value: number;
  icon: React.ReactNode;
  highlight?: boolean;
}

function TooltipRow({ color, label, value, icon, highlight }: TooltipRowProps) {
  return (
    <div className={cn(
      "flex items-center justify-between gap-4",
      highlight && "font-semibold"
    )}>
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-full shadow-sm"
          style={{ backgroundColor: color }}
        />
        <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
          {icon}
          {label}
        </span>
      </div>
      <span
        className={cn(
          "text-sm font-bold tabular-nums",
          value >= 0
            ? "text-slate-900 dark:text-white"
            : "text-rose-600 dark:text-rose-400"
        )}
      >
        {value < 0 && "-"}¥{Math.abs(value).toLocaleString()}
      </span>
    </div>
  );
}
