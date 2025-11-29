/**
 * Auth Feature Types
 */

import type { User } from "@supabase/supabase-js";

// ============================================
// Component Props
// ============================================

export interface LoginFormProps {
  onSuccess?: () => void;
}

// ============================================
// Hook Return Types
// ============================================

export interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}
