"use client";

import { memo, useState, useCallback } from "react";
import { cn } from "@/src/lib/utils";
import { useLanguage } from "@/src/shared/lang/context";
import type { NoticeSection, NoticeItem, NoticeIconType } from "../types";
import {
  Map,
  AlertTriangle,
  Wind,
  Wifi,
  Thermometer,
  Footprints,
  Info,
  ChevronDown,
  CheckCircle2,
  ExternalLink,
  Phone,
  Copy,
  Check,
  type LucideIcon,
} from "lucide-react";

type IconStyle = {
  icon: LucideIcon;
  gradient: string;
  shadow: string;
  accent: string;
  badge: string;
};

const ICON_STYLES: Record<NoticeIconType, IconStyle> = {
  map: {
    icon: Map,
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    shadow: "shadow-emerald-500/30",
    accent: "bg-emerald-500",
    badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  alert: {
    icon: AlertTriangle,
    gradient: "from-amber-500 via-orange-500 to-red-500",
    shadow: "shadow-amber-500/30",
    accent: "bg-amber-500",
    badge: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  window: {
    icon: Wind,
    gradient: "from-cyan-500 via-sky-500 to-blue-500",
    shadow: "shadow-cyan-500/30",
    accent: "bg-cyan-500",
    badge: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
  },
  wifi: {
    icon: Wifi,
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    shadow: "shadow-violet-500/30",
    accent: "bg-violet-500",
    badge: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  },
  thermometer: {
    icon: Thermometer,
    gradient: "from-rose-500 via-pink-500 to-red-500",
    shadow: "shadow-rose-500/30",
    accent: "bg-rose-500",
    badge: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  },
  shoe: {
    icon: Footprints,
    gradient: "from-lime-500 via-green-500 to-emerald-500",
    shadow: "shadow-lime-500/30",
    accent: "bg-lime-500",
    badge: "bg-lime-500/10 text-lime-700 dark:text-lime-300",
  },
  info: {
    icon: Info,
    gradient: "from-slate-500 via-slate-600 to-slate-700",
    shadow: "shadow-slate-500/30",
    accent: "bg-slate-500",
    badge: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
  },
};

interface NoticeBoardProps {
  sections: NoticeSection[];
}

export const NoticeBoard = memo(function NoticeBoard({ sections }: NoticeBoardProps) {
  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <SectionCard key={section.id} section={section} />
      ))}
    </div>
  );
});

interface SectionCardProps {
  section: NoticeSection;
}

