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
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
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
    <svg
      className={cn(
        "w-3.5 h-3.5 transition-transform",
        active ? "opacity-100" : "opacity-30",
        direction === "asc" && active && "rotate-180"
      )}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
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
        <PayPayIcon className="w-3.5 h-3.5" />
      ) : (
        <CashIcon className="w-3.5 h-3.5" />
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
  if (category.includes("会費")) return <FeeIcon className="w-3 h-3" />;
  if (category.includes("備品")) return <SuppliesIcon className="w-3 h-3" />;
  if (category.includes("イベント")) return <EventIcon className="w-3 h-3" />;
  return <TagIcon className="w-3 h-3" />;
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
            icon={<CalendarIcon2 className="w-5 h-5" />}
            label={lang.components.accounting.transactions.date}
            value={dateLabel}
          />
          <DetailRow
            icon={entry.method === "paypay" ? <PayPayIcon className="w-5 h-5" /> : <CashIcon className="w-5 h-5" />}
            label={lang.components.accounting.transactions.method}
            value={entry.method === "paypay" ? lang.components.accounting.transactions.paypay : lang.components.accounting.transactions.cash}
          />
          <DetailRow
            icon={<TagIcon className="w-5 h-5" />}
            label={lang.components.accounting.transactions.category}
            value={entry.category}
          />
          <DetailRow
            icon={<DescriptionIcon className="w-5 h-5" />}
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
        <EmptyIcon className="w-8 h-8 text-slate-400 dark:text-slate-500" />
      </div>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
        {lang.components.accounting.transactions.noRecords}
      </p>
    </div>
  );
}

/* ============================================
 * Icons
 * ============================================ */

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function PayPayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6zm4 4h-2v-2h2v2zm0-4h-2V7h2v6z" />
    </svg>
  );
}

function CashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function FeeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function SuppliesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}

function EventIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function TagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function CalendarIcon2({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function DescriptionIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
