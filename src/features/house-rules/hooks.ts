import { useEffect, useState } from "react";
import type { HouseRule } from "./types";
import { houseRules } from "./mocks";

export function useHouseRules() {
  const [rules, setRules] = useState<HouseRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 150));
        setRules(houseRules);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load rules"));
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, []);

  return { rules, loading, error };
}

export function useHouseRule(id: string | undefined) {
  const { rules, loading, error } = useHouseRules();
  const rule = rules.find((r) => r.id === id);
  return { rule, loading, error };
}
