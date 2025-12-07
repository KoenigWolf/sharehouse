import type { LangCode } from "./types";

export interface ChangelogEntry {
  id: string;
  date: string;
  version: string;
  title: string;
  summary: string;
  highlights: string[];
  tags: string[];
}

export interface UpdatesCopy {
  subtitle: string;
  highlightsLabel: string;
  tagsLabel: string;
  entriesLabel: string;
  latestLabel: string;
}

const baseCopy: UpdatesCopy = {
  subtitle: "Product updates & release notes",
  highlightsLabel: "Highlights",
  tagsLabel: "Tags",
  entriesLabel: "Entries",
  latestLabel: "Latest",
};

const jaCopy: UpdatesCopy = {
  subtitle: "リリースノートと最近の更新",
  highlightsLabel: "ハイライト",
  tagsLabel: "タグ",
  entriesLabel: "件数",
  latestLabel: "最新",
};

export const updatesCopy: Record<LangCode, UpdatesCopy> = {
  en: baseCopy,
  ja: jaCopy,
  fr: baseCopy,
  de: baseCopy,
  it: baseCopy,
  es: baseCopy,
  zh: baseCopy,
};

const releasesEn: ChangelogEntry[] = [
  {
    id: "2025-routing-refresh",
    date: "2025-01-05",
    version: "2025.1",
    title: "Routing refresh for events & updates",
    summary: "Separated the events listing from the updates page so each URL shows the right content and navigation stays predictable.",
    highlights: [
      "Events now live directly at /events with stats and archive cards.",
      "Updates now hosts release notes instead of mirroring event content.",
      "Navigation and quick links resolve to the correct destinations.",
    ],
    tags: ["routing", "ux"],
  },
  {
    id: "2024-accounting-polish",
    date: "2024-12-15",
    version: "2024.12",
    title: "Accounting dashboards tuned",
    summary: "Improved small-screen rendering and clarified month switching for the accounting dashboard and history views.",
    highlights: [
      "Refined tab handling to keep URL state in sync.",
      "Lighter rendering path for narrow devices.",
    ],
    tags: ["accounting", "mobile"],
  },
  {
    id: "2024-directory-improve",
    date: "2024-11-20",
    version: "2024.11",
    title: "Resident directory quality pass",
    summary: "Tighter error handling and better empty states across resident-facing lists and profile edit flows.",
    highlights: [
      "Friendlier empty cards with clearer actions.",
      "Consistent input styling across auth and profile forms.",
    ],
    tags: ["residents", "quality"],
  },
];

const releasesJa: ChangelogEntry[] = [
  {
    id: "2025-routing-refresh",
    date: "2025-01-05",
    version: "2025.1",
    title: "イベント/アップデートのルーティング整理",
    summary: "イベント一覧を専用ページに戻し、アップデートページと役割を分離。各URLで期待どおりの内容が表示されるようにしました。",
    highlights: [
      "/events でイベント一覧と統計を直接表示。",
      "アップデートページはリリースノートを表示し、イベントとは独立。",
      "ナビゲーションやクイックリンクの遷移先を整理。",
    ],
    tags: ["routing", "ux"],
  },
  {
    id: "2024-accounting-polish",
    date: "2024-12-15",
    version: "2024.12",
    title: "会計ダッシュボードを調整",
    summary: "会計ダッシュボード/履歴のモバイル表示を改善し、月切り替えをより分かりやすくしました。",
    highlights: [
      "タブ操作でURLパラメータと状態を同期。",
      "コンパクト端末向けに描画負荷を軽減。",
    ],
    tags: ["accounting", "mobile"],
  },
  {
    id: "2024-directory-improve",
    date: "2024-11-20",
    version: "2024.11",
    title: "居住者ディレクトリの品質向上",
    summary: "居住者一覧やプロフィール編集でのエラーハンドリングと空状態表示を強化しました。",
    highlights: [
      "空状態カードに分かりやすい案内を追加。",
      "認証・プロフィールフォームの入力スタイルを統一。",
    ],
    tags: ["residents", "quality"],
  },
];

export const updatesReleases: Record<LangCode, ChangelogEntry[]> = {
  en: releasesEn,
  ja: releasesJa,
  fr: releasesEn,
  de: releasesEn,
  it: releasesEn,
  es: releasesEn,
  zh: releasesEn,
};
