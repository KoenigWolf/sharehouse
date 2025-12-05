"use client";

/**
 * Auth Feature Hooks
 */

import { useEffect, useState, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/src/lib/supabase/client";
import { env } from "@/src/config";
import type { UseAuthReturn } from "./types";

// ============================================
// useAuth
// ============================================

/**
 * Hook to manage authentication state
 */
export function useAuth(): UseAuthReturn {
  const supabaseAvailable = env.features.supabaseAvailable;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(supabaseAvailable);
  const supabase = supabaseAvailable ? createClient() : null;

  useEffect(() => {
    if (!supabase || !supabaseAvailable) return;

    let active = true;
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!active) return;
      setUser(user);
      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: string, session: { user: User | null } | null) => {
        if (!active) return;
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase, supabaseAvailable]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!supabaseAvailable || !supabase) {
        throw new Error("Supabase is not configured; authentication is unavailable in this environment.");
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
    },
    [supabase, supabaseAvailable]
  );

  const signOut = useCallback(async () => {
    if (!supabaseAvailable || !supabase) {
      throw new Error("Supabase is not configured; authentication is unavailable in this environment.");
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  }, [supabase, supabaseAvailable]);

  return {
    user,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };
}
