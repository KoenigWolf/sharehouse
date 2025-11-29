"use client";

import { PageContainer } from "@/src/shared/layouts";
import { AccountingSummary, TransactionList, useAccounting } from "@/src/features/accounting";
import { useLanguage } from "@/src/shared/lang/context";

export default function AccountingPage() {
  const { statements, loading, error } = useAccounting();
  const { lang } = useLanguage();
  const latest = statements[0];

  return (
    <PageContainer>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-8 sm:space-y-10">
        <header className="space-y-2 sm:space-y-3">
          <p className="text-sm font-semibold text-rose-600 dark:text-rose-300 uppercase tracking-wide">
            {lang.pages.accounting.eyebrow}
          </p>
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
