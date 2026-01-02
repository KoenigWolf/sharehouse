export interface MeetingNote {
  id: string;
  date: string; // ISO date
  title: string;
  summary: string;
  decisions: string[];
  actionItems: string[];
  attendees: string[];
  docUrl?: string;
  content?: string;
}

export interface UseMeetingNotesReturn {
  notes: MeetingNote[];
  loading: boolean;
  error: Error | null;
}

export interface MeetingNoteFormData {
  date: string;
  title: string;
  summary: string;
  decisions: string[];
  actionItems: string[];
  attendees: string[];
  content?: string;
  docUrl?: string;
}

export interface UseMeetingNoteMutationReturn {
  createNote: (data: MeetingNoteFormData) => Promise<MeetingNote>;
  updateNote: (id: string, data: MeetingNoteFormData) => Promise<MeetingNote>;
  isLoading: boolean;
  error: Error | null;
}
