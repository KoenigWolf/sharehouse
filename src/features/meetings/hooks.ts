import { useEffect, useState } from "react";
import type { MeetingNote, UseMeetingNotesReturn } from "./types";
import { meetingNotes } from "./mocks";

export function useMeetingNotes(): UseMeetingNotesReturn {
  const [notes, setNotes] = useState<MeetingNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        // Simulate small delay
        await new Promise((resolve) => setTimeout(resolve, 200));
        setNotes(meetingNotes);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load meeting notes"));
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  return { notes, loading, error };
}

export function useMeetingNote(id: string | undefined) {
  const { notes, loading, error } = useMeetingNotes();
  const note = notes.find((n) => n.id === id);
  return { notes, note, loading, error };
}
