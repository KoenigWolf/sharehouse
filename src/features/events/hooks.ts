import { useEffect, useMemo, useState } from "react";
import { env } from "@/src/config";
import { events as mockEvents } from "./mocks";
import { fetchEvents as fetchEventsApi, fetchEvent as fetchEventApi } from "./api";
import type { EventInfo } from "./types";

export function useEvents() {
  const [events, setEvents] = useState<EventInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        if (env.features.useMockData) {
          await new Promise((resolve) => setTimeout(resolve, 200));
          setEvents(mockEvents);
        } else {
          const data = await fetchEventsApi();
          setEvents(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load events"));
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
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
    const loadEvent = async () => {
      try {
        setLoading(true);
        if (env.features.useMockData) {
          await new Promise((resolve) => setTimeout(resolve, 150));
          const found = mockEvents.find((e) => e.id === id);
          if (!found) {
            setError(new Error("Event not found"));
          } else {
            setEvent(found);
          }
        } else {
          const data = await fetchEventApi(id);
          if (!data) {
            setError(new Error("Event not found"));
          } else {
            setEvent(data);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load event"));
      } finally {
        setLoading(false);
      }
    };
    loadEvent();
  }, [id]);

  return { event, loading, error };
}

function sortByDateAsc(a: EventInfo, b: EventInfo) {
  return new Date(a.date).getTime() - new Date(b.date).getTime();
}

function sortByDateDesc(a: EventInfo, b: EventInfo) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}
