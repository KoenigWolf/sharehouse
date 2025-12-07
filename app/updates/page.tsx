"use client";

import { format } from "date-fns";
import { PageContainer } from "@/src/shared/layouts";
import { useLanguage } from "@/src/shared/lang/context";
import type { LangCode } from "@/src/shared/lang/types";
import { cn } from "@/src/lib/utils";
import { designTokens } from "@/src/shared/ui/designTokens";
import { Sparkles, CalendarClock, CheckCircle2, Tag } from "lucide-react";

type LocalizedText = Partial<Record<LangCode, string>> & { en: string };

interface UpdateEntry {
  id: string;
  date: string;
  version: string;
  title: LocalizedText;
  summary: LocalizedText;
  highlights: LocalizedText[];
  tags: string[];
}

const COPY: Partial<Record<LangCode, { subtitle: string; highlights: string; tags: string }>> = {
  en: {
    subtitle: "Product updates & release notes",
    highlights: "Highlights",
    tags: "Tags",
  },
  ja: {
    subtitle: "リリースノートと最近の更新",
    highlights: "ハイライト",
    tags: "タグ",
  },
};

const UPDATES: UpdateEntry[] = [
  {
    id: "2025-routing-refresh",
    date: "2025-01-05",
    version: "2025.1",
    title: {
      en: "Routing refresh for events & updates",
      ja: "イベント/アップデートのルーティング整理",
    },
    summary: {
      en: "Separated the events listing from the updates page so each URL shows the right content and navigation stays predictable.",
      ja: "イベント一覧を専用ページに戻し、アップデートページと役割を分離。各URLで期待どおりの内容が表示されるようにしました。",
    },
    highlights: [
      {
        en: "Events now live directly at /events with stats and archive cards.",
        ja: "/events でイベント一覧と統計を直接表示。",
      },
      {
        en: "Updates now hosts release notes instead of mirroring event content.",
        ja: "アップデートページはリリースノートを表示し、イベントとは独立。",
      },
      {
        en: "Navigation and quick links resolve to the correct destinations.",
        ja: "ナビゲーションやクイックリンクの遷移先を整理。",
      },
    ],
    tags: ["routing", "ux"],
  },
  {
    id: "2024-accounting-polish",
    date: "2024-12-15",
    version: "2024.12",
    title: {
      en: "Accounting dashboards tuned",
      ja: "会計ダッシュボードを調整",
    },
    summary: {
      en: "Improved small-screen rendering and clarified month switching for the accounting dashboard and history views.",
      ja: "会計ダッシュボード/履歴のモバイル表示を改善し、月切り替えをより分かりやすくしました。",
    },
    highlights: [
      {
        en: "Refined tab handling to keep URL state in sync.",
        ja: "タブ操作でURLパラメータと状態を同期。",
      },
      {
        en: "Lighter rendering path for narrow devices.",
        ja: "コンパクト端末向けに描画負荷を軽減。",
      },
    ],
    tags: ["accounting", "mobile"],
  },
  {
    id: "2024-directory-improve",
    date: "2024-11-20",
    version: "2024.11",
    title: {
      en: "Resident directory quality pass",
      ja: "居住者ディレクトリの品質向上",
    },
    summary: {
      en: "Tighter error handling and better empty states across resident-facing lists and profile edit flows.",
      ja: "居住者一覧やプロフィール編集でのエラーハンドリングと空状態表示を強化しました。",
    },
    highlights: [
      {
        en: "Friendlier empty cards with clearer actions.",
        ja: "空状態カードに分かりやすい案内を追加。",
      },
      {
        en: "Consistent input styling across auth and profile forms.",
        ja: "認証・プロフィールフォームの入力スタイルを統一。",
      },
    ],
    tags: ["residents", "quality"],
  },
];

