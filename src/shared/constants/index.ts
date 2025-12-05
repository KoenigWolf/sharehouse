/**
 * Shared Constants
 * Application-wide constants and configuration values
 */

// Building Configuration
export const FLOORS = ["1F", "2F", "3F", "4F"] as const;
export const ALL_FLOORS = ["All", ...FLOORS] as const;
export const ROOMS_PER_FLOOR = 10;
export const TOTAL_ROOMS = FLOORS.length * ROOMS_PER_FLOOR;

// File Upload Limits
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
] as const;

// UI Configuration
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

// Validation
export const VALIDATION = {
  nickname: {
    minLength: 1,
    maxLength: 50,
  },
  roomNumber: {
    pattern: /^[1-4]0[1-9]$|^[1-4]10$/,
  },
} as const;

// Avatar Colors
export const AVATAR_COLORS = [
  "from-emerald-600 to-teal-500",
  "from-amber-500 to-orange-400",
  "from-teal-500 to-cyan-400",
  "from-rose-500 to-amber-400",
  "from-lime-500 to-emerald-500",
  "from-blue-500 to-sky-400",
  "from-slate-800 to-emerald-600",
  "from-cyan-500 to-teal-500",
] as const;

// Type exports
export type Floor = (typeof FLOORS)[number];
export type AllFloors = (typeof ALL_FLOORS)[number];
export type AvatarColor = (typeof AVATAR_COLORS)[number];
