import { useEffect, useState, useCallback } from "react";
import { env } from "@/src/config";
import type { UseAccountingReturn, MonthlyStatement } from "./types";
import { mockStatements } from "./mocks";
import { fetchAccountingStatements } from "./api";

export function useAccounting(): UseAccountingReturn {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [statements, setStatements] = useState<MonthlyStatement[]>([]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      if (env.features.useMockData) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setStatements(mockStatements);
      } else {
        const data = await fetchAccountingStatements();
        setStatements(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load accounting data"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { statements, loading, error };
}
