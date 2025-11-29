/**
 * Rooms API Service
 */

import { createClient } from "@/src/lib/supabase/client";
import type { Room } from "@/src/shared/types";

const supabase = createClient();

/**
 * Fetch a single room by room number
 */
export async function getRoom(roomNumber: string): Promise<Room | null> {
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
