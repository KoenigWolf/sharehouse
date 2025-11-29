import Link from "next/link";
import { cn } from "@/src/lib/utils";
import { useLanguage } from "@/src/shared/lang/context";
import type { HouseRule } from "../types";

const CATEGORY_LABELS = (lang: ReturnType<typeof useLanguage>["lang"]): Record<HouseRule["category"], string> => ({
  living: lang.components.houseRules.categories.living,
  cleaning: lang.components.houseRules.categories.cleaning,
  noise: lang.components.houseRules.categories.noise,
  safety: lang.components.houseRules.categories.safety,
  other: lang.components.houseRules.categories.other,
});

const CATEGORY_COLORS: Record<HouseRule["category"], string> = {
  living: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200",
  cleaning: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
  noise: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
  safety: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200",
  other: "bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-200",
};

interface HouseRulesListProps {
  rules: HouseRule[];
}

export function HouseRulesList({ rules }: HouseRulesListProps) {
  const { lang } = useLanguage();
  const labels = CATEGORY_LABELS(lang);
  return (
    <div className="space-y-3 sm:space-y-4">
      {rules.map((rule) => (
        <Link key={rule.id} href={`/house-rules/${rule.id}`} className="block">
          <article
            className={cn(
              "rounded-2xl border border-slate-200 dark:border-slate-700/60",
              "bg-white dark:bg-slate-800/70 shadow-sm hover:shadow-lg transition-all duration-200",
              "hover:-translate-y-1"
            )}
          >
            <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5">
              <span
                className={cn(
                  "text-xs font-semibold px-3 py-1 rounded-full shrink-0",
                  CATEGORY_COLORS[rule.category]
                )}
              >
                {labels[rule.category]}
              </span>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                  {rule.title}
                </h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {rule.description}
                </p>
                {rule.effectiveFrom && (
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    適用開始: {rule.effectiveFrom}
                  </p>
                )}
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}
