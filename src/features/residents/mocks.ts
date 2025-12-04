/**
 * Mock Data for Residents Feature
 * Used in development when Supabase is not available
 */

import type { ResidentWithRoom, Room, UserRole } from "@/src/shared/types";
import { FLOORS, ROOMS_PER_FLOOR } from "@/src/shared/constants";

// ============================================
// Sample Data
// ============================================

const SAMPLE_NICKNAMES = [
  "Taro", "Hanako", "Yuki", "Ken", "Sakura",
  "Ren", "Aoi", "Haru", "Sora", "Miki",
  "Ryo", "Mai", "Kota", "Yui", "Shin",
  "Aya", "Daiki", "Nana", "Kenji", "Emi",
  "Takumi", "Rina", "Yuto", "Moe", "Shota",
  "Kana", "Hayato", "Misaki", "Naoki", "Yuka",
  "Ryota", "Akari", "Kaito", "Hinata", "Soma",
  "Mana", "Haruki", "Koharu", "Yuma", "Saki",
] as const;

// ============================================
// Mock Data Generation
// ============================================

const TOTAL_RESIDENTS = FLOORS.length * ROOMS_PER_FLOOR;

export const mockResidents: ResidentWithRoom[] = Array.from(
  { length: TOTAL_RESIDENTS },
  (_, i) => {
    const floorIndex = Math.floor(i / ROOMS_PER_FLOOR);
    const roomIndex = (i % ROOMS_PER_FLOOR) + 1;
    const floor = FLOORS[floorIndex];
    const roomNumber = `${floorIndex + 1}0${roomIndex.toString().padStart(1, "0")}`;

    const room: Room = {
      id: `room-${i + 1}`,
      room_number: roomNumber,
      floor,
      floor_plan_url: null,
      created_at: new Date().toISOString(),
    };

    // Assign roles: first user is admin, second is accounting_admin, rest are residents
    const role: UserRole = i === 0 ? "admin" : i === 1 ? "accounting_admin" : "resident";

    return {
      id: `resident-${i + 1}`,
      user_id: `user-${i + 1}`,
      nickname: SAMPLE_NICKNAMES[i] || `Resident ${i + 1}`,
      room_number: roomNumber,
      floor,
      photo_url: null,
      move_in_date: new Date(2024, (i % 6) + 1, 5).toISOString().slice(0, 10),
      move_out_date: i % 5 === 0 ? new Date(2025, (i % 6) + 6, 15).toISOString().slice(0, 10) : null,
      role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      room,
    };
  }
);

export const mockRooms: Room[] = mockResidents.map((r) => r.room!);

// ============================================
// Mock Data Accessors
// ============================================

export function getMockResident(userId: string): ResidentWithRoom | null {
  return mockResidents.find((r) => r.user_id === userId) || mockResidents[0];
}

export function getMockResidentById(id: string): ResidentWithRoom | null {
  return mockResidents.find((r) => r.id === id) || null;
}

export function getMockRoom(roomNumber: string): Room | null {
  return mockRooms.find((r) => r.room_number === roomNumber) || null;
}

export function getMockResidents(): ResidentWithRoom[] {
  return mockResidents;
}
