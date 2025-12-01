"use client";

/**
 * Route Preloader Component
 * Prefetches all app routes on mount for instant navigation
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ROUTES_TO_PREFETCH = [
  "/",
  "/meetings",
  "/events",
  "/house-rules",
  "/notices",
  "/accounting",
  "/accounting/manage",
  "/settings",
  "/profile/edit",
] as const;

export function RoutePreloader() {
  const router = useRouter();

  useEffect(() => {
    // Prefetch all routes after initial render
    const prefetchRoutes = () => {
      ROUTES_TO_PREFETCH.forEach((route) => {
        router.prefetch(route);
      });
    };

    // Use requestIdleCallback for non-blocking prefetch
    if ("requestIdleCallback" in window) {
      requestIdleCallback(prefetchRoutes, { timeout: 2000 });
    } else {
      // Fallback for Safari
      setTimeout(prefetchRoutes, 100);
    }
  }, [router]);

  return null;
}
