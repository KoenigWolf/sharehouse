"use client";

import { PageContainer } from "@/src/shared/layouts";
import { HouseRulesList, useHouseRules } from "@/src/features/house-rules";

export default function HouseRulesPage() {
  const { rules, loading, error } = useHouseRules();

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <header className="mb-6 sm:mb-8">
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-300 uppercase tracking-wide">
            House Rules
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            ハウスルール
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
            共有スペースの使い方や静音時間など、全員で守る基本ルールをまとめています。
          </p>
        </header>

        {loading && (
          <div className="text-sm text-slate-500 dark:text-slate-400">Loading rules...</div>
        )}
        {error && (
          <div className="text-sm text-red-500 dark:text-red-400">Failed to load rules: {error.message}</div>
        )}
        {!loading && !error && <HouseRulesList rules={rules} />}
      </div>
    </PageContainer>
  );
}
