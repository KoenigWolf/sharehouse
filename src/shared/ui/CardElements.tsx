"use client";

import { cn } from "@/src/lib/utils";
import { designTokens, type Tone } from "./designTokens";

interface TagListProps {
  tags: string[];
  limit?: number;
}

export function TagList({ tags, limit = 3 }: TagListProps) {
  if (!tags?.length) return null;
  const visible = tags.slice(0, limit);
  const rest = tags.length - visible.length;
  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((tag) => (
        <span
          key={tag}
          className={cn(
            "text-xs px-2.5 py-1 rounded-full font-medium",
            "bg-slate-100 dark:bg-slate-700/80",
            "text-slate-700 dark:text-slate-100",
            "border border-slate-200/50 dark:border-slate-600/50"
          )}
        >
          #{tag}
        </span>
      ))}
      {rest > 0 && (
        <span className="text-xs px-2.5 py-1 text-slate-600 dark:text-slate-200">
          +{rest}
        </span>
      )}
    </div>
  );
}

interface CardFooterMetaProps {
  label: string;
  tone?: Tone;
  cta?: string;
  ctaIcon?: React.ReactNode;
}

export function CardFooterMeta({ label, tone = "primary", cta, ctaIcon }: CardFooterMetaProps) {
  return (
    <div className="flex items-center justify-between pt-2 border-t border-slate-100/70 dark:border-slate-800/70">
      <div className="flex items-center gap-2 text-xs font-semibold text-subtle">
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px] shadow-emerald-500/15" />
        {label}
      </div>
      {cta && (
        <span className={cn("text-xs font-semibold flex items-center gap-1", designTokens.text(tone))}>
          {cta}
          {ctaIcon}
        </span>
      )}
    </div>
  );
}

interface EmptyStateProps {
  message: string;
  tone?: Tone;
}

export function EmptyState({ message, tone = "neutral" }: EmptyStateProps) {
  const toneClasses =
    tone === "primary"
      ? "border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-950/15"
      : "border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 sm:py-16 rounded-2xl border-2 border-dashed text-subtle",
        toneClasses
      )}
    >
      <p className="text-sm text-muted text-center max-w-lg">{message}</p>
    </div>
  );
}
