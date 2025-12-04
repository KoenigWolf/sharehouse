"use client";

import { memo, useState } from "react";
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
  ChevronRight,
  CheckCircle,
  ExternalLink,
  Phone,
  Copy,
  Check,
} from "lucide-react";

interface NoticeBoardProps {
  sections: NoticeSection[];
}

const iconMap: Record<NoticeIconType, React.ElementType> = {
  map: Map,
  alert: AlertTriangle,
  window: Wind,
  wifi: Wifi,
  thermometer: Thermometer,
  shoe: Footprints,
  info: Info,
};

const gradientMap: Record<NoticeIconType, string> = {
  map: "from-blue-500 to-cyan-500",
  alert: "from-amber-500 to-orange-500",
  window: "from-sky-500 to-blue-500",
  wifi: "from-violet-500 to-purple-500",
  thermometer: "from-rose-500 to-pink-500",
  shoe: "from-emerald-500 to-teal-500",
  info: "from-slate-500 to-slate-600",
};

const shadowMap: Record<NoticeIconType, string> = {
  map: "shadow-blue-500/25",
  alert: "shadow-amber-500/25",
  window: "shadow-sky-500/25",
  wifi: "shadow-violet-500/25",
  thermometer: "shadow-rose-500/25",
  shoe: "shadow-emerald-500/25",
  info: "shadow-slate-500/25",
};

export const NoticeBoard = memo(function NoticeBoard({ sections }: NoticeBoardProps) {
  return (
    <div className="space-y-8 sm:space-y-10">
      {sections.map((section) => (
        <NoticeSectionCard key={section.id} section={section} />
      ))}
    </div>
  );
});

interface NoticeSectionCardProps {
  section: NoticeSection;
}

const NoticeSectionCard = memo(function NoticeSectionCard({ section }: NoticeSectionCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const iconType = section.icon || "info";
  const IconComponent = iconMap[iconType];
  const gradient = gradientMap[iconType];
  const shadow = shadowMap[iconType];

  return (
    <section className="space-y-4 sm:space-y-5">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex items-center justify-between gap-4 p-4 sm:p-5",
          "rounded-2xl",
          "bg-white dark:bg-slate-800/90",
          "border border-slate-200/80 dark:border-slate-700/60",
          "shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50",
          "hover:shadow-xl hover:scale-[1.01]",
          "transition-all duration-300",
          "text-left group"
        )}
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl",
              "bg-linear-to-br",
              gradient,
              "shadow-lg",
              shadow,
              "transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
            )}
          >
            <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {section.title}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {section.items.length}件の項目
            </p>
          </div>
        </div>
        <div
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-lg",
            "bg-slate-100 dark:bg-slate-700",
            "text-slate-500 dark:text-slate-400",
            "transition-transform duration-300",
            isExpanded && "rotate-180"
          )}
        >
          <ChevronDown className="w-5 h-5" strokeWidth={2} />
        </div>
      </button>

      <div
        className={cn(
          "grid gap-4 sm:gap-5 transition-all duration-300",
          isExpanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0 overflow-hidden"
        )}
      >
        <div className="overflow-hidden">
          <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
            {section.items.map((item, idx) => (
              <NoticeItemCard key={`${section.id}-${idx}`} item={item} iconType={iconType} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

interface NoticeItemCardProps {
  item: NoticeItem;
  iconType: NoticeIconType;
}

const NoticeItemCard = memo(function NoticeItemCard({ item, iconType }: NoticeItemCardProps) {
  const { lang } = useLanguage();
  const gradient = gradientMap[iconType];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl",
        "bg-white dark:bg-slate-800/80",
        "border border-slate-200/80 dark:border-slate-700/60",
        "shadow-md hover:shadow-lg",
        "transition-all duration-300 hover:-translate-y-0.5"
      )}
    >
      <div
        className={cn("absolute top-0 left-0 right-0 h-1 bg-linear-to-r", gradient)}
        aria-hidden="true"
      />

      <div className="p-5 sm:p-6 space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white flex items-start gap-2">
          <span className="flex-1">{item.title}</span>
          {item.important && (
            <span className="flex-shrink-0 px-2 py-0.5 text-xs font-bold rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
              重要
            </span>
          )}
        </h3>

        {item.content && <ContentBlock content={item.content} />}

        {item.list && <ListBlock items={item.list} />}

        {item.table && <TableBlock table={item.table} emptyCell={lang.common.emptyCell} />}
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
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-600 dark:text-slate-400"
            )}
          >
            {isPhone && <Phone className="inline w-3.5 h-3.5 mr-1.5" strokeWidth={2} />}
            {isLink && !isPhone && (
              <ExternalLink className="inline w-3.5 h-3.5 mr-1.5" strokeWidth={2} />
            )}
            {line}
          </p>
        );
      })}
    </div>
  );
});

const ListBlock = memo(function ListBlock({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((line, i) => {
        const isCredential =
          line.toLowerCase().includes("ssid") ||
          line.toLowerCase().includes("パスワード") ||
          line.toLowerCase().includes("password");

        return (
          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400">
            <CheckCircle
              className="flex-shrink-0 w-4 h-4 mt-0.5 text-emerald-500"
              strokeWidth={2.5}
            />
            <span className={cn("leading-relaxed", isCredential && "font-mono text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded")}>
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "flex-shrink-0 p-1 rounded",
        "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300",
        "hover:bg-slate-100 dark:hover:bg-slate-700",
        "transition-colors"
      )}
      title="コピー"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2.5} />
      ) : (
        <Copy className="w-3.5 h-3.5" strokeWidth={2} />
      )}
    </button>
  );
});

interface TableBlockProps {
  table: { headers: string[]; rows: string[][] };
  emptyCell: string;
}

const TableBlock = memo(function TableBlock({ table, emptyCell }: TableBlockProps) {
  return (
    <div className="overflow-x-auto -mx-5 sm:-mx-6 px-5 sm:px-6">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b-2 border-slate-200 dark:border-slate-600">
              {table.headers.map((h) => (
                <th
                  key={h}
                  className="px-3 py-2.5 text-left font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {table.rows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
              >
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    className={cn(
                      "px-3 py-2.5 whitespace-nowrap",
                      cell
                        ? "text-slate-700 dark:text-slate-200"
                        : "text-slate-400 dark:text-slate-500"
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
