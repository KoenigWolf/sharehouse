"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Home,
  Sparkles,
  Waves,
  ShieldCheck,
  Compass,
  Calendar,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";
import { PageContainer } from "@/src/shared/layouts";
import { useHouseRule } from "@/src/features/house-rules";
import { useLanguage } from "@/src/shared/lang/context";
import { cn } from "@/src/lib/utils";
import { designTokens, type Tone } from "@/src/shared/ui";
import type { HouseRule } from "@/src/features/house-rules";

const CATEGORY_LABELS = (
  lang: ReturnType<typeof useLanguage>["lang"]
): Record<HouseRule["category"], string> => ({
  living: lang.components.houseRules.categories.living,
  cleaning: lang.components.houseRules.categories.cleaning,
  noise: lang.components.houseRules.categories.noise,
  safety: lang.components.houseRules.categories.safety,
  other: lang.components.houseRules.categories.other,
});

const CATEGORY_STYLES: Record<
  HouseRule["category"],
  { tone: Tone; badge: string; icon: LucideIcon; gradient: string }
> = {
  living: {
    tone: "primary",
    badge:
      "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
    icon: Home,
    gradient: "from-emerald-500 to-teal-600",
  },
  cleaning: {
    tone: "accent",
    badge: "bg-teal-50 text-teal-800 dark:bg-teal-900/40 dark:text-teal-100",
    icon: Sparkles,
    gradient: "from-teal-500 to-cyan-600",
  },
  noise: {
    tone: "warm",
    badge:
      "bg-amber-50 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
    icon: Waves,
    gradient: "from-amber-500 to-orange-600",
  },
  safety: {
    tone: "danger",
    badge: "bg-rose-50 text-rose-800 dark:bg-rose-900/50 dark:text-rose-100",
    icon: ShieldCheck,
    gradient: "from-rose-500 to-red-600",
  },
  other: {
    tone: "neutral",
    badge: "bg-slate-100 text-muted dark:bg-slate-800/50 dark:text-muted",
    icon: Compass,
    gradient: "from-slate-500 to-slate-600",
  },
};

function parseMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: { type: "ol" | "ul"; items: React.ReactNode[] } | null =
    null;
  let currentTable: { headers: string[]; rows: string[][] } | null = null;
  let inBlockquote = false;
  let blockquoteContent: string[] = [];

  const parseInline = (line: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let remaining = line;
    let keyIndex = 0;

    while (remaining.length > 0) {
      const linkMatch = remaining.match(
        /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/
      );
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
            <ExternalLink className="h-3.5 w-3.5" />
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
            "space-y-2 my-4",
            currentList.type === "ol"
              ? "list-decimal list-inside"
              : "list-none"
          )}
        >
          {currentList.items.map((item, i) => (
            <li
              key={i}
              className={cn(
                "text-muted dark:text-slate-300 leading-relaxed",
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
          className="my-4 border-l-4 border-amber-400 dark:border-amber-500 bg-amber-50/50 dark:bg-amber-900/20 rounded-r-xl px-4 py-3"
        >
          <div className="flex items-start gap-2">
            <span className="text-lg">💡</span>
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
        <div key={elements.length} className="my-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                {currentTable.headers.map((header, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-left font-semibold text-strong dark:text-white border-b border-slate-200 dark:border-slate-700"
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
                  className="border-b last:border-b-0 border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-4 py-3 text-muted dark:text-slate-300"
                    >
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

      const cells = trimmed
        .slice(1, -1)
        .split("|")
        .map((c) => c.trim());

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
        <hr
          key={elements.length}
          className="my-8 border-t border-slate-200 dark:border-slate-700/60"
        />
      );
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushList();
      const headingText = trimmed.slice(3);
      const hasEmoji = /^[\p{Emoji}]/u.test(headingText);
      elements.push(
        <h2
          key={elements.length}
          className="flex items-center gap-2 text-lg sm:text-xl font-bold text-strong dark:text-white mt-8 mb-4"
        >
          {!hasEmoji && (
            <span className="h-6 w-1 rounded-full bg-gradient-to-b from-emerald-500 to-teal-600" />
          )}
          {headingText}
        </h2>
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

    if (trimmed === "") {
      continue;
    }

    elements.push(
      <p
        key={elements.length}
        className="text-muted dark:text-slate-300 leading-relaxed my-3"
      >
        {parseInline(trimmed)}
      </p>
    );
  }

  flushList();
  flushBlockquote();
  flushTable();

  return elements;
}

export default function HouseRuleDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;
  const { rule, loading, error } = useHouseRule(id);
  const { lang } = useLanguage();

  const style = rule ? CATEGORY_STYLES[rule.category] : CATEGORY_STYLES.other;
  const Icon = style.icon;
  const labels = CATEGORY_LABELS(lang);

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <Link
          href="/house-rules"
          className="inline-flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium mb-6 group transition-colors"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          {lang.pages.houseRules.title}
        </Link>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-700 dark:text-red-300">
              {error.message}
            </p>
          </div>
        )}

        {!loading && !error && rule && (
          <article className="space-y-6">
            <div
              className={cn(
                "relative overflow-hidden rounded-3xl border border-slate-200/70 dark:border-slate-800/70",
                "bg-white/95 dark:bg-slate-950/80 backdrop-blur-xl",
                "shadow-[0_20px_70px_-40px] shadow-emerald-500/25"
              )}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 12% 18%, rgba(16,185,129,0.08), transparent 35%), radial-gradient(circle at 88% 16%, rgba(251,191,36,0.10), transparent 28%), linear-gradient(120deg, rgba(15,118,110,0.03), rgba(251,191,36,0.04))",
                }}
              />

              <div
                className={cn(
                  "absolute inset-y-0 left-0 w-2 rounded-r-full bg-gradient-to-b",
                  style.gradient
                )}
                aria-hidden="true"
              />

              <div className="relative p-6 sm:p-8 lg:p-10">
                <div className="flex flex-col sm:flex-row sm:items-start gap-5 sm:gap-6">
                  <div
                    className={cn(
                      "h-16 w-16 sm:h-20 sm:w-20 rounded-2xl text-white flex items-center justify-center shrink-0",
                      "bg-gradient-to-br",
                      style.gradient,
                      "shadow-xl",
                      designTokens.shadow(style.tone)
                    )}
                  >
                    <Icon className="h-8 w-8 sm:h-10 sm:w-10" strokeWidth={2} />
                  </div>

                  <div className="flex-1 min-w-0 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={cn(
                          "text-xs font-semibold px-3 py-1.5 rounded-full border border-transparent",
                          style.badge,
                          "shadow-sm"
                        )}
                      >
                        {labels[rule.category]}
                      </span>
                      {rule.effectiveFrom && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-subtle">
                          <Calendar className="h-3.5 w-3.5" />
                          {lang.pages.houseRules.effectiveFrom}
                          {rule.effectiveFrom}
                        </span>
                      )}
                    </div>

                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-strong dark:text-white leading-tight">
                      {rule.title}
                    </h1>

                    <p className="text-base sm:text-lg text-muted dark:text-slate-300 leading-relaxed">
                      {rule.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {rule.details && (
              <div
                className={cn(
                  "relative overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-800/70",
                  "bg-white/95 dark:bg-slate-950/80 backdrop-blur-xl",
                  "shadow-lg p-6 sm:p-8"
                )}
              >
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  {parseMarkdown(rule.details)}
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 text-sm text-subtle py-4">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>{lang.pages.houseRules.sidebarTitle}</span>
            </div>
          </article>
        )}

        {!loading && !error && !rule && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-muted dark:text-subtle">
              {lang.common?.notFound ?? "見つかりませんでした"}
            </p>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
