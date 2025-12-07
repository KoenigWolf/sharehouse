/**
 * Residents Feature barrel export
 *
 * Usage:
 * import { ResidentCard, ResidentGrid, useResidents } from "@/src/features/residents";
 */

// Components
export { ResidentCard, ResidentGrid, ProfileForm, ResidentDetailSheet } from "./components";

// Hooks
export { useResidents, useCurrentResident, useResident, usePermission } from "./hooks";

// Types
export type {
  ResidentCardProps,
  ResidentGridProps,
  ProfileFormProps,
  UseResidentsReturn,
  UseCurrentResidentReturn,
  UseResidentReturn,
  UsePermissionReturn,
} from "./types";

// Mocks (for testing and development)
export { mockResidents, getMockResident, getMockRoom } from "./mocks";
