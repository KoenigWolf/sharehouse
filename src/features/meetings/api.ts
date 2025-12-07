import { createClient } from "@/src/lib/supabase/client";
import type { MeetingNote } from "./types";

interface MeetingNoteRow {
  id: string;
  date: string;
  title: string;
  summary: string | null;
  decisions: string[] | null;
  action_items: string[] | null;
  attendees: string[] | null;
  content: string | null;
  doc_url: string | null;
  created_at: string;
  updated_at: string;
}

function mapRowToMeetingNote(row: MeetingNoteRow): MeetingNote {
  return {
    id: row.id,
    date: row.date,
    title: row.title,
    summary: row.summary ?? "",
    decisions: row.decisions ?? [],
    actionItems: row.action_items ?? [],
    attendees: row.attendees ?? [],
    content: row.content ?? undefined,
    docUrl: row.doc_url ?? undefined,
  };
}

export async function fetchMeetingNotes(): Promise<MeetingNote[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("meeting_notes")
    .select("*")
    .order("date", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRowToMeetingNote);
}

export async function fetchMeetingNote(id: string): Promise<MeetingNote | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("meeting_notes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data ? mapRowToMeetingNote(data) : null;
}
