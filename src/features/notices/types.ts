export type NoticeIconType =
  | "map"
  | "alert"
  | "window"
  | "wifi"
  | "thermometer"
  | "shoe"
  | "info";

export interface NoticeItem {
  title: string;
  content?: string;
  list?: string[];
  table?: { headers: string[]; rows: string[][] };
  important?: boolean;
}

export interface NoticeSection {
  id: string;
  title: string;
  icon?: NoticeIconType;
  items: NoticeItem[];
}
