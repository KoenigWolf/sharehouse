"use client";

import { useMemo, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { AccountingEntry, MonthlyStatement, EntryType, PaymentMethod } from "@/src/features/accounting";
import {
  Calendar,
  Plus,
  ArrowUp,
  ArrowDown,
  Check,
  Banknote,
  Smartphone,
  ChevronRight,
  ClipboardList,
} from "lucide-react";
import { useLanguage } from "@/src/shared/lang/context";

const getEmptyEntry = (defaultCategory: string): Omit<AccountingEntry, "id"> => ({
  date: new Date().toISOString().slice(0, 10),
  method: "paypay",
  type: "income",
  category: defaultCategory,
  description: "",
  amount: 0,
});

export function ManageForm({
  statements,
  isAdmin,
}: {
  statements: MonthlyStatement[];
  isAdmin: boolean;
}) {
  const { lang: t } = useLanguage();
  const [localStatements, setLocalStatements] = useState<MonthlyStatement[] | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const categories = t.pages.accountingAdmin.categories;
  const [form, setForm] = useState(() => getEmptyEntry(categories[0]));
  const [showSuccess, setShowSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const data = localStatements ?? statements;
  const month = selectedMonth ?? data[0]?.month ?? null;
  const current = data.find((s) => s.month === month) ?? null;

  const monthOptions = useMemo(
    () =>
      data.map((s) => ({
        value: s.month,
        label: `${s.month.replace("-", "/")}`,
      })),
    [data]
  );

  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};
    if (!form.description.trim()) {
      errors.description = t.pages.accountingAdmin.form.descriptionRequired;
    }
    if (form.amount <= 0) {
      errors.amount = t.pages.accountingAdmin.form.amountRequired;
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [form, t.pages.accountingAdmin.form]);

  const handleInput = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
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
    setForm(getEmptyEntry(categories[0]));
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  }, [data, form, month, validateForm, categories]);

  const setEntryType = useCallback((type: EntryType) => {
    setForm((prev) => ({ ...prev, type }));
  }, []);

  const setPaymentMethod = useCallback((method: PaymentMethod) => {
    setForm((prev) => ({ ...prev, method }));
  }, []);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-muted">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
          <ChevronRight className="w-3 h-3" />
          {t.pages.accountingAdmin.title}
        </span>
        <span className="text-muted">{t.pages.accountingAdmin.description}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <MonthSelector
            options={monthOptions}
            value={month}
            onChange={setSelectedMonth}
            t={t}
          />
          <EntryForm
            form={form}
            formErrors={formErrors}
            onInput={handleInput}
            onSubmit={addEntry}
            onTypeChange={setEntryType}
            onMethodChange={setPaymentMethod}
            showSuccess={showSuccess}
            t={t}
            categories={categories}
          />
        </div>
        <div className="lg:col-span-3 space-y-6">
          {current ? (
            <Card className="border border-slate-200 dark:border-slate-800 bg-white/85 dark:bg-slate-900/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-strong dark:text-white">{monthOptions.find((m) => m.value === current.month)?.label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                  {t.pages.accountingAdmin.preview}
                </Badge>
                <p className="text-sm text-muted">
                  {t.pages.accountingAdmin.previewNote}
                </p>
              </CardContent>
            </Card>
          ) : (
            <EmptyState t={t} />
          )}
        </div>
      </div>
    </div>
  );
}

