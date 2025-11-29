export interface NoticeSection {
  id: string;
  title: string;
  items: Array<{
    title: string;
    content: string;
    list?: string[];
    table?: { headers: string[]; rows: string[][] };
  }>;
}
