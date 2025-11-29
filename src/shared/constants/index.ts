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
  "from-violet-500 to-purple-500",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-amber-500",
  "from-pink-500 to-rose-500",
  "from-indigo-500 to-blue-500",
  "from-fuchsia-500 to-pink-500",
  "from-cyan-500 to-blue-500",
] as const;

// Type exports
export type Floor = (typeof FLOORS)[number];
export type AllFloors = (typeof ALL_FLOORS)[number];
export type AvatarColor = (typeof AVATAR_COLORS)[number];
