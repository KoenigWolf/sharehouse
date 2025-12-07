import { useEffect, useState } from "react";
import { env } from "@/src/config";
import type { MeetingNote, UseMeetingNotesReturn } from "./types";
import { meetingNotes as mockMeetingNotes } from "./mocks";
import { fetchMeetingNotes as fetchMeetingNotesApi, fetchMeetingNote as fetchMeetingNoteApi } from "./api";

export function useMeetingNotes(): UseMeetingNotesReturn {
  const [notes, setNotes] = useState<MeetingNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        setLoading(true);
        if (env.features.useMockData) {
          await new Promise((resolve) => setTimeout(resolve, 200));
          setNotes(mockMeetingNotes);
        } else {
          const data = await fetchMeetingNotesApi();
          setNotes(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load meeting notes"));
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, []);

  return { notes, loading, error };
}

export function useMeetingNote(id: string | undefined) {
  const [note, setNote] = useState<MeetingNote | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const loadNote = async () => {
      try {
        setLoading(true);
        if (env.features.useMockData) {
          await new Promise((resolve) => setTimeout(resolve, 150));
          const found = mockMeetingNotes.find((n) => n.id === id);
          setNote(found);
        } else {
          const data = await fetchMeetingNoteApi(id);
          setNote(data ?? undefined);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load meeting note"));
      } finally {
        setLoading(false);
      }
    };

    loadNote();
  }, [id]);

  return { note, loading, error };
}