const SectionCard = memo(function SectionCard({ section }: SectionCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const iconType = section.icon || "info";
  const style = ICON_STYLES[iconType];
  const Icon = style.icon;

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <section className="space-y-3">
      {/* Section Header */}
      <button
        type="button"
        onClick={toggleExpand}
        className={cn(
          "group w-full flex items-center justify-between gap-4",
          "p-4 rounded-2xl",
          "bg-white dark:bg-slate-900/80",
          "border border-slate-200/60 dark:border-slate-800/60",
          "shadow-lg shadow-slate-900/5 dark:shadow-slate-950/50",
          "transition-all duration-300",
          "hover:shadow-xl hover:-translate-y-0.5",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        )}
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "relative shrink-0 h-12 w-12 rounded-xl",
              "bg-linear-to-br",
              style.gradient,
              "shadow-lg",
              style.shadow,
              "flex items-center justify-center",
              "transition-all duration-500",
              "group-hover:scale-110 group-hover:rotate-3"
            )}
          >
            <Icon className="h-6 w-6 text-white drop-shadow-sm" strokeWidth={2} />
            <div className="absolute inset-0 rounded-xl bg-linear-to-tr from-white/25 via-transparent to-transparent" />
          </div>
          <div className="text-left">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {section.title}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {section.items.length}件の項目
            </p>
          </div>
        </div>
        <div
          className={cn(
            "flex items-center justify-center h-8 w-8 rounded-full",
            "bg-slate-100 dark:bg-slate-800",
            "text-slate-500 dark:text-slate-400",
            "transition-all duration-300",
            isExpanded && "rotate-180",
            "group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
          )}
        >
          <ChevronDown className="h-5 w-5" strokeWidth={2} />
        </div>
      </button>

      {/* Section Items */}
      <div
        className={cn(
          "grid transition-all duration-500 ease-out",
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="space-y-3">
            {section.items.map((item, idx) => (
              <ItemCard key={`${section.id}-${idx}`} item={item} style={style} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

interface ItemCardProps {
  item: NoticeItem;
  style: IconStyle;
}

const ItemCard = memo(function ItemCard({ item, style }: ItemCardProps) {
  const { lang } = useLanguage();
  const Icon = style.icon;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl",
        "bg-white dark:bg-slate-900/80",
        "border border-slate-200/60 dark:border-slate-800/60",
        "shadow-md shadow-slate-900/5 dark:shadow-slate-950/30",
        "transition-all duration-300",
        "hover:shadow-xl hover:-translate-y-0.5"
      )}
    >
      {/* Gradient accent bar */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1 transition-all duration-300",
          "bg-linear-to-b",
          style.gradient,
          "group-hover:w-1.5"
        )}
      />

      <div className="flex items-start gap-4 p-5">
        {/* Icon */}
        <div
          className={cn(
            "relative shrink-0 h-11 w-11 rounded-xl",
            "bg-linear-to-br",
            style.gradient,
            "shadow-md",
            style.shadow,
            "flex items-center justify-center",
            "transition-all duration-300",
            "group-hover:scale-105"
          )}
        >
          <Icon className="h-5 w-5 text-white" strokeWidth={2} />
          <div className="absolute inset-0 rounded-xl bg-linear-to-tr from-white/20 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white leading-snug">
              {item.title}
            </h3>
            {item.important && (
              <span
                className={cn(
                  "shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full",
                  "bg-amber-500/10 text-amber-700 dark:text-amber-300",
                  "ring-1 ring-inset ring-amber-500/20"
                )}
              >
                重要
              </span>
            )}
          </div>

          {/* Content blocks */}
          {item.content && <ContentBlock content={item.content} />}
          {item.list && <ListBlock items={item.list} />}
          {item.table && <TableBlock table={item.table} emptyCell={lang.common.emptyCell} gradient={style.gradient} />}
        </div>
      </div>
    </div>
  );
});

const ContentBlock = memo(function ContentBlock({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        const isLink = line.includes("://") || line.includes("@");
        const isPhone = /\d{2,4}-\d{2,4}-\d{4}/.test(line);

        return (
          <p
            key={i}
            className={cn(
              "text-sm leading-relaxed",
              isLink || isPhone
                ? "text-emerald-600 dark:text-emerald-400 font-medium"
                : "text-slate-600 dark:text-slate-400"
            )}
          >
            {isPhone && <Phone className="inline h-3.5 w-3.5 mr-1.5" strokeWidth={2} />}
            {isLink && !isPhone && <ExternalLink className="inline h-3.5 w-3.5 mr-1.5" strokeWidth={2} />}
            {line}
          </p>
        );
      })}
    </div>
  );
});

interface ListBlockProps {
  items: string[];
}

const ListBlock = memo(function ListBlock({ items }: ListBlockProps) {
  return (
    <ul className="space-y-2.5">
      {items.map((line, i) => {
        const isCredential =
          line.toLowerCase().includes("ssid") ||
          line.toLowerCase().includes("パスワード") ||
          line.toLowerCase().includes("password");

        return (
          <li key={i} className="flex items-start gap-3 text-sm">
            <CheckCircle2
              className={cn("shrink-0 h-4 w-4 mt-0.5 text-emerald-500")}
              strokeWidth={2.5}
            />
            <span
              className={cn(
                "flex-1 leading-relaxed text-slate-600 dark:text-slate-400",
                isCredential && "font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg"
              )}
            >
              {line}
            </span>
            {isCredential && <CopyButton text={line.split(": ")[1] || line} />}
          </li>
        );
      })}
    </ul>
  );
});

const CopyButton = memo(function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  }, [text]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "shrink-0 p-1.5 rounded-lg",
        "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300",
        "hover:bg-slate-100 dark:hover:bg-slate-800",
        "transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      )}
      title="コピー"
    >
      {copied ? (
        <Check className="h-4 w-4 text-emerald-500" strokeWidth={2.5} />
      ) : (
        <Copy className="h-4 w-4" strokeWidth={2} />
      )}
    </button>
  );
});

interface TableBlockProps {
  table: { headers: string[]; rows: string[][] };
  emptyCell: string;
  gradient: string;
}

const TableBlock = memo(function TableBlock({ table, emptyCell, gradient }: TableBlockProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 dark:border-slate-800/80">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className={cn("bg-linear-to-r", gradient)}>
              {table.headers.map((h, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {table.rows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className={cn(
                  "transition-colors",
                  rIdx % 2 === 0
                    ? "bg-white dark:bg-slate-900/50"
                    : "bg-slate-50/50 dark:bg-slate-800/30",
                  "hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20"
                )}
              >
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    className={cn(
                      "px-4 py-3 whitespace-nowrap",
                      cell
                        ? "text-slate-700 dark:text-slate-300 font-medium"
                        : "text-slate-400 dark:text-slate-500 italic"
                    )}
                  >
                    {cell || emptyCell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
