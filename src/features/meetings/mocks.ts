import type { MeetingNote, MeetingNoteFormData } from "./types";

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
    content:
      "・年末パーティーは17:00開始、会費は1人1,000円を予定。\n・食事は持ち寄り + 簡易ケータリング、飲料は会計から一部負担。\n・設備点検は業者立会い、各室内の点検有無は別途連絡する。\n",
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
    content:
      "・ゴミ出しルール再周知のためポスター掲示とSlackアナウンスを実施。\n・Wi-Fiルーター交換は12月初旬を目標、コスト上限は会計で確認。\n",
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
    content:
      "・備蓄棚卸しは10/8に実施、消費期限切れは破棄し補充リストを作成。\n・歓迎会は20:00開始、費用は会計から一部負担し不足分は参加者で割り勘。\n",
  },
];

const STORAGE_KEY = "meeting_notes_mock";

function getStoredNotes(): MeetingNote[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveNotes(notes: MeetingNote[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function getMockMeetingNotes(): MeetingNote[] {
  const stored = getStoredNotes();
  const allNotes = [...stored, ...meetingNotes];
  const uniqueNotes = allNotes.reduce((acc, note) => {
    if (!acc.find((n) => n.id === note.id)) {
      acc.push(note);
    }
    return acc;
  }, [] as MeetingNote[]);
  return uniqueNotes.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getMockMeetingNote(id: string): MeetingNote | undefined {
  return getMockMeetingNotes().find((n) => n.id === id);
}

export function createMockMeetingNote(data: MeetingNoteFormData): MeetingNote {
  const newNote: MeetingNote = {
    id: `note-${Date.now()}`,
    date: data.date,
    title: data.title,
    summary: data.summary,
    decisions: data.decisions.filter(Boolean),
    actionItems: data.actionItems.filter(Boolean),
    attendees: data.attendees.filter(Boolean),
    content: data.content,
    docUrl: data.docUrl,
  };
  const stored = getStoredNotes();
  stored.push(newNote);
  saveNotes(stored);
  return newNote;
}

export function updateMockMeetingNote(
  id: string,
  data: MeetingNoteFormData
): MeetingNote {
  const stored = getStoredNotes();
  const existingIndex = stored.findIndex((n) => n.id === id);

  const updatedNote: MeetingNote = {
    id,
    date: data.date,
    title: data.title,
    summary: data.summary,
    decisions: data.decisions.filter(Boolean),
    actionItems: data.actionItems.filter(Boolean),
    attendees: data.attendees.filter(Boolean),
    content: data.content,
    docUrl: data.docUrl,
  };

  if (existingIndex >= 0) {
    stored[existingIndex] = updatedNote;
  } else {
    stored.push(updatedNote);
  }
  saveNotes(stored);
  return updatedNote;
}
