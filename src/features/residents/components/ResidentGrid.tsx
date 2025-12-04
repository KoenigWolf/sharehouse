"use client";

/**
 * Resident Grid Component
 * Displays a grid of residents with filtering and search
 *
 * Grid responsive breakpoints:
 * - xs (< 480px): 2 columns
 * - sm (480px - 640px): 3 columns
 * - md (640px - 768px): 4 columns
 * - lg (768px - 1024px): 5 columns
 * - xl (1280px+): 5 columns (max)
 */

import { useState, useMemo, useCallback, memo } from "react";
import { cn } from "@/src/lib/utils";
import { SkeletonCard } from "@/src/shared/ui";
import { ALL_FLOORS, type AllFloors } from "@/src/shared/constants";
import { useLanguage } from "@/src/shared/lang/context";
import { ResidentCard } from "./ResidentCard";
import type { ResidentGridProps } from "../types";
import { Search, X, Users } from "lucide-react";

const gridStyles = cn(
  // Base grid with auto-fit for fluid responsiveness
  "grid gap-2.5 xs:gap-3 sm:gap-4 lg:gap-5 xl:gap-6",
  // Responsive columns - max 5 columns
  "grid-cols-2",                    // < 480px: 2 columns
  "xs:grid-cols-3",                 // 480px+: 3 columns
  "sm:grid-cols-3",                 // 640px+: 3 columns
  "md:grid-cols-4",                 // 768px+: 4 columns
  "lg:grid-cols-5"                  // 1024px+: 5 columns (max)
);

export const ResidentGrid = memo(function ResidentGrid({
  residents,
  onRoomClick,
  isLoading,
}: ResidentGridProps) {
  const [selectedFloor, setSelectedFloor] = useState<AllFloors>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter residents with optimized memoization
  const filteredResidents = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    return residents.filter((resident) => {
      const matchesFloor =
        selectedFloor === "All" || resident.floor === selectedFloor;
      if (!matchesFloor) return false;

      if (!searchQuery) return true;

      return (
        resident.nickname.toLowerCase().includes(searchLower) ||
        resident.room_number.includes(searchQuery)
      );
    });
  }, [residents, selectedFloor, searchQuery]);

  // Calculate floor counts
  const floorCounts = useMemo(() => {
    const counts: Record<string, number> = { All: residents.length };
    for (const r of residents) {
      counts[r.floor] = (counts[r.floor] || 0) + 1;
    }
    return counts;
  }, [residents]);

  // Callbacks for child components
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchQuery("");
  }, []);

  const handleClearAll = useCallback(() => {
    setSearchQuery("");
    setSelectedFloor("All");
  }, []);

  // Loading state
  if (isLoading) {
    return <ResidentGridSkeleton />;
  }

  return (
    <section
      className="space-y-3 xs:space-y-4 sm:space-y-5"
      aria-label="Resident directory"
    >
      {/* Filter Bar - Floor tabs and Search in one row */}
      <div
        className={cn(
          "flex flex-col gap-2.5 xs:gap-3",
          "sm:flex-row sm:items-center sm:justify-between"
        )}
        role="search"
      >
        {/* Floor Tabs */}
        <FloorTabs
          floors={ALL_FLOORS}
          selectedFloor={selectedFloor}
          floorCounts={floorCounts}
          onSelect={setSelectedFloor}
        />

        {/* Search Input */}
        <SearchInput
          value={searchQuery}
          onChange={handleSearchChange}
          onClear={handleSearchClear}
          resultCount={searchQuery ? filteredResidents.length : undefined}
        />
      </div>

      {/* Grid */}
      {filteredResidents.length === 0 ? (
        <EmptyState searchQuery={searchQuery} onClear={handleClearAll} />
      ) : (
        <div className={gridStyles} id="resident-grid">
          {filteredResidents.map((resident, index) => (
            <ResidentCard
              key={resident.id}
              resident={resident}
              onRoomClick={onRoomClick}
              index={index}
            />
          ))}
        </div>
      )}
    </section>
  );
});

interface FloorTabsProps {
  floors: readonly AllFloors[];
  selectedFloor: AllFloors;
  floorCounts: Record<string, number>;
  onSelect: (floor: AllFloors) => void;
}

const FloorTabs = memo(function FloorTabs({
  floors,
  selectedFloor,
  floorCounts,
  onSelect,
}: FloorTabsProps) {
  return (
    <nav
      className={cn(
        "flex gap-1 xs:gap-1.5",
        "overflow-x-auto pb-1 -mx-4 px-4",
        "sm:mx-0 sm:px-0 sm:pb-0",
        "scrollbar-hide"
      )}
      role="tablist"
      aria-label="Filter by floor"
    >
      {floors.map((floor) => {
        const isSelected = selectedFloor === floor;
        return (
          <button
            key={floor}
            onClick={() => onSelect(floor)}
            role="tab"
            aria-selected={isSelected}
            aria-controls="resident-grid"
            className={cn(
              // Base styles
              "px-2.5 xs:px-3 py-1.5 xs:py-2",
              "rounded-lg text-xs xs:text-sm font-medium",
              "transition-all duration-200",
              "flex-shrink-0",
              "active:scale-95",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
              // Touch target
              "min-h-[36px] xs:min-h-[40px]",
              // Selected state
              isSelected
                ? cn(
                    "bg-indigo-600 text-white",
                    "shadow-md shadow-indigo-500/25"
                  )
                : cn(
                    "bg-slate-100 dark:bg-slate-800",
                    "text-slate-600 dark:text-slate-300",
                    "hover:bg-slate-200 dark:hover:bg-slate-700"
                  )
            )}
          >
            <span>{floor}</span>
            <span
              className={cn(
                "ml-1 text-[10px] xs:text-xs tabular-nums",
                isSelected
                  ? "text-indigo-200"
                  : "text-slate-400 dark:text-slate-500"
              )}
            >
              {floorCounts[floor] || 0}
            </span>
          </button>
        );
      })}
    </nav>
  );
});

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  resultCount?: number;
}

