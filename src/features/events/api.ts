import { createClient } from "@/src/lib/supabase/client";
import type { EventInfo } from "./types";

interface EventRow {
  id: string;
  title: string;
  date: string;
  location: string | null;
  description: string | null;
  cover_image_url: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

function mapRowToEvent(row: EventRow): EventInfo {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(row.date);

  return {
    id: row.id,
    title: row.title,
    date: row.date,
    location: row.location ?? "",
    description: row.description ?? "",
    coverImage: row.cover_image_url,
    tags: row.tags ?? [],
    type: eventDate >= today ? "upcoming" : "past",
  };
}

export async function fetchEvents(): Promise<EventInfo[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRowToEvent);
}

export async function fetchEvent(id: string): Promise<EventInfo | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data ? mapRowToEvent(data) : null;
}
