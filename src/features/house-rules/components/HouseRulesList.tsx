"use client";

import { memo, useCallback } from "react";
import {
  Home,
  Sparkles,
  Waves,
  ShieldCheck,
  Compass,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useLanguage } from "@/src/shared/lang/context";
import type { HouseRule } from "../types";

type CategoryStyle = {
  gradient: string;
  shadow: string;
  badge: string;
  accent: string;
  icon: LucideIcon;
};

const CATEGORY_STYLES: Record<HouseRule["category"], CategoryStyle> = {
  living: {
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    shadow: "shadow-emerald-500/30",
    badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-emerald-500/20",
    accent: "bg-emerald-500",
    icon: Home,
  },
  cleaning: {
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    shadow: "shadow-violet-500/30",
    badge: "bg-violet-500/10 text-violet-700 dark:text-violet-300 ring-violet-500/20",
    accent: "bg-violet-500",
    icon: Sparkles,
  },
  noise: {
    gradient: "from-amber-500 via-orange-500 to-red-500",
    shadow: "shadow-amber-500/30",
    badge: "bg-amber-500/10 text-amber-700 dark:text-amber-300 ring-amber-500/20",
    accent: "bg-amber-500",
    icon: Waves,
  },
  safety: {
    gradient: "from-rose-500 via-pink-500 to-red-500",
    shadow: "shadow-rose-500/30",
    badge: "bg-rose-500/10 text-rose-700 dark:text-rose-300 ring-rose-500/20",
    accent: "bg-rose-500",
    icon: ShieldCheck,
  },
  other: {
    gradient: "from-slate-500 via-slate-600 to-slate-700",
    shadow: "shadow-slate-500/30",
    badge: "bg-slate-500/10 text-slate-700 dark:text-slate-300 ring-slate-500/20",
    accent: "bg-slate-500",
    icon: Compass,
  },
};

interface HouseRulesListProps {
  rules: HouseRule[];
  onSelect?: (id: string) => void;
}

export function HouseRulesList({ rules, onSelect }: HouseRulesListProps) {
  const { lang } = useLanguage();

  const labels: Record<HouseRule["category"], string> = {
    living: lang.components.houseRules.categories.living,
    cleaning: lang.components.houseRules.categories.cleaning,
    noise: lang.components.houseRules.categories.noise,
    safety: lang.components.houseRules.categories.safety,
    other: lang.components.houseRules.categories.other,
  };

  return (
    <div className="space-y-3">
      {rules.map((rule) => (
        <RuleCard
          key={rule.id}
          rule={rule}
          style={CATEGORY_STYLES[rule.category]}
          label={labels[rule.category]}
          onSelect={onSelect}
          viewMoreText={lang.pages.houseRules.viewDetails}
        />
      ))}
    </div>
  );
}

interface RuleCardProps {
  rule: HouseRule;
  style: CategoryStyle;
  label: string;
  onSelect?: (id: string) => void;
  viewMoreText: string;
}

const RuleCard = memo(function RuleCard({
  rule,
  style,
  label,
  onSelect,
  viewMoreText,
}: RuleCardProps) {
  const Icon = style.icon;

  const handleClick = useCallback(() => {
    onSelect?.(rule.id);
  }, [onSelect, rule.id]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "group relative w-full text-left",
        "rounded-2xl overflow-hidden",
        "bg-white dark:bg-slate-900/80",
        "border border-slate-200/60 dark:border-slate-800/60",
        "shadow-lg shadow-slate-900/5 dark:shadow-slate-950/50",
        "transition-all duration-500 ease-out",
        "hover:shadow-2xl hover:shadow-slate-900/10 dark:hover:shadow-slate-950/70",
        "hover:-translate-y-1 hover:scale-[1.01]",
        "active:scale-[0.99] active:shadow-lg",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
      )}
    >
      {/* Gradient accent bar */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1 transition-all duration-500",
          "bg-linear-to-b",
          style.gradient,
          "group-hover:w-1.5"
        )}
      />

      {/* Hover glow effect */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-500",
          "bg-linear-to-br from-white/50 via-transparent to-transparent",
          "group-hover:opacity-100"
        )}
      />

      <div className="relative flex items-center gap-4 p-4 sm:p-5">
        {/* Icon container */}
        <div
          className={cn(
            "relative shrink-0",
            "h-12 w-12 sm:h-14 sm:w-14",
            "rounded-xl sm:rounded-2xl",
            "bg-linear-to-br",
            style.gradient,
            "shadow-lg",
            style.shadow,
            "flex items-center justify-center",
            "transition-all duration-500",
            "group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl"
          )}
        >
          <Icon
            className="h-6 w-6 sm:h-7 sm:w-7 text-white drop-shadow-sm"
            strokeWidth={2}
          />
          {/* Shine effect */}
          <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-linear-to-tr from-white/25 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1.5">
          {/* Category badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "inline-flex items-center gap-1.5",
                "text-[11px] sm:text-xs font-semibold",
                "px-2.5 py-0.5 rounded-full",
                "ring-1 ring-inset",
                style.badge
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", style.accent)} />
              {label}
            </span>
            {rule.effectiveFrom && (
              <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                {rule.effectiveFrom}〜
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white leading-snug line-clamp-1 pr-8">
            {rule.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
            {rule.description}
          </p>
        </div>

        {/* Arrow */}
        <div
          className={cn(
            "absolute right-4 top-1/2 -translate-y-1/2",
            "flex items-center justify-center",
            "h-8 w-8 rounded-full",
            "bg-slate-100 dark:bg-slate-800",
            "text-slate-400 dark:text-slate-500",
            "transition-all duration-500",
            "group-hover:bg-linear-to-br",
            "group-hover:" + style.gradient,
            "group-hover:text-white",
            "group-hover:shadow-lg",
            "group-hover:" + style.shadow,
            "group-hover:scale-110"
          )}
        >
          <ChevronRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
            strokeWidth={2.5}
          />
        </div>
      </div>

      {/* Bottom action hint */}
      <div
        className={cn(
          "relative flex items-center justify-end gap-1 px-4 sm:px-5 pb-3 pt-0",
          "text-[11px] sm:text-xs font-medium",
          "text-slate-400 dark:text-slate-500",
          "transition-colors duration-300",
          "group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
        )}
      >
        <span className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
          {viewMoreText}
        </span>
        <ChevronRight className="h-3.5 w-3.5 opacity-0 transition-all duration-300 group-hover:opacity-100" />
      </div>
    </button>
  );
});
