import { useEffect, useState } from "react";
import { env } from "@/src/config";
import type { HouseRule } from "./types";
import { houseRules as mockHouseRules } from "./mocks";
import { fetchHouseRules as fetchHouseRulesApi, fetchHouseRule as fetchHouseRuleApi } from "./api";

export function useHouseRules() {
  const [rules, setRules] = useState<HouseRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadRules = async () => {
      try {
        setLoading(true);
        if (env.features.useMockData) {
          await new Promise((resolve) => setTimeout(resolve, 150));
          setRules(mockHouseRules);
        } else {
          const data = await fetchHouseRulesApi();
          setRules(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load rules"));
      } finally {
        setLoading(false);
      }
    };

    loadRules();
  }, []);

  return { rules, loading, error };
}

export function useHouseRule(id: string | undefined) {
  const [rule, setRule] = useState<HouseRule | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const loadRule = async () => {
      try {
        setLoading(true);
        if (env.features.useMockData) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          const found = mockHouseRules.find((r) => r.id === id);
          setRule(found);
        } else {
          const data = await fetchHouseRuleApi(id);
          setRule(data ?? undefined);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load rule"));
      } finally {
        setLoading(false);
      }
    };

    loadRule();
  }, [id]);

  return { rule, loading, error };
}
