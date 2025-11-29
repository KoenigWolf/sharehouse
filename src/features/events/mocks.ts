import type { EventInfo } from "./types";

export const events: EventInfo[] = [
  {
    id: "event-2025-01",
    title: "新年ウェルカムパーティー",
    date: "2025-01-12",
    location: "共有リビング",
    description: "新メンバー歓迎と今年の方針共有。軽食とドリンクを用意します。",
    type: "upcoming",
    tags: ["交流", "パーティー"],
  },
  {
    id: "event-2024-12",
    title: "年末大掃除 & 持ち寄りごはん会",
    date: "2024-12-23",
    location: "全館 & キッチン",
    description: "共用部の大掃除のあと、持ち寄りの夕食で一年を締めくくります。",
    type: "upcoming",
    tags: ["清掃", "食事会"],
  },
  {
    id: "event-2024-11",
    title: "ボードゲームナイト",
    date: "2024-11-18",
    location: "共有リビング",
    description: "定番から新作までボードゲームを持ち寄って遊びました。",
    type: "past",
    tags: ["交流", "ゲーム"],
  },
  {
    id: "event-2024-10",
    title: "秋の屋上BBQ",
    date: "2024-10-06",
    location: "屋上テラス",
    description: "秋晴れのなか屋上でBBQを実施。新しいグリルを初使用。",
    type: "past",
    tags: ["食事会", "屋外"],
  },
  {
    id: "event-2024-09",
    title: "防災ワークショップ",
    date: "2024-09-15",
    location: "共有リビング",
    description: "非常時の避難経路確認と備蓄の使い方を実地で確認。",
    type: "past",
    tags: ["安全", "ワークショップ"],
  },
];
