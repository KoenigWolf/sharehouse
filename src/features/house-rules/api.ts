import { createClient } from "@/src/lib/supabase/client";
import type { HouseRule } from "./types";

interface HouseRuleRow {
  id: string;
  title: string;
  description: string;
  category: "living" | "cleaning" | "noise" | "safety" | "other";
  details: string | null;
  effective_from: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

function mapRowToHouseRule(row: HouseRuleRow): HouseRule {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    details: row.details ?? undefined,
    effectiveFrom: row.effective_from ?? undefined,
  };
}

export async function fetchHouseRules(): Promise<HouseRule[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("house_rules")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapRowToHouseRule);
}

export async function fetchHouseRule(id: string): Promise<HouseRule | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("house_rules")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data ? mapRowToHouseRule(data) : null;
}
