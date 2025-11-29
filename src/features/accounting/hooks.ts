import { useEffect, useState } from "react";
import type { UseAccountingReturn } from "./types";
import { mockStatements } from "./mocks";

export function useAccounting(): UseAccountingReturn {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [statements, setStatements] = useState(mockStatements);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 200));
        setStatements(mockStatements);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load accounting data"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { statements, loading, error };
}
