"use client";

/**
 * Residents Feature Hooks
 */

import { useEffect, useState, useCallback } from "react";
import { env } from "@/src/config";
import type { ResidentWithRoom } from "@/src/shared/types";
import type { UseResidentsReturn, UseCurrentResidentReturn, UseResidentReturn } from "./types";
import { getMockResidents, getMockResident, getMockResidentById } from "./mocks";

// ============================================
// useResidents
// ============================================

/**
 * Hook to fetch and manage all residents
 */
export function useResidents(): UseResidentsReturn {
  const [residents, setResidents] = useState<ResidentWithRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchResidents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (env.features.useMockData) {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        setResidents(getMockResidents());
      } else {
        const { getResidents, subscribeToResidents } = await import("./api");
        const data = await getResidents();
        setResidents(data);

        // Subscribe to realtime updates
        subscribeToResidents((updatedResidents) => {
          setResidents(updatedResidents);
        });
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch residents")
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResidents();
  }, [fetchResidents]);

  return {
    residents,
    loading,
    error,
    refetch: fetchResidents,
  };
}

// ============================================
// useCurrentResident
// ============================================

/**
 * Hook to fetch the current user's resident profile
 */
export function useCurrentResident(
  userId: string | undefined
): UseCurrentResidentReturn {
  const [resident, setResident] = useState<ResidentWithRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchResident = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (env.features.useMockData) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setResident(getMockResident(userId || "user-1"));
      } else {
        if (!userId) {
          setLoading(false);
          return;
        }
        const { getResidentByUserId } = await import("./api");
        const data = await getResidentByUserId(userId);
        setResident(data);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch resident")
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchResident();
  }, [fetchResident]);

  return {
    resident,
    loading,
    error,
    refetch: fetchResident,
  };
}

// ============================================
// useResident
// ============================================

/**
 * Hook to fetch a resident by ID
 */
export function useResident(id: string | undefined): UseResidentReturn {
  const [resident, setResident] = useState<ResidentWithRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchResident = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (env.features.useMockData) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setResident(getMockResidentById(id));
      } else {
        const { getResidentById } = await import("./api");
        const data = await getResidentById(id);
        setResident(data);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch resident")
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchResident();
  }, [fetchResident]);

  return {
    resident,
    loading,
    error,
    refetch: fetchResident,
  };
}
