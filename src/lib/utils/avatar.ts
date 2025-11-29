/**
 * Avatar Utilities
 * Functions for generating avatar colors and initials
 */

import { AVATAR_COLORS } from "@/src/shared/constants";

/**
 * Generate consistent color based on name
 * Same name always produces the same color
 */
export function getAvatarColor(name: string): string {
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

/**
 * Get initials from a name
 * "John Doe" -> "JD"
 * "Taro" -> "TA"
 */
export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);

  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  return name.slice(0, 2).toUpperCase();
}