function MonthSelector({
  options,
  value,
  onChange,
  t,
}: {
  options: { value: string; label: string }[];
  value: string | null;
  onChange: (value: string) => void;
  t: ReturnType<typeof useLanguage>["lang"];
}) {
  return (
    <Card className="border border-slate-200 dark:border-slate-800 bg-white/85 dark:bg-slate-900/70 backdrop-blur-sm">
      <CardHeader className="flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-600" />
          <CardTitle className="text-strong dark:text-white text-base sm:text-lg">
            {t.pages.accountingAdmin.selectMonth}
          </CardTitle>
        </div>
        {value && (
          <Badge className="bg-slate-900 text-white dark:bg-white dark:text-strong">
            {options.find((o) => o.value === value)?.label}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2 sm:gap-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex flex-col items-start gap-1 rounded-xl border p-3 sm:p-4 text-left transition-all duration-200",
              value === opt.value
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-strong dark:text-white shadow-md shadow-emerald-500/20"
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-200 dark:hover:border-emerald-700"
            )}
          >
            <span className="text-sm font-semibold">{opt.label}</span>
            <span className="text-xs text-muted">{opt.value}</span>
          </button>
        ))}
      </CardContent>
    </Card>
  );
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
  categories,
}: {
  form: Omit<AccountingEntry, "id">;
  formErrors: Record<string, string>;
  onInput: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onTypeChange: (type: EntryType) => void;
  onMethodChange: (method: PaymentMethod) => void;
  showSuccess: boolean;
  t: ReturnType<typeof useLanguage>["lang"];
  categories: string[];
}) {
  return (
    <Card className="border border-slate-200 dark:border-slate-800 bg-white/85 dark:bg-slate-900/70 backdrop-blur-sm">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <Plus className="w-5 h-5 text-emerald-600" />
          <CardTitle className="text-strong dark:text-white text-base sm:text-lg">
            {t.pages.accountingAdmin.newEntry}
          </CardTitle>
        </div>
        <p className="text-xs text-muted">
          {t.pages.accountingAdmin.form.descriptionRequired}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="type" className="text-xs text-muted">{t.pages.accountingAdmin.form.type}</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={form.type === "income" ? "default" : "outline"}
                className={cn(
                  "flex-1",
                  form.type === "income" && "bg-emerald-600 text-white hover:bg-emerald-700"
                )}
                onClick={() => onTypeChange("income")}
              >
                <ArrowUp className="w-4 h-4" />
                {t.pages.accountingAdmin.form.income}
              </Button>
              <Button
                type="button"
                variant={form.type === "expense" ? "default" : "outline"}
                className={cn(
                  "flex-1",
                  form.type === "expense" && "bg-rose-500 text-white hover:bg-rose-600"
                )}
                onClick={() => onTypeChange("expense")}
              >
                <ArrowDown className="w-4 h-4" />
                {t.pages.accountingAdmin.form.expense}
              </Button>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="date" className="text-xs text-muted">{t.pages.accountingAdmin.form.date}</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={onInput}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs text-muted">{t.pages.accountingAdmin.form.description}</Label>
            <Input
              id="description"
              name="description"
              placeholder={t.pages.accountingAdmin.form.descriptionPlaceholder}
              value={form.description}
              onChange={onInput}
            />
            {formErrors.description && (
              <p className="text-xs text-rose-500">{formErrors.description}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="category" className="text-xs text-muted">{t.pages.accountingAdmin.form.category}</Label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={onInput}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="amount" className="text-xs text-muted">{t.pages.accountingAdmin.form.amount}</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              inputMode="decimal"
              value={form.amount}
              onChange={onInput}
            />
            {formErrors.amount && (
              <p className="text-xs text-rose-500">{formErrors.amount}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted">{t.pages.accountingAdmin.form.method}</Label>
            <div className="flex gap-2">
              <MethodButton
                active={form.method === "bank"}
                icon={<Banknote className="w-4 h-4" />}
                label={t.pages.accountingAdmin.form.bank}
                onClick={() => onMethodChange("bank")}
              />
              <MethodButton
                active={form.method === "paypay"}
                icon={<Smartphone className="w-4 h-4" />}
                label="PayPay"
                onClick={() => onMethodChange("paypay")}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {showSuccess && (
            <div className="inline-flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-300">
              <Check className="w-4 h-4" />
              {t.pages.accountingAdmin.saved}
            </div>
          )}
          <Button type="submit" onClick={onSubmit} className="ml-auto bg-emerald-600 hover:bg-emerald-700 text-white">
            {t.pages.accountingAdmin.save}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function MethodButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 inline-flex items-center gap-2 justify-center rounded-lg border px-3 py-2 text-sm font-semibold transition-colors",
        active
          ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200"
          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-200 dark:hover:border-emerald-700"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function EmptyState({ t }: { t: ReturnType<typeof useLanguage>["lang"] }) {
  return (
    <Card className="border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white/85 dark:bg-slate-900/60">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6">
        <div className="w-16 h-16 mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <ClipboardList className="w-8 h-8 text-muted" />
        </div>
        <p className="text-sm text-muted text-center max-w-md">
          {t.pages.accountingAdmin.noData}
        </p>
      </CardContent>
    </Card>
  );
}
