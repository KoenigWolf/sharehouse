import { format } from "date-fns";
import { cn } from "@/src/lib/utils";
import { t } from "@/src/shared/lang";
import type { MonthlyStatement } from "../types";

interface AccountingSummaryProps {
  statement: MonthlyStatement;
}

export function AccountingSummary({ statement }: AccountingSummaryProps) {
  const monthLabel = format(new Date(`${statement.month}-01`), "yyyy/MM");
  const positive = statement.balance >= 0;

  return (
    <section className="space-y-3">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-rose-500 font-semibold">Monthly</p>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{monthLabel}</h2>
        </div>
        <div
          className={cn(
            "px-3 py-1 rounded-full text-xs font-semibold",
            positive
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200"
              : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200"
          )}
        >
          {positive ? t.components.accounting.status.surplus : t.components.accounting.status.deficit}
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <SummaryCard label={t.components.accounting.summary.income} amount={statement.totalIncome} tone="positive" />
        <SummaryCard label={t.components.accounting.summary.expense} amount={statement.totalExpense} tone="negative" />
        <SummaryCard label={t.components.accounting.summary.balance} amount={statement.balance} tone={positive ? "positive" : "negative"} />
      </div>
    </section>
  );
}

interface SummaryCardProps {
  label: string;
  amount: number;
  tone: "positive" | "negative";
}

function SummaryCard({ label, amount, tone }: SummaryCardProps) {
  const isPositive = tone === "positive";
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/70",
        "shadow-sm"
      )}
    >
      <div className="p-4 sm:p-5 flex flex-col gap-2">
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</span>
        <span
          className={cn(
            "text-2xl sm:text-3xl font-bold",
            isPositive ? "text-emerald-600 dark:text-emerald-300" : "text-rose-600 dark:text-rose-300"
          )}
        >
          ¥{amount.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
