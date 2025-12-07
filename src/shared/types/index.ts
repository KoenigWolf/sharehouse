/**
 * Shared Type Definitions
 * Domain models and common types used across features
 */

// ============================================
// Role Types
// ============================================

export type UserRole = "resident" | "accounting_admin" | "admin";

// ============================================
// Domain Models
// ============================================

export interface Resident {
  id: string;
  user_id: string;
  nickname: string;
  full_name?: string | null;
  bio?: string | null;
  room_number: string;
  floor: string;
  photo_url: string | null;
  move_in_date?: string | null;
  move_out_date?: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  room_number: string;
  floor: string;
  floor_plan_url: string | null;
  created_at: string;
}

export interface ResidentWithRoom extends Resident {
  room?: Room;
}

// ============================================
// API Types
// ============================================

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

// ============================================
// Form Types
// ============================================

export interface ProfileFormData {
  nickname: string;
  photo_url: string | null;
}

export interface LoginFormData {
  email: string;
  password: string;
}

// ============================================
// State Types
// ============================================

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface ListState<T> extends Omit<AsyncState<T[]>, "data"> {
  items: T[];
}

// ============================================
// UI Types
// ============================================

export type ModalPosition = "center" | "bottom";
