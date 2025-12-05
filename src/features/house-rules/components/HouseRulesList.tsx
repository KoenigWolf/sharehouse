import Link from "next/link";
import { Home, Sparkles, Waves, ShieldCheck, Compass, ArrowRight, type LucideIcon } from "lucide-react";
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

const CATEGORY_STYLES: Record<
  HouseRule["category"],
  { gradient: string; badge: string; icon: LucideIcon }
> = {
  living: {
    gradient: "from-emerald-600 to-teal-500",
    badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-100",
    icon: Home,
  },
  cleaning: {
    gradient: "from-teal-500 to-cyan-400",
    badge: "bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-100",
    icon: Sparkles,
  },
  noise: {
    gradient: "from-amber-500 to-orange-500",
    badge: "bg-amber-50 text-amber-700 dark:bg-amber-900/50 dark:text-amber-100",
    icon: Waves,
  },
  safety: {
    gradient: "from-rose-500 to-red-500",
    badge: "bg-rose-50 text-rose-700 dark:bg-rose-900/50 dark:text-rose-100",
    icon: ShieldCheck,
  },
  other: {
    gradient: "from-slate-500 to-slate-700",
  badge: "bg-slate-100 text-muted dark:bg-slate-800/50 dark:text-muted",
    icon: Compass,
  },
};

interface HouseRulesListProps {
  rules: HouseRule[];
}

export function HouseRulesList({ rules }: HouseRulesListProps) {
  const { lang } = useLanguage();
  const labels = CATEGORY_LABELS(lang);

  return (
    <div className="space-y-4 sm:space-y-5">
      {rules.map((rule) => {
        const style = CATEGORY_STYLES[rule.category];
        const Icon = style.icon;

        return (
          <Link key={rule.id} href={`/house-rules/${rule.id}`} className="block group">
            <div
              className={cn(
                "relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/70",
                "bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm",
                "transition-all duration-300",
                "hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-200 dark:hover:border-emerald-700/60"
              )}
            >
              <div
                className={cn(
                  "absolute inset-y-0 left-0 w-1.5 bg-linear-to-b",
                  style.gradient,
                  "group-hover:w-2 transition-all duration-300"
                )}
                aria-hidden="true"
              />
              <div className="flex items-start gap-4 sm:gap-5 p-5 sm:p-6">
                <div
                  className={cn(
                    "mt-1 h-12 w-12 sm:h-14 sm:w-14 rounded-xl text-white flex items-center justify-center",
                    "bg-linear-to-br shadow-lg",
                    style.gradient,
                    "shadow-emerald-500/20"
                  )}
                >
                  <Icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.2} />
                </div>

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "text-xs font-semibold px-3 py-1 rounded-full border",
                        style.badge,
                        "border-transparent"
                      )}
                    >
                      {labels[rule.category]}
                    </span>
                    {rule.effectiveFrom && (
                      <span className="text-xs text-subtle dark:text-subtle">
                        {lang.pages.houseRules.effectiveFrom}
                        {rule.effectiveFrom}
                      </span>
                    )}
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg sm:text-xl font-semibold text-strong dark:text-white leading-tight">
                      {rule.title}
                    </h3>
                    <ArrowRight className="h-4 w-4 text-subtle group-hover:text-emerald-600 mt-1 shrink-0" />
                  </div>

                  <p className="text-sm text-muted dark:text-subtle leading-relaxed">
                    {rule.description}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
