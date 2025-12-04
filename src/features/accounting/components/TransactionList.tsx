"use client";

import { useState, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/src/shared/lang/context";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  ListFilter,
  X,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Receipt,
} from "lucide-react";

interface TransactionListProps {
  entries: AccountingEntry[];
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

  const processedEntries = useMemo(() => {
    let result = [...entries];

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
    <Card className="border-0 shadow-xl overflow-hidden bg-white dark:bg-slate-800/80">
      <CardHeader className="border-b border-slate-100 dark:border-slate-700/50 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-800/50 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/25">
              <Receipt className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                取引明細
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {summary.count}件の取引
              </p>
            </div>
          </div>

          {/* サマリーバッジ */}
          <div className="flex items-center gap-3">
            <Badge className="gap-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-0">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +¥{summary.income.toLocaleString()}
            </Badge>
            <Badge className="gap-1.5 bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-0">
              <ArrowDownRight className="w-3.5 h-3.5" />
              -¥{summary.expense.toLocaleString()}
            </Badge>
          </div>
        </div>
      </CardHeader>

      {/* フィルターバー */}
      {interactive && (
        <div className="px-4 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex flex-wrap items-center gap-2">
            {/* 検索 */}
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" strokeWidth={2} />
              <Input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                placeholder={lang.components.accounting.transactions.search || "検索..."}
                className="pl-9 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* 種別フィルター */}
              <FilterButton
                active={filters.type === "income"}
                onClick={() => setFilters((prev) => ({ ...prev, type: prev.type === "income" ? "all" : "income" }))}
                colorClass="emerald"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                {lang.pages.accounting.income}
              </FilterButton>
              <FilterButton
                active={filters.type === "expense"}
                onClick={() => setFilters((prev) => ({ ...prev, type: prev.type === "expense" ? "all" : "expense" }))}
                colorClass="rose"
              >
                <ArrowDownRight className="w-3.5 h-3.5" />
                {lang.pages.accounting.expense}
              </FilterButton>

              <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />

              {/* 支払い方法フィルター */}
              <FilterButton
                active={filters.method === "paypay"}
                onClick={() => setFilters((prev) => ({ ...prev, method: prev.method === "paypay" ? "all" : "paypay" }))}
                colorClass="pink"
              >
                <Smartphone className="w-3.5 h-3.5" />
                PayPay
              </FilterButton>
              <FilterButton
                active={filters.method === "cash"}
                onClick={() => setFilters((prev) => ({ ...prev, method: prev.method === "cash" ? "all" : "cash" }))}
                colorClass="slate"
              >
                <Banknote className="w-3.5 h-3.5" />
                {lang.components.accounting.transactions.cash}
              </FilterButton>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="ml-1 text-xs h-8 gap-1 text-muted-foreground hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                  クリア
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ヘッダー（デスクトップ） */}
      <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/80 dark:bg-slate-800/50">
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
        <div className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center">
            <ListFilter className="w-8 h-8 text-slate-400" strokeWidth={1.5} />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
            該当する取引がありません
          </p>
          <Button variant="outline" size="sm" onClick={clearFilters} className="gap-1.5">
            <X className="w-3.5 h-3.5" />
            フィルターをクリア
          </Button>
        </div>
      )}

      {/* 詳細モーダル */}
      <TransactionDetailModal
        entry={selectedEntry}
        open={selectedEntry !== null}
        onOpenChange={(open) => !open && setSelectedEntry(null)}
        lang={lang}
      />
    </Card>
  );
}

/* ============================================
 * Filter Button
 * ============================================ */

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  colorClass: "emerald" | "rose" | "pink" | "slate";
  children: React.ReactNode;
}

function FilterButton({ active, onClick, colorClass, children }: FilterButtonProps) {
  const colors = {
    emerald: active
      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
      : "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20",
    rose: active
      ? "bg-rose-500 text-white shadow-lg shadow-rose-500/25"
      : "bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-900/20",
    pink: active
      ? "bg-pink-500 text-white shadow-lg shadow-pink-500/25"
      : "bg-white dark:bg-slate-800 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800 hover:bg-pink-50 dark:hover:bg-pink-900/20",
    slate: active
      ? "bg-slate-600 text-white shadow-lg shadow-slate-600/25"
      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium",
        "border transition-all duration-200",
        colors[colorClass]
      )}
    >
      {children}
    </button>
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

