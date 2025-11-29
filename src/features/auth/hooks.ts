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
  if (!env.features.supabaseAvailable) {
    const unavailable = new Error(
      "Supabase is not configured; authentication is unavailable in this environment."
    );
    return {
      user: null,
      loading: false,
      signIn: async () => {
        throw unavailable;
      },
      signOut: async () => {
        throw unavailable;
      },
      isAuthenticated: false,
    };
  }

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: string, session: { user: User | null } | null) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
    },
    [supabase.auth]
  );

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  }, [supabase.auth]);

  return {
    user,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };
}
