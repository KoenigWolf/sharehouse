/**
 * Rooms Feature Types
 */

import type { Room } from "@/src/shared/types";

// ============================================
// Component Props
// ============================================

export interface FloorPlanModalProps {
  roomNumber: string | null;
  onClose: () => void;
}

// ============================================
// Hook Return Types
// ============================================

export interface UseRoomReturn {
  room: Room | null;
  loading: boolean;
  error: Error | null;
}
