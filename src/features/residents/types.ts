/**
 * Residents Feature Types
 */

import type { ResidentWithRoom, UserRole } from "@/src/shared/types";

// ============================================
// Component Props
// ============================================

export interface ResidentCardProps {
  resident: ResidentWithRoom;
  onRoomClick?: (roomNumber: string) => void;
  onSelect?: (id: string) => void;
  index?: number;
}

export interface ResidentGridProps {
  residents: ResidentWithRoom[];
  onRoomClick?: (roomNumber: string) => void;
  onSelect?: (id: string) => void;
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

export interface UseResidentReturn {
  resident: ResidentWithRoom | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export interface UsePermissionReturn {
  currentResident: ResidentWithRoom | null;
  loading: boolean;
  error: Error | null;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  isAccountingAdmin: boolean;
  isAdmin: boolean;
}

// ============================================
// Service Types
// ============================================

export interface UpdateResidentData {
  nickname?: string;
  photo_url?: string | null;
}
