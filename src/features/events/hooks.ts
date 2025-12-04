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

  const thisMonth = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    return events.filter((e) => {
      const eventDate = new Date(e.date);
      return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
    });
  }, [events]);

  return { events, upcoming, past, thisMonth, loading, error };
}

export function useEvent(id: string) {
  const [event, setEvent] = useState<EventInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 150));
        const found = mockEvents.find((e) => e.id === id);
        if (!found) {
          setError(new Error("Event not found"));
        } else {
          setEvent(found);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load event"));
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  return { event, loading, error };
}

function sortByDateAsc(a: EventInfo, b: EventInfo) {
  return new Date(a.date).getTime() - new Date(b.date).getTime();
}

function sortByDateDesc(a: EventInfo, b: EventInfo) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}
