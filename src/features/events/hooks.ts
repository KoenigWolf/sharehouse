import { useEffect, useMemo, useState } from "react";
import { events as mockEvents } from "./mocks";
import type { EventInfo } from "./types";

export function useEvents() {
  const [events, setEvents] = useState<EventInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 200));
        setEvents(mockEvents);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load events"));
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const upcoming = useMemo(
    () => events.filter((e) => e.type === "upcoming").sort(sortByDateAsc),
    [events]
  );
  const past = useMemo(
    () => events.filter((e) => e.type === "past").sort(sortByDateDesc),
    [events]
  );

  return { events, upcoming, past, loading, error };
}

function sortByDateAsc(a: EventInfo, b: EventInfo) {
  return new Date(a.date).getTime() - new Date(b.date).getTime();
}

function sortByDateDesc(a: EventInfo, b: EventInfo) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}
