import type { MeetingNote } from "./types";

export const meetingNotes: MeetingNote[] = [
  {
    id: "note-2024-12",
    date: "2024-12-05",
    title: "12月 住民会議",
    summary: "年末イベントの準備と冬季設備点検について確認しました。",
    decisions: [
      "12/23 に共有スペースで年末パーティーを実施。",
      "12/15 に設備点検（給湯・暖房）を実施、当日は午前中に在宅協力依頼。",
    ],
    actionItems: [
      "買い出し担当を募る（募集期限: 12/12）",
      "イベント終了後の清掃シフトを12/20までに確定",
    ],
    attendees: ["Aki", "Yuta", "Mina", "Ken", "Sora"],
  },
  {
    id: "note-2024-11",
    date: "2024-11-07",
    title: "11月 住民会議",
    summary: "ゴミ置き場のルール徹底と共用Wi-Fiの速度改善について議論しました。",
    decisions: [
      "ゴミ出し前日の23時以降の持ち込み禁止を再周知。",
      "共用Wi-Fiルーターを12月に交換、設置は管理人担当。",
    ],
    actionItems: [
      "周知ポスターをエントランスとキッチンに掲示（担当: Mina）",
      "ルーター選定候補をSlackで共有（担当: Ken / 11/15まで）",
    ],
    attendees: ["Aki", "Yuta", "Mina", "Ken", "Sora", "Leo"],
  },
  {
    id: "note-2024-10",
    date: "2024-10-03",
    title: "10月 住民会議",
    summary: "防災備蓄の棚卸しと新規住民の歓迎会について決定。",
    decisions: [
      "備蓄品の有効期限リストを共有し、11月に一部補充。",
      "新規住民歓迎会を10/20夜に開催。",
    ],
    actionItems: [
      "備蓄リストをNotionで更新（担当: Yuta）",
      "歓迎会の買い出し担当を募集（締切: 10/10）",
    ],
    attendees: ["Aki", "Yuta", "Mina", "Sora"],
  },
];