function SortableHeader({ field, currentField, direction, onClick, className, children }: SortableHeaderProps) {
  const isActive = currentField === field;

  return (
    <button
      onClick={() => onClick(field)}
      className={cn(
        "flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide",
        "transition-colors",
        isActive
          ? "text-amber-600 dark:text-amber-400"
          : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300",
        className
      )}
    >
      {children}
      <ChevronDown
        className={cn(
          "w-3.5 h-3.5 transition-transform",
          isActive ? "opacity-100" : "opacity-30",
          direction === "asc" && isActive && "rotate-180"
        )}
        strokeWidth={2.5}
      />
    </button>
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
        "group px-4 sm:px-6 py-4",
        "lg:grid lg:grid-cols-12 lg:items-center gap-4",
        "cursor-pointer",
        "transition-all duration-200",
        "hover:bg-gradient-to-r",
        isIncome
          ? "hover:from-emerald-50/50 hover:to-transparent dark:hover:from-emerald-900/10 dark:hover:to-transparent"
          : "hover:from-rose-50/50 hover:to-transparent dark:hover:from-rose-900/10 dark:hover:to-transparent",
        "animate-fade-in"
      )}
      style={{ animationDelay: `${index * 30}ms` }}
    >
      {/* 日付 */}
      <div className="flex items-center justify-between lg:block col-span-2 mb-2 lg:mb-0">
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex items-center justify-center w-11 h-11 rounded-xl",
            "transition-all duration-200 group-hover:scale-105",
            isIncome
              ? "bg-emerald-100 dark:bg-emerald-900/30"
              : "bg-rose-100 dark:bg-rose-900/30"
          )}>
            <span className={cn(
              "text-lg font-bold",
              isIncome
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            )}>
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
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
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
      className={cn(
        "gap-1.5 font-medium border-0",
        isPayPay
          ? "bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 dark:from-pink-900/40 dark:to-rose-900/40 dark:text-pink-300"
          : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
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
      className="gap-1.5 bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-300 border-0"
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
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 shadow-2xl">
        {/* Header */}
        <div className={cn(
          "relative px-6 py-8 overflow-hidden",
          "bg-gradient-to-br",
          isIncome
            ? "from-emerald-500 via-teal-500 to-cyan-500"
            : "from-rose-500 via-pink-500 to-purple-500"
        )}>
          {/* 装飾 */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white rounded-full" />
          </div>

          <DialogHeader className="relative">
            <div className="flex items-center gap-2 mb-2">
              {isIncome ? (
                <ArrowUpRight className="w-5 h-5 text-white/80" />
              ) : (
                <ArrowDownRight className="w-5 h-5 text-white/80" />
              )}
              <DialogTitle className="text-sm text-white/80 font-medium">
                {isIncome ? lang.pages.accountingAdmin.form.income : lang.pages.accountingAdmin.form.expense}
              </DialogTitle>
            </div>
            <p className="text-4xl font-bold text-white">
              {isIncome ? "+" : "-"}¥{entry.amount.toLocaleString()}
            </p>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
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
            <Button className="w-full bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white">
              {lang.components.accounting.transactions.close || "閉じる"}
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 shrink-0">
        {icon}
      </div>
      <div className="pt-1">
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}

/* ============================================
 * Empty State
 * ============================================ */

function EmptyState({ lang }: { lang: ReturnType<typeof useLanguage>["lang"] }) {
  return (
    <Card className="border-0 shadow-xl">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
            <ClipboardList className="w-10 h-10 text-slate-400 dark:text-slate-500" strokeWidth={1.5} />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
            <Sparkles className="w-4 h-4 text-white" strokeWidth={2} />
          </div>
        </div>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {lang.components.accounting.transactions.noRecords}
        </p>
      </CardContent>
    </Card>
  );
}
