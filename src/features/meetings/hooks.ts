import { useCallback, useEffect, useState } from "react";
import { env } from "@/src/config";
import type {
  MeetingNote,
  MeetingNoteFormData,
  UseMeetingNotesReturn,
  UseMeetingNoteMutationReturn,
} from "./types";
import {
  getMockMeetingNotes,
  getMockMeetingNote,
  createMockMeetingNote,
  updateMockMeetingNote,
} from "./mocks";
import {
  fetchMeetingNotes as fetchMeetingNotesApi,
  fetchMeetingNote as fetchMeetingNoteApi,
  createMeetingNote as createMeetingNoteApi,
  updateMeetingNote as updateMeetingNoteApi,
} from "./api";

export function useMeetingNotes(): UseMeetingNotesReturn & { refetch: () => void } {
  const [notes, setNotes] = useState<MeetingNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);
      if (env.features.useMockData) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setNotes(getMockMeetingNotes());
      } else {
        const data = await fetchMeetingNotesApi();
        setNotes(data);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to load meeting notes")
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  return { notes, loading, error, refetch: loadNotes };
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
          const found = getMockMeetingNote(id);
          setNote(found);
        } else {
          const data = await fetchMeetingNoteApi(id);
          setNote(data ?? undefined);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to load meeting note")
        );
      } finally {
        setLoading(false);
      }
    };

    loadNote();
  }, [id]);

  return { note, loading, error };
}

export function useMeetingNoteMutation(): UseMeetingNoteMutationReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createNote = useCallback(async (data: MeetingNoteFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      if (env.features.useMockData) {
        await new Promise((r) => setTimeout(r, 300));
        return createMockMeetingNote(data);
      }
      return await createMeetingNoteApi(data);
    } catch (err) {
      const e = err instanceof Error ? err : new Error("Failed to create");
      setError(e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateNote = useCallback(
    async (id: string, data: MeetingNoteFormData) => {
      setIsLoading(true);
      setError(null);
      try {
        if (env.features.useMockData) {
          await new Promise((r) => setTimeout(r, 300));
          return updateMockMeetingNote(id, data);
        }
        return await updateMeetingNoteApi(id, data);
      } catch (err) {
        const e = err instanceof Error ? err : new Error("Failed to update");
        setError(e);
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { createNote, updateNote, isLoading, error };
}
