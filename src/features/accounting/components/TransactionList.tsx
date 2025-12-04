"use client";

import { useState, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/src/shared/lang/context";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import type { AccountingEntry, EntryType, PaymentMethod } from "../types";
import {
  Search,
  Smartphone,
  Banknote,
  CircleDollarSign,
  Package,
  CalendarDays,
  Tag,
  FileText,
  ChevronDown,
  ClipboardList,
  Calendar,
} from "lucide-react";

interface TransactionListProps {
  entries: AccountingEntry[];
  /** ソート・フィルター機能の有効化 */
  interactive?: boolean;
}

type SortField = "date" | "amount";
type SortDirection = "asc" | "desc";

interface FilterState {
  type: EntryType | "all";
  method: PaymentMethod | "all";
  search: string;
}

export function TransactionList({ entries, interactive = true }: TransactionListProps) {
  const { lang } = useLanguage();
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [filters, setFilters] = useState<FilterState>({
    type: "all",
    method: "all",
    search: "",
  });
  const [selectedEntry, setSelectedEntry] = useState<AccountingEntry | null>(null);

  // ソート＆フィルター
  const processedEntries = useMemo(() => {
    let result = [...entries];

    // フィルタリング
    if (filters.type !== "all") {
      result = result.filter((e) => e.type === filters.type);
    }
    if (filters.method !== "all") {
      result = result.filter((e) => e.method === filters.method);
    }
    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        (e) =>
          e.description.toLowerCase().includes(query) ||
          e.category.toLowerCase().includes(query)
      );
    }

    // ソート
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === "date") {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortField === "amount") {
        comparison = a.amount - b.amount;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [entries, filters, sortField, sortDirection]);

  // 集計
  const summary = useMemo(() => {
    const income = processedEntries
      .filter((e) => e.type === "income")
      .reduce((sum, e) => sum + e.amount, 0);
    const expense = processedEntries
      .filter((e) => e.type === "expense")
      .reduce((sum, e) => sum + e.amount, 0);
    return { income, expense, count: processedEntries.length };
  }, [processedEntries]);

  const toggleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  }, [sortField]);

  const clearFilters = useCallback(() => {
    setFilters({ type: "all", method: "all", search: "" });
  }, []);

  const hasActiveFilters =
    filters.type !== "all" || filters.method !== "all" || filters.search !== "";

  if (entries.length === 0) {
    return <EmptyState lang={lang} />;
  }

  return (
    <div className="space-y-4">
      {/* フィルターバー */}
      {interactive && (
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          hasActiveFilters={hasActiveFilters}
          clearFilters={clearFilters}
          summary={summary}
          lang={lang}
        />
      )}

      {/* トランザクションリスト */}
      <div className={cn(
        "overflow-hidden rounded-2xl",
        "border border-slate-200/80 dark:border-slate-700/60",
        "bg-white dark:bg-slate-800/80",
        "shadow-sm"
      )}>
        {/* ヘッダー（デスクトップ） */}
        <div className="hidden lg:grid grid-cols-12 gap-4 px-5 py-3.5 border-b border-slate-100 dark:border-slate-700/60 bg-slate-50/80 dark:bg-slate-800/50">
          <SortableHeader
            field="date"
            currentField={sortField}
            direction={sortDirection}
            onClick={toggleSort}
            className="col-span-2"
          >
            {lang.components.accounting.transactions.date}
          </SortableHeader>
          <span className="col-span-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            {lang.components.accounting.transactions.method}
          </span>
          <span className="col-span-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            {lang.components.accounting.transactions.description}
          </span>
          <span className="col-span-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            {lang.components.accounting.transactions.category}
          </span>
          <SortableHeader
            field="amount"
            currentField={sortField}
            direction={sortDirection}
            onClick={toggleSort}
            className="col-span-2 justify-end"
          >
            {lang.components.accounting.transactions.amount}
          </SortableHeader>
        </div>

        {/* エントリー */}
        <div className="divide-y divide-slate-100 dark:divide-slate-700/40">
          {processedEntries.map((entry, index) => (
            <TransactionRow
              key={entry.id}
              entry={entry}
              index={index}
              onClick={() => setSelectedEntry(entry)}
              lang={lang}
            />
          ))}
        </div>

        {processedEntries.length === 0 && hasActiveFilters && (
          <div className="p-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              該当する取引がありません
            </p>
            <button
              onClick={clearFilters}
              className="mt-2 text-sm text-rose-600 hover:text-rose-700 dark:text-rose-400"
            >
              フィルターをクリア
            </button>
          </div>
        )}
      </div>

      {/* 詳細モーダル */}
      <TransactionDetailModal
        entry={selectedEntry}
        open={selectedEntry !== null}
        onOpenChange={(open) => !open && setSelectedEntry(null)}
        lang={lang}
      />
    </div>
  );
}

