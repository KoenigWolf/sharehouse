"use client";

import Link from "next/link";
import { PageContainer } from "@/src/shared/layouts";
import { AccountingSummary, TransactionList, useAccounting } from "@/src/features/accounting";
import { usePermission } from "@/src/features/residents";
import { useLanguage } from "@/src/shared/lang/context";
import { cn } from "@/src/lib/utils";

export default function AccountingPage() {
  const { statements, loading, error } = useAccounting();
  const { isAccountingAdmin } = usePermission();
  const { lang } = useLanguage();
  const latest = statements[0];

  return (
    <PageContainer>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-8 sm:space-y-10">
        <header className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm font-semibold text-rose-600 dark:text-rose-300 uppercase tracking-wide">
              {lang.pages.accounting.eyebrow}
            </p>
            {isAccountingAdmin && (
              <Link
                href="/accounting/manage"
                className={cn(
                  "inline-flex items-center gap-1.5",
                  "px-3 py-1.5 rounded-lg",
                  "text-xs sm:text-sm font-medium",
                  "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
                  "hover:bg-rose-200 dark:hover:bg-rose-900/60",
                  "transition-colors"
                )}
              >
                <SettingsIcon className="w-3.5 h-3.5" />
                {lang.nav.accountingAdmin}
              </Link>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {lang.pages.accounting.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
            {lang.pages.accounting.description}
          </p>
        </header>

        {loading && (
          <div className="text-sm text-slate-500 dark:text-slate-400">{lang.pages.accounting.loading}</div>
        )}
        {error && (
          <div className="text-sm text-red-500 dark:text-red-400">
            {lang.common.errorPrefix}: {error.message}
          </div>
        )}

        {!loading && !error && latest && (
          <div className="space-y-6 sm:space-y-8">
            <AccountingSummary statement={latest} />
            <TransactionList entries={latest.entries} />
          </div>
        )}

        {!loading && !error && statements.slice(1).length > 0 && (
          <div className="space-y-6 sm:space-y-8">
            {statements.slice(1).map((statement) => (
              <section key={statement.month} className="space-y-4">
                <AccountingSummary statement={statement} />
                <TransactionList entries={statement.entries} />
              </section>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}
