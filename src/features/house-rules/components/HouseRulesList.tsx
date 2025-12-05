"use client";

import { Home, Sparkles, Waves, ShieldCheck, Compass, ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useLanguage } from "@/src/shared/lang/context";
import { designTokens, type Tone } from "@/src/shared/ui";
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
  { tone: Tone; badge: string; icon: LucideIcon }
> = {
  living: {
    tone: "primary",
    badge: "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
    icon: Home,
  },
  cleaning: {
    tone: "accent",
    badge: "bg-teal-50 text-teal-800 dark:bg-teal-900/40 dark:text-teal-100",
    icon: Sparkles,
  },
  noise: {
    tone: "warm",
    badge: "bg-amber-50 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
    icon: Waves,
  },
  safety: {
    tone: "danger",
    badge: "bg-rose-50 text-rose-800 dark:bg-rose-900/50 dark:text-rose-100",
    icon: ShieldCheck,
  },
  other: {
    tone: "neutral",
    badge: "bg-slate-100 text-muted dark:bg-slate-800/50 dark:text-muted",
    icon: Compass,
  },
};

interface HouseRulesListProps {
  rules: HouseRule[];
  onSelect?: (id: string) => void;
}

export function HouseRulesList({ rules, onSelect }: HouseRulesListProps) {
  const { lang } = useLanguage();
  const labels = CATEGORY_LABELS(lang);

  return (
    <div className="space-y-4 sm:space-y-5">
      {rules.map((rule) => {
        const style = CATEGORY_STYLES[rule.category];
        const Icon = style.icon;

        return (
          <button
            key={rule.id}
            type="button"
            onClick={() => onSelect?.(rule.id)}
            className="block w-full text-left group"
          >
            <div
              className={cn(
                "relative overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-800/70",
                "bg-white/92 dark:bg-slate-950/75 backdrop-blur-xl",
                "transition-all duration-300 shadow-[0_18px_60px_-40px] shadow-emerald-500/20",
                "hover:-translate-y-[6px] hover:shadow-2xl hover:shadow-emerald-500/25 hover:border-emerald-200 dark:hover:border-emerald-700/60"
              )}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 12% 18%, rgba(16,185,129,0.10), transparent 35%), radial-gradient(circle at 88% 16%, rgba(251,191,36,0.12), transparent 28%), linear-gradient(120deg, rgba(15,118,110,0.04), rgba(251,191,36,0.05))",
                }}
              />
              <div
                className={cn(
                  "absolute inset-y-0 left-0 w-1.5 rounded-r-full",
                  designTokens.gradient(style.tone),
                  "group-hover:w-2 transition-all duration-300"
                )}
                aria-hidden="true"
              />
              <div className="flex items-start gap-4 sm:gap-5 p-5 sm:p-6">
                <div
                  className={cn(
                    "mt-1 h-12 w-12 sm:h-14 sm:w-14 rounded-xl text-white flex items-center justify-center",
                    designTokens.gradient(style.tone),
                    "shadow-lg",
                    designTokens.shadow(style.tone)
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
                        "border-transparent shadow-[0_4px_10px_-6px] shadow-emerald-500/25"
                      )}
                    >
                      {labels[rule.category]}
                    </span>
                    {rule.effectiveFrom && (
                      <span className="text-xs text-subtle">
                        {lang.pages.houseRules.effectiveFrom}
                        {rule.effectiveFrom}
                      </span>
                    )}
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg sm:text-xl font-semibold text-strong dark:text-white leading-tight">
                      {rule.title}
                    </h3>
                    <ArrowRight className="h-4 w-4 text-subtle group-hover:text-emerald-600 mt-1 shrink-0 transition-colors" />
                  </div>

                  <p className="text-sm text-muted dark:text-subtle leading-relaxed">
                    {rule.description}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100/70 dark:bg-slate-800/60 px-2.5 py-1 text-xs font-semibold text-muted dark:text-muted">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {lang.pages.houseRules.sidebarTitle}
                    </span>
                    <span className={cn("text-xs font-semibold text-subtle flex items-center gap-1 group-hover:gap-2 transition-all", designTokens.text(style.tone))}>
                      {lang.pages.common?.viewMore ?? "詳細を見る"}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