const SearchInput = memo(function SearchInput({
  value,
  onChange,
  onClear,
  resultCount,
}: SearchInputProps) {
  const { lang } = useLanguage();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <div className="relative flex items-center gap-2">
      <div className="relative flex-1 sm:flex-none">
        <label htmlFor="resident-search" className="sr-only">
          {lang.components.residentGrid.searchPlaceholder}
        </label>
        <Search
          className="absolute left-2.5 xs:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 xs:w-4 xs:h-4 text-slate-400 pointer-events-none"
          strokeWidth={2}
          aria-hidden="true"
        />
        <input
          id="resident-search"
          type="search"
          inputMode="search"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder={lang.components.residentGrid.searchPlaceholder}
          value={value}
          onChange={handleChange}
          className={cn(
            "w-full sm:w-48 lg:w-56",
            "pl-8 xs:pl-9 pr-8 py-2 xs:py-2.5",
            "rounded-lg text-xs xs:text-sm",
            "bg-slate-100 dark:bg-slate-800",
            "border-0",
            "text-slate-800 dark:text-slate-200",
            "placeholder-slate-400 dark:placeholder-slate-500",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
            "transition-all duration-200",
            // Ensure proper touch target
            "min-h-[40px]"
          )}
        />
        {value && (
          <button
            type="button"
            onClick={onClear}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2",
              "p-1 xs:p-1.5",
              "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300",
              "rounded-full hover:bg-slate-200 dark:hover:bg-slate-700",
              "transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            )}
            aria-label={lang.components.residentGrid.clearFilters}
          >
            <X className="w-3.5 h-3.5 xs:w-4 xs:h-4" strokeWidth={2.5} />
          </button>
        )}
      </div>
      {resultCount !== undefined && (
        <span
          className="text-[10px] xs:text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap tabular-nums"
          aria-live="polite"
          aria-atomic="true"
        >
          {resultCount}
          <span className="hidden xs:inline">件</span>
        </span>
      )}
    </div>
  );
});

interface EmptyStateProps {
  searchQuery: string;
  onClear: () => void;
}

const EmptyState = memo(function EmptyState({
  searchQuery,
  onClear,
}: EmptyStateProps) {
  const { lang } = useLanguage();
  return (
    <div
      className="text-center py-8 xs:py-10 sm:py-12 lg:py-16 animate-fade-in"
      role="status"
      aria-live="polite"
    >
      <div
        className={cn(
          "inline-flex items-center justify-center",
          "w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16",
          "rounded-full bg-slate-100 dark:bg-slate-800 mb-3 sm:mb-4"
        )}
        aria-hidden="true"
      >
        <Users className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 text-slate-400" strokeWidth={1.5} />
      </div>
      <h3 className="text-sm xs:text-base sm:text-lg font-medium text-slate-800 dark:text-slate-200">
        {lang.components.residentGrid.emptyTitle}
      </h3>
      <p className="mt-1 text-xs xs:text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
        {searchQuery
          ? lang.components.residentGrid.emptyDescriptionSearch
          : lang.components.residentGrid.emptyDescriptionDefault}
      </p>
      {searchQuery && (
        <button
          onClick={onClear}
          className={cn(
            "mt-3 sm:mt-4",
            "px-4 py-2",
            "text-xs xs:text-sm text-indigo-600 dark:text-indigo-400",
            "hover:underline active:text-indigo-700",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
            "min-h-[40px]"
          )}
        >
          {lang.components.residentGrid.clearFilters}
        </button>
      )}
    </div>
  );
});

const ResidentGridSkeleton = memo(function ResidentGridSkeleton() {
  return (
    <div
      className="space-y-3 xs:space-y-4 sm:space-y-5"
      role="status"
      aria-label="Loading residents"
    >
      {/* Filter bar skeleton */}
      <div
        className={cn(
          "flex flex-col gap-2.5 xs:gap-3",
          "sm:flex-row sm:items-center sm:justify-between"
        )}
      >
        <div
          className={cn(
            "flex gap-1.5 xs:gap-2",
            "overflow-x-auto pb-1 -mx-4 px-4",
            "sm:mx-0 sm:px-0 sm:pb-0",
            "scrollbar-hide"
          )}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="skeleton h-9 xs:h-10 w-14 xs:w-16 sm:w-20 rounded-lg flex-shrink-0"
            />
          ))}
        </div>
        <div className="skeleton h-10 w-full sm:w-48 lg:w-56 rounded-lg" />
      </div>

      {/* Grid skeleton - matches actual grid layout */}
      <div className={gridStyles}>
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
});

