/**
 * Auth API Service
 */

import { createClient } from "@/src/lib/supabase/client";
import { env } from "@/src/config";

let supabaseClient: ReturnType<typeof createClient> | null = null;

const getSupabase = () => {
  if (!env.features.supabaseAvailable) {
    throw new Error("Supabase is not configured; auth API cannot be used.");
  }
  if (!supabaseClient) {
    supabaseClient = createClient();
  }
  return supabaseClient;
};

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Sign out current user
 */
export async function signOut() {
  const supabase = getSupabase();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  const supabase = getSupabase();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return user;
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(
  callback: (event: string, session: unknown) => void
) {
  const supabase = getSupabase();
  return supabase.auth.onAuthStateChange(callback);
}
