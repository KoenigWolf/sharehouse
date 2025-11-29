/**
 * Rooms API Service
 */

import { createClient } from "@/src/lib/supabase/client";
import { env } from "@/src/config";
import type { Room } from "@/src/shared/types";

let supabaseClient: ReturnType<typeof createClient> | null = null;

const getSupabase = () => {
  if (!env.features.supabaseAvailable) {
    throw new Error("Supabase is not configured; enable it to fetch rooms.");
  }
  if (!supabaseClient) {
    supabaseClient = createClient();
  }
  return supabaseClient;
};

/**
 * Fetch a single room by room number
 */
export async function getRoom(roomNumber: string): Promise<Room | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("room_number", roomNumber)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw error;
  }

  return data as Room;
}