export default function UpdatesPage() {
  const { code, lang } = useLanguage();
  const copy = COPY[code] ?? COPY.en!;

  return (
    <PageContainer>
      <div className="relative">
        <div className="absolute inset-0 -z-10 gradient-brand-soft" aria-hidden="true" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-14 space-y-8 sm:space-y-12">
          <header className="relative overflow-hidden rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-white/85 dark:bg-slate-900/80 backdrop-blur-xl shadow-[0_25px_80px_-40px] shadow-emerald-500/25">
            <div className="absolute inset-0 opacity-80" aria-hidden="true">
              <div className="absolute -left-12 top-0 h-40 w-40 sm:h-52 sm:w-52 rounded-full bg-emerald-400/16 blur-3xl" />
              <div className="absolute right-0 top-6 h-36 w-44 sm:h-48 sm:w-56 rounded-full bg-amber-300/18 blur-3xl" />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-emerald-500/8 via-transparent to-transparent" />
            </div>
            <div className="relative p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-2xl text-white",
                    "shadow-lg shadow-emerald-500/25",
                    designTokens.gradient("primary")
                  )}
                >
                  <Sparkles className="w-6 h-6" strokeWidth={2.25} />
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                    {lang.nav.updates}
                  </p>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-strong leading-tight">
                    {lang.pages.home.updatesTitle}
                  </h1>
                  <p className="text-base text-muted max-w-2xl">
                    {copy.subtitle}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <StatChip label="Entries" value={UPDATES.length} tone="primary" />
                <StatChip label="Latest" value={new Date(UPDATES[0].date).getFullYear()} tone="warm" />
              </div>
            </div>
          </header>

          <div className="grid gap-5 sm:gap-6">
            {UPDATES.map((update) => (
              <UpdateCard key={update.id} update={update} code={code} copy={copy} />
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

function UpdateCard({
  update,
  code,
  copy,
}: {
  update: UpdateEntry;
  code: LangCode;
  copy: { subtitle: string; highlights: string; tags: string };
}) {
  const dateLabel = format(new Date(update.date), "yyyy/MM/dd");
  const t = (text: LocalizedText) => text[code] ?? text.en;

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-3xl border border-slate-200/70 dark:border-slate-800/70",
        "bg-white/85 dark:bg-slate-900/75 backdrop-blur-xl",
        "shadow-[0_18px_60px_-40px] shadow-emerald-500/18"
      )}
    >
      <div className="absolute inset-0 pointer-events-none opacity-80" aria-hidden="true">
        <div className="absolute inset-0 bg-linear-to-br from-emerald-500/6 via-teal-500/4 to-amber-400/6 dark:from-emerald-400/8 dark:via-teal-400/6 dark:to-amber-300/8" />
        <div className="absolute inset-x-0 top-0 h-20 bg-linear-to-b from-white/50 dark:from-white/5 to-transparent" />
      </div>

      <div className="relative p-6 sm:p-7 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm text-subtle">
              <CalendarClock className="w-4 h-4" />
              <span>{dateLabel}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-strong dark:text-white leading-tight">
              {t(update.title)}
            </h2>
            <p className="text-sm sm:text-base text-muted dark:text-subtle">
              {t(update.summary)}
            </p>
          </div>
          <div
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-white",
              designTokens.gradient("primary"),
              designTokens.shadow("primary")
            )}
          >
            <Sparkles className="w-4 h-4" />
            v{update.version}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
          <Tag className="w-3.5 h-3.5" />
          <span>{copy.tags}</span>
          {update.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-200 border border-emerald-100 dark:border-emerald-800"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="pt-2 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            {copy.highlights}
          </p>
          <ul className="grid sm:grid-cols-2 gap-2.5">
            {update.highlights.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/90 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/70 shadow-sm"
              >
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                <span className="text-sm text-strong dark:text-white leading-relaxed">{t(item)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

function StatChip({ label, value, tone = "primary" }: { label: string; value: number; tone?: Parameters<typeof designTokens.gradient>[0]; }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-white",
        "shadow-md",
        designTokens.gradient(tone),
        designTokens.shadow(tone)
      )}
    >
      <span className="text-base font-bold tabular-nums">{value}</span>
      <span>{label}</span>
    </span>
  );
}
