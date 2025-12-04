"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageContainer } from "@/src/shared/layouts";
import {
  AccountingSummary,
  TransactionList,
  useAccounting,
} from "@/src/features/accounting";
import { usePermission } from "@/src/features/residents";
import { useLanguage } from "@/src/shared/lang/context";
import { cn } from "@/src/lib/utils";
import type { AccountingEntry, MonthlyStatement } from "@/src/features/accounting";

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

  const data = localStatements ?? statements;
  const month = selectedMonth ?? data[0]?.month ?? null;
  const current = data.find((s) => s.month === month) ?? null;

  // Show access denied if not an accounting admin
  if (!permissionLoading && !isAccountingAdmin) {
    return (
      <PageContainer>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30">
              <LockIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                {t.pages.accountingAdmin.accessDenied}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                {t.pages.accountingAdmin.accessDeniedDescription}
              </p>
            </div>
            <Link
              href="/accounting"
              className={cn(
                "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl",
                "bg-rose-500 text-white font-semibold shadow-md",
                "hover:bg-rose-600 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
              )}
            >
              {t.pages.accountingAdmin.backToAccounting}
            </Link>
          </div>
        </div>
      </PageContainer>
    );
  }

  const monthOptions = useMemo(
    () => data.map((s) => ({ value: s.month, label: s.month })),
    [data]
  );

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const addEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!month) return;
    if (!form.description || form.amount <= 0) return;

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
  };

  return (
    <PageContainer>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-8 sm:space-y-10">
        <header className="space-y-2 sm:space-y-3">
          <p className="text-sm font-semibold text-rose-600 dark:text-rose-300 uppercase tracking-wide">
            {t.pages.accountingAdmin.eyebrow}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {t.pages.accountingAdmin.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
            {t.pages.accountingAdmin.description}
          </p>
        </header>

        {loading && (
          <div className="text-sm text-slate-500 dark:text-slate-400">{t.pages.accounting.loading}</div>
        )}
        {error && (
          <div className="text-sm text-red-500 dark:text-red-400">
            {t.common.errorPrefix}: {error.message}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-6 sm:space-y-8">
            <section className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/70 shadow-sm p-4 sm:p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {t.pages.accountingAdmin.selectMonthTitle}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t.pages.accountingAdmin.selectMonthDescription}
                  </p>
                </div>
                <select
                  value={month ?? ""}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {monthOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.value}
                    </option>
                  ))}
                </select>
              </div>

              <form onSubmit={addEntry} className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {t.pages.accountingAdmin.form.date}
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleInput}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {t.pages.accountingAdmin.form.amount}
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    min={0}
                    onChange={handleInput}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {t.pages.accountingAdmin.form.type}
                  </label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleInput}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="income">{t.pages.accountingAdmin.form.income}</option>
                    <option value="expense">{t.pages.accountingAdmin.form.expense}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {t.pages.accountingAdmin.form.method}
                  </label>
                  <select
                    name="method"
                    value={form.method}
                    onChange={handleInput}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="paypay">{t.pages.accountingAdmin.form.paypay}</option>
                    <option value="cash">{t.pages.accountingAdmin.form.cash}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {t.pages.accountingAdmin.form.category}
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleInput}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {t.pages.accountingAdmin.form.description}
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={form.description}
                    onChange={handleInput}
                    placeholder={t.pages.accountingAdmin.form.descriptionPlaceholder}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="sm:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-rose-500 text-white font-semibold shadow-md hover:bg-rose-600 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                  >
                    {t.pages.accountingAdmin.form.submit}
                  </button>
                </div>
              </form>
            </section>

            {current ? (
              <>
                <AccountingSummary statement={current} />
                <TransactionList entries={current.entries} />
              </>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t.pages.accountingAdmin.selectMonthPrompt}
              </p>
            )}
          </div>
        )}
      </div>
    </PageContainer>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );
}
