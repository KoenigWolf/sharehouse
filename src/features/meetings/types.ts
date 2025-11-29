export interface MeetingNote {
  id: string;
  date: string; // ISO date
  title: string;
  summary: string;
  decisions: string[];
  actionItems: string[];
  attendees: string[];
  docUrl?: string;
}

export interface UseMeetingNotesReturn {
  notes: MeetingNote[];
  loading: boolean;
  error: Error | null;
}
