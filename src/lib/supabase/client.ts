/**
 * Supabase Browser Client
 * Use this client in React components (client-side)
 */

import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/src/config/env";

let client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (client) return client;

  if (!env.supabase.url || !env.supabase.anonKey) {
    throw new Error(
      "Supabase client requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  client = createBrowserClient(env.supabase.url, env.supabase.anonKey);

  return client;
}

export type SupabaseClient = ReturnType<typeof createClient>;
