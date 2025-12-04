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
      full_name: `Sample Name ${i + 1}`,
      bio: "好きな音楽とコーヒーで朝を迎えるのが日課。共有部の植物水やり当番を担当しています。",
      room_number: roomNumber,
      floor,
      photo_url: null,
      bio: "好きな音楽とコーヒーで朝を迎えるのが日課。共有部の植物水やり当番を担当しています。",
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

type ResidentOverride = Partial<Pick<ResidentWithRoom, "nickname" | "full_name" | "bio">>;

function getOverrides(): Record<string, ResidentOverride> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("resident_overrides");
    return raw ? (JSON.parse(raw) as Record<string, ResidentOverride>) : {};
  } catch (err) {
    console.warn("Failed to parse resident overrides", err);
    return {};
  }
}

export function saveResidentOverride(id: string, override: ResidentOverride) {
  if (typeof window === "undefined") return;
  const overrides = getOverrides();
  overrides[id] = { ...(overrides[id] || {}), ...override };
  localStorage.setItem("resident_overrides", JSON.stringify(overrides));
}

function applyOverride(resident: ResidentWithRoom): ResidentWithRoom {
  const overrides = getOverrides();
  const override = overrides[resident.id];
  if (!override) return resident;
  return { ...resident, ...override };
}

// ============================================
// Mock Data Accessors
// ============================================

export function getMockResident(userId: string): ResidentWithRoom | null {
  const res = mockResidents.find((r) => r.user_id === userId) || mockResidents[0];
  return res ? applyOverride(res) : res;
}

export function getMockResidentById(id: string): ResidentWithRoom | null {
  const res = mockResidents.find((r) => r.id === id) || null;
  return res ? applyOverride(res) : res;
}

export function getMockRoom(roomNumber: string): Room | null {
  return mockRooms.find((r) => r.room_number === roomNumber) || null;
}

export function getMockResidents(): ResidentWithRoom[] {
  return mockResidents.map(applyOverride);
}
