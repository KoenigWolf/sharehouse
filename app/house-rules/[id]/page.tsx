"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PageContainer } from "@/src/shared/layouts";
import { useHouseRule } from "@/src/features/house-rules/hooks";
import { t } from "@/src/shared/lang";

export default function HouseRuleDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;
  const { rule, loading, error } = useHouseRule(id);

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-6">
        <div className="flex items-center gap-3 text-sm text-indigo-600 dark:text-indigo-300 font-semibold">
          <Link href="/house-rules" className="hover:underline">
            {t.pages.houseRules.title}
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-600 dark:text-slate-300">
            {rule?.title || id}
          </span>
        </div>

        {loading && (
          <p className="text-sm text-slate-500 dark:text-slate-400">{t.pages.houseRules.loading}</p>
        )}

        {error && (
          <p className="text-sm text-red-500 dark:text-red-400">
            {t.common.errorPrefix} rule: {error.message}
          </p>
        )}

        {!loading && !error && rule && (
          <article className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/70 shadow-sm p-5 sm:p-6 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                {rule.category}
              </span>
              {rule.effectiveFrom && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  適用開始: {rule.effectiveFrom}
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {rule.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              {rule.description}
            </p>
            {rule.details && (
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                {rule.details}
              </p>
            )}
          </article>
        )}

        {!loading && !error && !rule && (
          <p className="text-sm text-slate-500 dark:text-slate-400">{t.common.notFound}</p>
        )}
      </div>
    </PageContainer>
  );
}
