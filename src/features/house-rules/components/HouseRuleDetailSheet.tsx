"use client";

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/src/lib/utils";
import { useHouseRule } from "../hooks";
import { useLanguage } from "@/src/shared/lang/context";
import { Spinner } from "@/src/shared/ui";
import {
  X,
  Home,
  Sparkles,
  Waves,
  ShieldCheck,
  Compass,
  Calendar,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import type { HouseRule } from "../types";

type CategoryStyle = {
  gradient: string;
  shadow: string;
  badge: string;
  icon: LucideIcon;
};

const CATEGORY_STYLES: Record<HouseRule["category"], CategoryStyle> = {
  living: {
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    shadow: "shadow-emerald-500/30",
    badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-emerald-500/20",
    icon: Home,
  },
  cleaning: {
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    shadow: "shadow-violet-500/30",
    badge: "bg-violet-500/10 text-violet-700 dark:text-violet-300 ring-violet-500/20",
    icon: Sparkles,
  },
  noise: {
    gradient: "from-amber-500 via-orange-500 to-red-500",
    shadow: "shadow-amber-500/30",
    badge: "bg-amber-500/10 text-amber-700 dark:text-amber-300 ring-amber-500/20",
    icon: Waves,
  },
  safety: {
    gradient: "from-rose-500 via-pink-500 to-red-500",
    shadow: "shadow-rose-500/30",
    badge: "bg-rose-500/10 text-rose-700 dark:text-rose-300 ring-rose-500/20",
    icon: ShieldCheck,
  },
  other: {
    gradient: "from-slate-500 via-slate-600 to-slate-700",
    shadow: "shadow-slate-500/30",
    badge: "bg-slate-500/10 text-slate-700 dark:text-slate-300 ring-slate-500/20",
    icon: Compass,
  },
};

function parseMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: { type: "ol" | "ul"; items: React.ReactNode[] } | null = null;
  let currentTable: { headers: string[]; rows: string[][] } | null = null;
  let inBlockquote = false;
  let blockquoteContent: string[] = [];

  const parseInline = (line: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let remaining = line;
    let keyIndex = 0;

    while (remaining.length > 0) {
      const linkMatch = remaining.match(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/);
      const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);

      if (linkMatch && (!boldMatch || linkMatch.index! <= boldMatch.index!)) {
        if (linkMatch.index! > 0) {
          parts.push(remaining.slice(0, linkMatch.index));
        }
        parts.push(
          <a
            key={`link-${keyIndex++}`}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline underline-offset-2 font-medium transition-colors"
          >
            {linkMatch[1]}
            <ExternalLink className="h-3 w-3" />
          </a>
        );
        remaining = remaining.slice(linkMatch.index! + linkMatch[0].length);
      } else if (boldMatch) {
        if (boldMatch.index! > 0) {
          parts.push(remaining.slice(0, boldMatch.index));
        }
        parts.push(
          <strong key={`bold-${keyIndex++}`} className="font-semibold text-slate-900 dark:text-white">
            {boldMatch[1]}
          </strong>
        );
        remaining = remaining.slice(boldMatch.index! + boldMatch[0].length);
      } else {
        parts.push(remaining);
        break;
      }
    }

    return parts.length === 1 ? parts[0] : <>{parts}</>;
  };

  const flushList = () => {
    if (currentList) {
      const ListTag = currentList.type === "ol" ? "ol" : "ul";
      elements.push(
        <ListTag
          key={elements.length}
          className={cn(
            "space-y-2 my-4",
            currentList.type === "ol" ? "list-decimal list-inside" : "list-none"
          )}
        >
          {currentList.items.map((item, i) => (
            <li
              key={i}
              className={cn(
                "text-sm text-slate-600 dark:text-slate-300 leading-relaxed",
                currentList?.type === "ul" && "flex items-start gap-3"
              )}
            >
              {currentList?.type === "ul" && (
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-linear-to-br from-emerald-500 to-teal-500 shrink-0" />
              )}
              <span>{item}</span>
            </li>
          ))}
        </ListTag>
      );
      currentList = null;
    }
  };

  const flushBlockquote = () => {
    if (inBlockquote && blockquoteContent.length > 0) {
      elements.push(
        <blockquote
          key={elements.length}
          className={cn(
            "my-4 rounded-xl overflow-hidden",
            "bg-linear-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30",
            "border-l-4 border-amber-500"
          )}
        >
          <div className="flex items-start gap-3 p-4">
            <span className="text-xl">💡</span>
            <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
              {parseInline(blockquoteContent.join(" "))}
            </p>
          </div>
        </blockquote>
      );
      inBlockquote = false;
      blockquoteContent = [];
    }
  };

  const flushTable = () => {
    if (currentTable && currentTable.rows.length > 0) {
      elements.push(
        <div key={elements.length} className="my-4 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500">
                  {currentTable.headers.map((header, i) => (
                    <th
                      key={i}
                      className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {currentTable.rows.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={cn(
                      "transition-colors",
                      rowIndex % 2 === 0
                        ? "bg-white dark:bg-slate-900/50"
                        : "bg-slate-50/50 dark:bg-slate-800/30"
                    )}
                  >
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="px-4 py-3 text-slate-700 dark:text-slate-300 whitespace-nowrap"
                      >
                        {parseInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
      currentTable = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      flushList();
      flushBlockquote();
      const cells = trimmed.slice(1, -1).split("|").map((c) => c.trim());
      if (!currentTable) {
        currentTable = { headers: cells, rows: [] };
      } else if (cells.every((c) => /^[-:]+$/.test(c))) {
        continue;
      } else {
        currentTable.rows.push(cells);
      }
      continue;
    } else {
      flushTable();
    }

    if (trimmed.startsWith("> ")) {
      flushList();
      inBlockquote = true;
      blockquoteContent.push(trimmed.slice(2));
      continue;
    } else {
      flushBlockquote();
    }

    if (trimmed === "---") {
      flushList();
      elements.push(
        <hr key={elements.length} className="my-6 border-t border-slate-200 dark:border-slate-700" />
      );
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushList();
      const headingText = trimmed.slice(3);
      const hasEmoji = /^[\p{Emoji}]/u.test(headingText);
      elements.push(
        <h3
          key={elements.length}
          className="flex items-center gap-2.5 text-base font-bold text-slate-900 dark:text-white mt-6 mb-3"
        >
          {!hasEmoji && (
            <span className="h-5 w-1.5 rounded-full bg-linear-to-b from-emerald-500 to-teal-500" />
          )}
          {headingText}
        </h3>
      );
      continue;
    }

    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (numberedMatch) {
      if (!currentList || currentList.type !== "ol") {
        flushList();
        currentList = { type: "ol", items: [] };
      }
      currentList.items.push(parseInline(numberedMatch[2]));
      continue;
    }

    if (trimmed.startsWith("- ")) {
      if (!currentList || currentList.type !== "ul") {
        flushList();
        currentList = { type: "ul", items: [] };
      }
      currentList.items.push(parseInline(trimmed.slice(2)));
      continue;
    }

    flushList();

    if (trimmed === "") continue;

    elements.push(
      <p key={elements.length} className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed my-3">
        {parseInline(trimmed)}
      </p>
    );
  }

  flushList();
  flushBlockquote();
  flushTable();

  return elements;
}

interface HouseRuleDetailSheetProps {
  id: string | null;
  onClose: () => void;
}

export function HouseRuleDetailSheet({ id, onClose }: HouseRuleDetailSheetProps) {
  const { rule, loading, error } = useHouseRule(id ?? undefined);
  const { lang } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);

  const style = rule ? CATEGORY_STYLES[rule.category] : CATEGORY_STYLES.other;
  const Icon = style.icon;

  const labels: Record<HouseRule["category"], string> = {
    living: lang.components.houseRules.categories.living,
    cleaning: lang.components.houseRules.categories.cleaning,
    noise: lang.components.houseRules.categories.noise,
    safety: lang.components.houseRules.categories.safety,
    other: lang.components.houseRules.categories.other,
  };

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKey);
    if (id) document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [id, handleClose]);

  if (!id) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0",
          "bg-slate-900/60 backdrop-blur-sm",
          "transition-opacity duration-300"
        )}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        ref={ref}
        className={cn(
          "relative w-full sm:w-[520px] md:w-[560px]",
          "max-h-[92vh] sm:max-h-[85vh]",
          "bg-white dark:bg-slate-900",
          "rounded-t-3xl sm:rounded-3xl",
          "shadow-2xl shadow-slate-900/20",
          "overflow-hidden",
          "animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95",
          "duration-300"
        )}
      >
        {/* Mobile drag handle */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
        </div>

        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "h-10 w-10 rounded-xl",
                  "bg-linear-to-br",
                  style.gradient,
                  "shadow-lg",
                  style.shadow,
                  "flex items-center justify-center"
                )}
              >
                <Icon className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {lang.pages.houseRules.title}
                </p>
                {rule && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5",
                      "text-[11px] font-semibold",
                      "px-2 py-0.5 rounded-full",
                      "ring-1 ring-inset",
                      style.badge
                    )}
                  >
                    {labels[rule.category]}
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className={cn(
                "p-2 rounded-xl",
                "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300",
                "hover:bg-slate-100 dark:hover:bg-slate-800",
                "transition-colors duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              )}
              aria-label={lang.common.close}
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(92vh-80px)] sm:max-h-[calc(85vh-80px)]">
          <div className="px-5 py-6 space-y-6">
            {loading && (
              <div className="flex items-center justify-center py-16">
                <Spinner size="lg" />
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-4">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {lang.common.errorPrefix}: {error.message}
                </p>
              </div>
            )}

            {!loading && !error && rule && (
              <>
                {/* Hero section */}
                <div className="text-center space-y-4">
                  <div
                    className={cn(
                      "inline-flex h-20 w-20 rounded-2xl",
                      "bg-linear-to-br",
                      style.gradient,
                      "shadow-xl",
                      style.shadow,
                      "items-center justify-center"
                    )}
                  >
                    <Icon className="h-10 w-10 text-white drop-shadow-sm" strokeWidth={1.75} />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                      {rule.title}
                    </h2>

                    {rule.effectiveFrom && (
                      <div className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <Calendar className="h-4 w-4" />
                        <span>{lang.pages.houseRules.effectiveFrom}{rule.effectiveFrom}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description card */}
                <div
                  className={cn(
                    "rounded-2xl overflow-hidden",
                    "bg-linear-to-br from-slate-50 to-slate-100/50",
                    "dark:from-slate-800/50 dark:to-slate-800/30",
                    "border border-slate-200/80 dark:border-slate-700/50"
                  )}
                >
                  <div className="p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {rule.description}
                    </p>
                  </div>
                </div>

                {/* Details */}
                {rule.details && (
                  <div className="space-y-2">
                    {parseMarkdown(rule.details)}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Safe area */}
        <div className="h-safe-area-inset-bottom sm:hidden" />
      </div>
    </div>
  );
}
