"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/src/lib/utils";
import { useHouseRule } from "../hooks";
import { useLanguage } from "@/src/shared/lang/context";
import { Spinner } from "@/src/shared/ui";
import { designTokens, type Tone } from "@/src/shared/ui/designTokens";
import {
  X,
  Home,
  Sparkles,
  Waves,
  ShieldCheck,
  Compass,
  Calendar,
  ExternalLink,
  BookOpen,
  type LucideIcon,
} from "lucide-react";
import type { HouseRule } from "../types";

const CATEGORY_STYLES: Record<
  HouseRule["category"],
  { tone: Tone; icon: LucideIcon; gradient: string }
> = {
  living: {
    tone: "primary",
    icon: Home,
    gradient: "from-emerald-500 to-teal-600",
  },
  cleaning: {
    tone: "accent",
    icon: Sparkles,
    gradient: "from-teal-500 to-cyan-600",
  },
  noise: {
    tone: "warm",
    icon: Waves,
    gradient: "from-amber-500 to-orange-600",
  },
  safety: {
    tone: "danger",
    icon: ShieldCheck,
    gradient: "from-rose-500 to-red-600",
  },
  other: {
    tone: "neutral",
    icon: Compass,
    gradient: "from-slate-500 to-slate-600",
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
          <strong key={`bold-${keyIndex++}`} className="font-semibold text-strong dark:text-white">
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
            "space-y-1.5 my-3",
            currentList.type === "ol" ? "list-decimal list-inside" : "list-none"
          )}
        >
          {currentList.items.map((item, i) => (
            <li
              key={i}
              className={cn(
                "text-sm text-muted dark:text-slate-300 leading-relaxed",
                currentList?.type === "ul" && "flex items-start gap-2"
              )}
            >
              {currentList?.type === "ul" && (
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
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
          className="my-3 border-l-3 border-amber-400 dark:border-amber-500 bg-amber-50/50 dark:bg-amber-900/20 rounded-r-lg px-3 py-2"
        >
          <div className="flex items-start gap-2">
            <span className="text-base">💡</span>
            <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
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
        <div key={elements.length} className="my-4 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                {currentTable.headers.map((header, i) => (
                  <th
                    key={i}
                    className="px-3 py-2 text-left font-semibold text-strong dark:text-white border-b border-slate-200 dark:border-slate-700"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentTable.rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b last:border-b-0 border-slate-100 dark:border-slate-800"
                >
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-3 py-2 text-muted dark:text-slate-300">
                      {parseInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
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
        <hr key={elements.length} className="my-5 border-t border-slate-200 dark:border-slate-700/60" />
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
          className="flex items-center gap-2 text-base font-bold text-strong dark:text-white mt-5 mb-2"
        >
          {!hasEmoji && (
            <span className="h-5 w-1 rounded-full bg-gradient-to-b from-emerald-500 to-teal-600" />
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
      <p key={elements.length} className="text-sm text-muted dark:text-slate-300 leading-relaxed my-2">
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

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    if (id) document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [id, onClose]);

  if (!id) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={ref}
        className={cn(
          "relative w-full sm:w-[480px] md:w-[520px] max-h-[90vh] overflow-auto",
          "bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl"
        )}
      >
        <div className="flex items-center justify-between px-4 sm:px-5 pt-4 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-9 h-9 rounded-xl text-white flex items-center justify-center shadow-md bg-gradient-to-br",
                style.gradient
              )}
            >
              <BookOpen className="w-4 h-4" />
            </div>
            <p className="text-sm font-semibold text-strong">{lang.pages.houseRules.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-muted hover:text-strong hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label={lang.common.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 sm:px-5 py-4 space-y-4">
          {loading && (
            <div className="flex items-center justify-center py-10">
              <Spinner size="md" />
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500 dark:text-red-400">
              {lang.common.errorPrefix}: {error.message}
            </p>
          )}

          {!loading && !error && rule && (
            <>
              <div className="flex flex-col items-center gap-3 text-center">
                <div
                  className={cn(
                    "h-16 w-16 rounded-2xl text-white flex items-center justify-center",
                    "bg-gradient-to-br shadow-lg",
                    style.gradient,
                    designTokens.shadow(style.tone)
                  )}
                >
                  <Icon className="h-8 w-8" strokeWidth={2} />
                </div>

                <div className="space-y-2">
                  <span
                    className={cn(
                      "inline-block text-xs font-semibold px-3 py-1 rounded-full",
                      style.tone === "primary" && "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
                      style.tone === "accent" && "bg-teal-50 text-teal-800 dark:bg-teal-900/40 dark:text-teal-100",
                      style.tone === "warm" && "bg-amber-50 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
                      style.tone === "danger" && "bg-rose-50 text-rose-800 dark:bg-rose-900/50 dark:text-rose-100",
                      style.tone === "neutral" && "bg-slate-100 text-muted dark:bg-slate-800/50 dark:text-muted"
                    )}
                  >
                    {labels[rule.category]}
                  </span>

                  <h2 className="text-xl font-bold text-strong dark:text-white leading-tight">
                    {rule.title}
                  </h2>

                  {rule.effectiveFrom && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-subtle">
                      <Calendar className="h-3.5 w-3.5" />
                      {lang.pages.houseRules.effectiveFrom}
                      {rule.effectiveFrom}
                    </span>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-3">
                <p className="text-sm text-muted dark:text-slate-300 leading-relaxed">
                  {rule.description}
                </p>
              </div>

              {rule.details && (
                <div className="space-y-1">
                  {parseMarkdown(rule.details)}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
