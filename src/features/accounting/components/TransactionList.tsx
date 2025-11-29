import { format } from "date-fns";
import { cn } from "@/src/lib/utils";
import type { AccountingEntry } from "../types";

interface TransactionListProps {
  entries: AccountingEntry[];
}

export function TransactionList({ entries }: TransactionListProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">この月の記録はありません。</p>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/70 shadow-sm">
      <div className="hidden sm:grid grid-cols-12 px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700/60">
        <span className="col-span-2">日付</span>
        <span className="col-span-2">方法</span>
        <span className="col-span-3">内容</span>
        <span className="col-span-3">カテゴリ</span>
        <span className="col-span-2 text-right">金額</span>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
        {entries.map((entry) => (
          <TransactionRow key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}

function TransactionRow({ entry }: { entry: AccountingEntry }) {
  const dateLabel = format(new Date(entry.date), "MM/dd");
  const isIncome = entry.type === "income";

  return (
    <div className="px-4 py-3 sm:grid sm:grid-cols-12 sm:items-center gap-3">
      <div className="flex items-center justify-between sm:block col-span-2">
        <span className="text-sm font-semibold text-slate-900 dark:text-white">{dateLabel}</span>
        <MethodBadge method={entry.method} />
      </div>

      <div className="mt-2 sm:mt-0 col-span-3">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{entry.description}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{entry.category}</p>
      </div>

      <div className="mt-2 sm:mt-0 col-span-3">
        <span className="hidden sm:inline-flex text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
          {entry.category}
        </span>
      </div>

      <div className="mt-2 sm:mt-0 col-span-2 sm:text-right">
        <span
          className={cn(
            "text-base sm:text-lg font-bold",
            isIncome ? "text-emerald-600 dark:text-emerald-300" : "text-rose-600 dark:text-rose-300"
          )}
        >
          {isIncome ? "+" : "-"}¥{entry.amount.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

function MethodBadge({ method }: { method: AccountingEntry["method"] }) {
  const label = method === "paypay" ? "PayPay" : "現金";
  const styles =
    method === "paypay"
      ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200"
      : "bg-slate-100 text-slate-700 dark:bg-slate-700 text-slate-200";
  return (
    <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", styles)}>
      {label}
    </span>
  );
}
