/**
 * Residents Feature Types
 */

import type { ResidentWithRoom } from "@/src/shared/types";

// ============================================
// Component Props
// ============================================

export interface ResidentCardProps {
  resident: ResidentWithRoom;
  onRoomClick?: (roomNumber: string) => void;
  index?: number;
}

export interface ResidentGridProps {
  residents: ResidentWithRoom[];
  onRoomClick?: (roomNumber: string) => void;
  isLoading?: boolean;
}

export interface ProfileFormProps {
  resident: ResidentWithRoom;
  onSuccess?: () => void;
}

// ============================================
// Hook Return Types
// ============================================

export interface UseResidentsReturn {
  residents: ResidentWithRoom[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export interface UseCurrentResidentReturn {
  resident: ResidentWithRoom | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// ============================================
// Service Types
// ============================================

export interface UpdateResidentData {
  nickname?: string;
  photo_url?: string | null;
}
