"use client";

/**
 * NavigationProgress Component
 * Shows a progress bar at the top of the page during navigation
 */

import { useEffect, useState, useCallback, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/src/lib/utils";

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate progress during navigation
  const startProgress = useCallback(() => {
    setIsNavigating(true);
    setProgress(0);

    // Clear any existing interval
    if (progressRef.current) {
      clearInterval(progressRef.current);
    }

    // Simulate progress with diminishing increments
    let currentProgress = 0;
    progressRef.current = setInterval(() => {
      currentProgress += (90 - currentProgress) * 0.1;
      setProgress(Math.min(currentProgress, 90));
    }, 100);
  }, []);

  const completeProgress = useCallback(() => {
    if (progressRef.current) {
      clearInterval(progressRef.current);
      progressRef.current = null;
    }

    setProgress(100);

    // Hide after animation completes
    setTimeout(() => {
      setIsNavigating(false);
      setProgress(0);
    }, 300);
  }, []);

  // Listen for navigation events
  useEffect(() => {
    const handleStart = () => startProgress();

    // Listen for click events on links
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (anchor && anchor.href) {
        const url = new URL(anchor.href, window.location.origin);
        const currentUrl = new URL(window.location.href);

        // Check if it's an internal navigation
        if (
          url.origin === currentUrl.origin &&
          url.pathname !== currentUrl.pathname
        ) {
          handleStart();
        }
      }
    };

    document.addEventListener("click", handleClick, { capture: true });

    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
      if (progressRef.current) {
        clearInterval(progressRef.current);
      }
    };
  }, [startProgress]);

  // Complete progress when pathname changes
  useEffect(() => {
    completeProgress();
  }, [pathname, searchParams, completeProgress]);

  if (!isNavigating && progress === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] pointer-events-none",
        "transition-opacity duration-300",
        isNavigating ? "opacity-100" : "opacity-0"
      )}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading page"
    >
      {/* Background track */}
      <div className="h-0.5 bg-slate-200/50 dark:bg-slate-800/50">
        {/* Progress bar */}
        <div
          className={cn(
            "h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
            "transition-transform duration-200 ease-out",
            "shadow-lg shadow-indigo-500/50"
          )}
          style={{
            transform: `translateX(-${100 - progress}%)`,
          }}
        />
      </div>

      {/* Glow effect */}
      <div
        className={cn(
          "absolute right-0 top-0 h-0.5 w-24",
          "bg-gradient-to-l from-white/80 to-transparent",
          "opacity-75"
        )}
        style={{
          transform: `translateX(-${100 - progress}%)`,
        }}
      />
    </div>
  );
}
