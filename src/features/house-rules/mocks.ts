import type { HouseRule } from "./types";

export const houseRules: HouseRule[] = [
  {
    id: "rule-01",
    title: "共用部の清掃",
    description: "キッチン・リビングの清掃担当は週替わりの当番制。担当表は玄関のホワイトボードに掲示。",
    category: "cleaning",
  },
  {
    id: "rule-02",
    title: "ゴミ出し",
    description: "分別を徹底。前日23時以降の持ち込みは禁止。回収日の朝8時までに所定の場所へ。",
    category: "living",
  },
  {
    id: "rule-03",
    title: "静音時間",
    description: "平日22時以降・休日23時以降は大音量の音楽や大人数での集まりを控える。",
    category: "noise",
  },
  {
    id: "rule-04",
    title: "来客ルール",
    description: "宿泊ゲストは事前にSlackで共有。共用部の占有は2時間までを目安とする。",
    category: "living",
  },
  {
    id: "rule-05",
    title: "防災備蓄",
    description: "備蓄棚の食料・水は持ち出し禁止。消費した場合は必ず補充を連絡。",
    category: "safety",
  },
  {
    id: "rule-06",
    title: "共有Wi-Fi",
    description: "大容量ダウンロードは深夜帯に実施。ルーター設定は管理人のみ変更可。",
    category: "living",
  },
];
