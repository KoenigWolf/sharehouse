/**
 * Supabase barrel export
 */
export { createClient, type SupabaseClient } from "./client";
export { createClient as createServerClient } from "./server";
export { updateSession } from "./middleware";
