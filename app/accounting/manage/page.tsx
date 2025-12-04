"use client";

import { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { PageContainer } from "@/src/shared/layouts";
import {
  AccountingSummary,
  TransactionList,
  useAccounting,
} from "@/src/features/accounting";
import { usePermission } from "@/src/features/residents";
import { useLanguage } from "@/src/shared/lang/context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { AccountingEntry, MonthlyStatement, EntryType, PaymentMethod } from "@/src/features/accounting";

const CATEGORIES = ["会費", "備品", "イベント", "光熱費", "修繕", "その他"];

const emptyEntry: Omit<AccountingEntry, "id"> = {
  date: new Date().toISOString().slice(0, 10),
  method: "paypay",
  type: "income",
  category: "会費",
  description: "",
  amount: 0,
};

export default function AccountingManagePage() {
  const { statements, loading, error } = useAccounting();
  const { lang: t } = useLanguage();
  const { isAccountingAdmin, loading: permissionLoading } = usePermission();
  const [localStatements, setLocalStatements] = useState<MonthlyStatement[] | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [form, setForm] = useState(emptyEntry);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const data = localStatements ?? statements;
  const month = selectedMonth ?? data[0]?.month ?? null;
  const current = data.find((s) => s.month === month) ?? null;

  // 権限チェック
  if (!permissionLoading && !isAccountingAdmin) {
    return <AccessDeniedPage t={t} />;
  }

  const monthOptions = useMemo(
    () => data.map((s) => ({ value: s.month, label: formatMonthLabel(s.month) })),
    [data]
  );

  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};
    if (!form.description.trim()) {
      errors.description = "内容を入力してください";
    }
    if (form.amount <= 0) {
      errors.amount = "金額は0より大きい値を入力してください";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [form]);

  const handleInput = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
    // エラーをクリア
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }, [formErrors]);

  const addEntry = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!month || !validateForm()) return;

    const newEntry: AccountingEntry = {
      ...form,
      id: `tx-${Date.now()}`,
    };

    const updated = data.map((s) => {
      if (s.month !== month) return s;
      const entries = [newEntry, ...s.entries];
      const totalIncome =
        s.totalIncome + (newEntry.type === "income" ? newEntry.amount : 0);
      const totalExpense =
        s.totalExpense + (newEntry.type === "expense" ? newEntry.amount : 0);
      return {
        ...s,
        entries,
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
      };
    });

    setLocalStatements(updated);
    setForm(emptyEntry);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  }, [data, form, month, validateForm]);

  const setEntryType = useCallback((type: EntryType) => {
    setForm((prev) => ({ ...prev, type }));
  }, []);

  const setPaymentMethod = useCallback((method: PaymentMethod) => {
    setForm((prev) => ({ ...prev, method }));
  }, []);

  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-6 sm:space-y-8">
        {/* ヘッダー */}
        <header className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/accounting"
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            >
              {t.nav.accounting}
            </Link>
            <ChevronRightIcon className="w-4 h-4 text-slate-400" />
            <span className="text-rose-600 dark:text-rose-400 font-medium">
              {t.nav.accountingAdmin}
            </span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                {t.pages.accountingAdmin.title}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mt-1">
                {t.pages.accountingAdmin.description}
              </p>
            </div>
          </div>
        </header>

        {loading && <LoadingState />}
        {error && <ErrorState error={error} t={t} />}

        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            {/* 左カラム：入力フォーム */}
            <div className="lg:col-span-2 space-y-6">
              {/* 月選択 */}
              <MonthSelector
                options={monthOptions}
                value={month}
                onChange={setSelectedMonth}
                t={t}
              />

              {/* 入力フォーム */}
              <EntryForm
                form={form}
                formErrors={formErrors}
                onInput={handleInput}
                onSubmit={addEntry}
                onTypeChange={setEntryType}
                onMethodChange={setPaymentMethod}
                showSuccess={showSuccess}
                t={t}
              />
            </div>

            {/* 右カラム：プレビュー */}
            <div className="lg:col-span-3 space-y-6">
              {current ? (
                <>
                  <AccountingSummary statement={current} />
                  <TransactionList entries={current.entries} interactive={false} />
                </>
              ) : (
                <EmptyState t={t} />
              )}
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}