/* ============================================
 * Filter Bar
 * ============================================ */

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  hasActiveFilters: boolean;
  clearFilters: () => void;
  summary: { income: number; expense: number; count: number };
  lang: ReturnType<typeof useLanguage>["lang"];
}

function FilterBar({
  filters,
  setFilters,
  hasActiveFilters,
  clearFilters,
  summary,
  lang,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {/* 検索 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" strokeWidth={2} />
          <Input
            type="text"
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            placeholder={lang.components.accounting.transactions.search || "検索..."}
            className="pl-9 w-40 sm:w-48"
          />
        </div>

        {/* 種別フィルター */}
        <Badge
          variant={filters.type === "income" ? "default" : "outline"}
          className={cn(
            "cursor-pointer transition-all",
            filters.type === "income"
              ? "bg-emerald-500 hover:bg-emerald-600 text-white"
              : "hover:border-emerald-500 hover:text-emerald-600"
          )}
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              type: prev.type === "income" ? "all" : "income",
            }))
          }
        >
          {lang.pages.accounting.income}
        </Badge>
        <Badge
          variant={filters.type === "expense" ? "default" : "outline"}
          className={cn(
            "cursor-pointer transition-all",
            filters.type === "expense"
              ? "bg-rose-500 hover:bg-rose-600 text-white"
              : "hover:border-rose-500 hover:text-rose-600"
          )}
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              type: prev.type === "expense" ? "all" : "expense",
            }))
          }
        >
          {lang.pages.accounting.expense}
        </Badge>

        {/* 支払い方法フィルター */}
        <div className="h-5 w-px bg-border mx-1 hidden sm:block" />
        <Badge
          variant={filters.method === "paypay" ? "default" : "outline"}
          className={cn(
            "cursor-pointer transition-all",
            filters.method === "paypay"
              ? "bg-pink-500 hover:bg-pink-600 text-white"
              : "hover:border-pink-500 hover:text-pink-600"
          )}
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              method: prev.method === "paypay" ? "all" : "paypay",
            }))
          }
        >
          PayPay
        </Badge>
        <Badge
          variant={filters.method === "cash" ? "default" : "outline"}
          className={cn(
            "cursor-pointer transition-all",
            filters.method === "cash"
              ? "bg-slate-600 hover:bg-slate-700 text-white"
              : "hover:border-slate-500"
          )}
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              method: prev.method === "cash" ? "all" : "cash",
            }))
          }
        >
          {lang.components.accounting.transactions.cash}
        </Badge>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="ml-1 text-xs h-auto py-1"
          >
            {lang.components.accounting.transactions.clearFilter || "クリア"}
          </Button>
        )}
      </div>

      {/* 集計 */}
      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
        <span>{summary.count}件</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
          +¥{summary.income.toLocaleString()}
        </span>
        <span className="text-rose-600 dark:text-rose-400 font-medium">
          -¥{summary.expense.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

/* ============================================
 * Sortable Header
 * ============================================ */

interface SortableHeaderProps {
  field: SortField;
  currentField: SortField;
  direction: SortDirection;
  onClick: (field: SortField) => void;
  className?: string;
  children: React.ReactNode;
}

function SortableHeader({
  field,
  currentField,
  direction,
  onClick,
  className,
  children,
}: SortableHeaderProps) {
  const isActive = currentField === field;

  return (
    <button
      onClick={() => onClick(field)}
      className={cn(
        "flex items-center gap-1 text-xs font-semibold uppercase tracking-wide",
        "transition-colors",
        isActive
          ? "text-rose-600 dark:text-rose-400"
          : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300",
        className
      )}
    >
      {children}
      <SortIcon active={isActive} direction={direction} />
    </button>
  );
}

function SortIcon({ active, direction }: { active: boolean; direction: SortDirection }) {
  return (
    <ChevronDown
      className={cn(
        "w-3.5 h-3.5 transition-transform",
        active ? "opacity-100" : "opacity-30",
        direction === "asc" && active && "rotate-180"
      )}
      strokeWidth={2.5}
    />
  );
}

/* ============================================
 * Transaction Row
 * ============================================ */

interface TransactionRowProps {
  entry: AccountingEntry;
  index: number;
  onClick: () => void;
  lang: ReturnType<typeof useLanguage>["lang"];
}

function TransactionRow({ entry, index, onClick, lang }: TransactionRowProps) {
  const dateLabel = format(new Date(entry.date), "MM/dd");
  const dayLabel = format(new Date(entry.date), "E");
  const isIncome = entry.type === "income";

  return (
    <div
      onClick={onClick}
      className={cn(
        "group px-4 sm:px-5 py-4",
        "lg:grid lg:grid-cols-12 lg:items-center gap-4",
        "cursor-pointer",
        "transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-700/30",
        "animate-fade-in"
      )}
      style={{ animationDelay: `${index * 30}ms` }}
    >
      {/* 日付 */}
      <div className="flex items-center justify-between lg:block col-span-2 mb-2 lg:mb-0">
        <div className="flex items-center gap-2">
          <div className={cn(
            "flex items-center justify-center w-10 h-10 rounded-xl",
            "bg-slate-100 dark:bg-slate-700/50",
            "group-hover:scale-105 transition-transform"
          )}>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
              {dateLabel.split("/")[1]}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {dateLabel}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{dayLabel}</p>
          </div>
        </div>
        <MethodBadge method={entry.method} className="lg:hidden" lang={lang} />
      </div>

      {/* 支払い方法（デスクトップ） */}
      <div className="hidden lg:block col-span-2">
        <MethodBadge method={entry.method} lang={lang} />
      </div>

      {/* 説明 */}
      <div className="col-span-4 mb-2 lg:mb-0">
        <p className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">
          {entry.description}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 lg:hidden">
          {entry.category}
        </p>
      </div>

      {/* カテゴリ（デスクトップ） */}
      <div className="hidden lg:block col-span-2">
        <CategoryBadge category={entry.category} />
      </div>

      {/* 金額 */}
      <div className="col-span-2 flex items-center justify-between lg:justify-end">
        <div className="lg:hidden flex items-center gap-2">
          <CategoryBadge category={entry.category} />
        </div>
        <div className="text-right">
          <span
            className={cn(
              "text-lg sm:text-xl font-bold tracking-tight",
              isIncome
                ? "text-emerald-600 dark:text-emerald-300"
                : "text-rose-600 dark:text-rose-300"
            )}
          >
            {isIncome ? "+" : "-"}¥{entry.amount.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ============================================
 * Badges
 * ============================================ */

interface MethodBadgeProps {
  method: PaymentMethod;
  className?: string;
  lang: ReturnType<typeof useLanguage>["lang"];
}

function MethodBadge({ method, className, lang }: MethodBadgeProps) {
  const isPayPay = method === "paypay";

  return (
    <Badge
      variant="secondary"
      className={cn(
        "gap-1.5",
        isPayPay
          ? "bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 dark:from-rose-900/40 dark:to-pink-900/40 dark:text-rose-200"
          : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
        className
      )}
    >
      {isPayPay ? (
        <Smartphone className="w-3.5 h-3.5" strokeWidth={2} />
      ) : (
        <Banknote className="w-3.5 h-3.5" strokeWidth={2} />
      )}
      {isPayPay ? lang.components.accounting.transactions.paypay : lang.components.accounting.transactions.cash}
    </Badge>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const icon = getCategoryIcon(category);

  return (
    <Badge
      variant="secondary"
      className="gap-1.5 bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-300"
    >
      {icon}
      {category}
    </Badge>
  );
}

function getCategoryIcon(category: string): React.ReactNode {
  if (category.includes("会費")) return <CircleDollarSign className="w-3 h-3" strokeWidth={2} />;
  if (category.includes("備品")) return <Package className="w-3 h-3" strokeWidth={2} />;
  if (category.includes("イベント")) return <CalendarDays className="w-3 h-3" strokeWidth={2} />;
  return <Tag className="w-3 h-3" strokeWidth={2} />;
}

/* ============================================
 * Detail Modal
 * ============================================ */

interface TransactionDetailModalProps {
  entry: AccountingEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lang: ReturnType<typeof useLanguage>["lang"];
}

function TransactionDetailModal({ entry, open, onOpenChange, lang }: TransactionDetailModalProps) {
  if (!entry) return null;

  const isIncome = entry.type === "income";
  const dateLabel = format(new Date(entry.date), "yyyy年MM月dd日 (E)");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        {/* Header */}
        <div className={cn(
          "px-6 py-5",
          "bg-gradient-to-br",
          isIncome
            ? "from-emerald-500 to-teal-500"
            : "from-rose-500 to-pink-500"
        )}>
          <DialogHeader>
            <DialogTitle className="text-sm text-white/80 font-medium mb-1">
              {isIncome ? lang.pages.accountingAdmin.form.income : lang.pages.accountingAdmin.form.expense}
            </DialogTitle>
          </DialogHeader>
          <p className="text-3xl font-bold text-white">
            {isIncome ? "+" : "-"}¥{entry.amount.toLocaleString()}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <DetailRow
            icon={<Calendar className="w-5 h-5" strokeWidth={2} />}
            label={lang.components.accounting.transactions.date}
            value={dateLabel}
          />
          <DetailRow
            icon={entry.method === "paypay" ? <Smartphone className="w-5 h-5" strokeWidth={2} /> : <Banknote className="w-5 h-5" strokeWidth={2} />}
            label={lang.components.accounting.transactions.method}
            value={entry.method === "paypay" ? lang.components.accounting.transactions.paypay : lang.components.accounting.transactions.cash}
          />
          <DetailRow
            icon={<Tag className="w-5 h-5" strokeWidth={2} />}
            label={lang.components.accounting.transactions.category}
            value={entry.category}
          />
          <DetailRow
            icon={<FileText className="w-5 h-5" strokeWidth={2} />}
            label={lang.components.accounting.transactions.description}
            value={entry.description}
          />
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <DialogClose asChild>
            <Button variant="secondary" className="w-full">
              {lang.components.accounting.transactions.close || "閉じる"}
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}

/* ============================================
 * Empty State
 * ============================================ */

function EmptyState({ lang }: { lang: ReturnType<typeof useLanguage>["lang"] }) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-16 px-6",
      "rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700",
      "bg-slate-50/50 dark:bg-slate-800/30"
    )}>
      <div className="w-16 h-16 mb-4 rounded-2xl bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center">
        <ClipboardList className="w-8 h-8 text-slate-400 dark:text-slate-500" strokeWidth={1.5} />
      </div>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
        {lang.components.accounting.transactions.noRecords}
      </p>
    </div>
  );
}

