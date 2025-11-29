/**
 * Residents API Service
 * Data access layer for resident operations
 */

import { createClient } from "@/src/lib/supabase/client";
import type { Resident, ResidentWithRoom } from "@/src/shared/types";
import type { UpdateResidentData } from "./types";

const supabase = createClient();

// ============================================
// Read Operations
// ============================================

/**
 * Fetch all residents with their room information
 */
export async function getResidents(): Promise<ResidentWithRoom[]> {
  const { data, error } = await supabase
    .from("residents")
    .select(`
      *,
      room:rooms(*)
    `)
    .order("room_number", { ascending: true });

  if (error) {
    throw error;
  }

  return data as ResidentWithRoom[];
}

/**
 * Fetch a single resident by user ID
 */
export async function getResidentByUserId(
  userId: string
): Promise<ResidentWithRoom | null> {
  const { data, error } = await supabase
    .from("residents")
    .select(`
      *,
      room:rooms(*)
    `)
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw error;
  }

  return data as ResidentWithRoom;
}

// ============================================
// Write Operations
// ============================================

/**
 * Update resident profile
 */
export async function updateResident(
  residentId: string,
  updates: UpdateResidentData
): Promise<Resident> {
  const { data, error } = await supabase
    .from("residents")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", residentId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Resident;
}

// ============================================
// Storage Operations
// ============================================

/**
 * Upload resident photo
 */
export async function uploadPhoto(
  userId: string,
  file: File
): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `photos/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("resident-photos")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    throw uploadError;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("resident-photos").getPublicUrl(filePath);

  return publicUrl;
}

/**
 * Delete resident photo
 */
export async function deletePhoto(photoUrl: string): Promise<void> {
  const path = photoUrl.split("/resident-photos/")[1];
  if (!path) return;

  const { error } = await supabase.storage
    .from("resident-photos")
    .remove([path]);

  if (error) {
    throw error;
  }
}

// ============================================
// Realtime
// ============================================

/**
 * Subscribe to resident changes
 */
export function subscribeToResidents(
  callback: (residents: ResidentWithRoom[]) => void
) {
  const channel = supabase
    .channel("residents-changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "residents",
      },
      async () => {
        const residents = await getResidents();
        callback(residents);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