/* ============================================
 * Month Selector
 * ============================================ */

interface MonthSelectorProps {
  options: { value: string; label: string }[];
  value: string | null;
  onChange: (value: string) => void;
  t: ReturnType<typeof useLanguage>["lang"];
}

function MonthSelector({ options, value, onChange, t }: MonthSelectorProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-base">
              {t.pages.accountingAdmin.selectMonthTitle}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {t.pages.accountingAdmin.selectMonthDescription}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => (
            <Badge
              key={opt.value}
              variant={value === opt.value ? "default" : "outline"}
              className={cn(
                "cursor-pointer px-4 py-2 text-sm transition-all",
                value === opt.value
                  ? "bg-rose-500 hover:bg-rose-600 text-white"
                  : "hover:border-rose-500 hover:text-rose-600"
              )}
              onClick={() => onChange(opt.value)}
            >
              {opt.label}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/* ============================================
 * Entry Form
 * ============================================ */

interface EntryFormProps {
  form: Omit<AccountingEntry, "id">;
  formErrors: Record<string, string>;
  onInput: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onTypeChange: (type: EntryType) => void;
  onMethodChange: (method: PaymentMethod) => void;
  showSuccess: boolean;
  t: ReturnType<typeof useLanguage>["lang"];
}

function EntryForm({
  form,
  formErrors,
  onInput,
  onSubmit,
  onTypeChange,
  onMethodChange,
  showSuccess,
  t,
}: EntryFormProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
            <PlusIcon className="w-5 h-5" />
          </div>
          <CardTitle className="text-base">新規登録</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5">
          {/* 種別選択（トグル） */}
          <div className="space-y-2">
            <Label>{t.pages.accountingAdmin.form.type}</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={form.type === "income" ? "default" : "outline"}
                className={cn(
                  "flex-1",
                  form.type === "income" && "bg-emerald-500 hover:bg-emerald-600"
                )}
                onClick={() => onTypeChange("income")}
              >
                <ArrowUpIcon className="w-4 h-4 mr-2" />
                {t.pages.accountingAdmin.form.income}
              </Button>
              <Button
                type="button"
                variant={form.type === "expense" ? "default" : "outline"}
                className={cn(
                  "flex-1",
                  form.type === "expense" && "bg-rose-500 hover:bg-rose-600"
                )}
                onClick={() => onTypeChange("expense")}
              >
                <ArrowDownIcon className="w-4 h-4 mr-2" />
                {t.pages.accountingAdmin.form.expense}
              </Button>
            </div>
          </div>

          {/* 日付 */}
          <div className="space-y-2">
            <Label htmlFor="date">{t.pages.accountingAdmin.form.date}</Label>
            <Input
              type="date"
              id="date"
              name="date"
              value={form.date}
              onChange={onInput}
              className={formErrors.date ? "border-destructive" : ""}
              required
            />
            {formErrors.date && (
              <p className="text-xs text-destructive">{formErrors.date}</p>
            )}
          </div>

          {/* 金額 */}
          <div className="space-y-2">
            <Label htmlFor="amount">{t.pages.accountingAdmin.form.amount}</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                ¥
              </span>
              <Input
                type="number"
                id="amount"
                name="amount"
                value={form.amount || ""}
                min={0}
                onChange={onInput}
                placeholder="0"
                className={cn("pl-8", formErrors.amount && "border-destructive")}
                required
              />
            </div>
            {formErrors.amount && (
              <p className="text-xs text-destructive">{formErrors.amount}</p>
            )}
          </div>

          {/* 支払い方法 */}
          <div className="space-y-2">
            <Label>{t.pages.accountingAdmin.form.method}</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={form.method === "paypay" ? "default" : "outline"}
                className={cn(
                  "flex-1",
                  form.method === "paypay" && "bg-pink-500 hover:bg-pink-600"
                )}
                onClick={() => onMethodChange("paypay")}
              >
                <PayPayIcon className="w-4 h-4 mr-2" />
                {t.pages.accountingAdmin.form.paypay}
              </Button>
              <Button
                type="button"
                variant={form.method === "cash" ? "default" : "outline"}
                className="flex-1"
                onClick={() => onMethodChange("cash")}
              >
                <CashIcon className="w-4 h-4 mr-2" />
                {t.pages.accountingAdmin.form.cash}
              </Button>
            </div>
          </div>

          {/* カテゴリ */}
          <div className="space-y-2">
            <Label>{t.pages.accountingAdmin.form.category}</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <Badge
                  key={cat}
                  variant={form.category === cat ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-all",
                    form.category === cat
                      ? "bg-indigo-500 hover:bg-indigo-600 text-white"
                      : "hover:border-indigo-500 hover:text-indigo-600"
                  )}
                  onClick={() => onInput({ target: { name: "category", value: cat } } as React.ChangeEvent<HTMLInputElement>)}
                >
                  {cat}
                </Badge>
              ))}
            </div>
          </div>

          {/* 内容 */}
          <div className="space-y-2">
            <Label htmlFor="description">{t.pages.accountingAdmin.form.description}</Label>
            <Input
              type="text"
              id="description"
              name="description"
              value={form.description}
              onChange={onInput}
              placeholder={t.pages.accountingAdmin.form.descriptionPlaceholder}
              className={formErrors.description ? "border-destructive" : ""}
              required
            />
            {formErrors.description && (
              <p className="text-xs text-destructive">{formErrors.description}</p>
            )}
          </div>

          {/* 送信ボタン */}
          <Button
            type="submit"
            className={cn(
              "w-full",
              form.type === "income"
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                : "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
            )}
          >
            {form.type === "income" ? "収入" : "支出"}を追加
          </Button>

          {/* 成功メッセージ */}
          {showSuccess && (
            <div className={cn(
              "flex items-center gap-2 p-3 rounded-xl",
              "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
              "animate-fade-in"
            )}>
              <CheckIcon className="w-5 h-5" />
              <span className="text-sm font-medium">登録しました</span>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

/* ============================================
 * Helper Components
 * ============================================ */

function formatMonthLabel(month: string): string {
  const [year, m] = month.split("-");
  return `${year}年${parseInt(m)}月`;
}

function AccessDeniedPage({ t }: { t: ReturnType<typeof useLanguage>["lang"] }) {
  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30">
            <LockIcon className="w-10 h-10 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {t.pages.accountingAdmin.accessDenied}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
              {t.pages.accountingAdmin.accessDeniedDescription}
            </p>
          </div>
          <Button asChild className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">
            <Link href="/accounting">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              {t.pages.accountingAdmin.backToAccounting}
            </Link>
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}

function LoadingState() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="h-32 rounded-2xl skeleton" />
        <div className="h-96 rounded-2xl skeleton" />
      </div>
      <div className="lg:col-span-3 space-y-6">
        <div className="h-48 rounded-2xl skeleton" />
        <div className="h-64 rounded-2xl skeleton" />
      </div>
    </div>
  );
}

function ErrorState({ error, t }: { error: Error; t: ReturnType<typeof useLanguage>["lang"] }) {
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
        {t.common.errorPrefix}: {error.message}
      </p>
    </div>
  );
}

function EmptyState({ t }: { t: ReturnType<typeof useLanguage>["lang"] }) {
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
        {t.pages.accountingAdmin.selectMonthPrompt}
      </p>
    </div>
  );
}

/* ============================================
 * Icons
 * ============================================ */

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function ArrowUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
    </svg>
  );
}

function ArrowDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
    </svg>
  );
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
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
