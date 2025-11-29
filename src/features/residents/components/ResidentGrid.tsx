"use client";

/**
 * Resident Grid Component
 * Displays a grid of residents with filtering and search
 */

import { useState, useMemo } from "react";
import { cn } from "@/src/lib/utils";
import { SkeletonCard } from "@/src/shared/ui";
import { ALL_FLOORS, type AllFloors } from "@/src/shared/constants";
import { t } from "@/src/shared/lang";
import { ResidentCard } from "./ResidentCard";
import type { ResidentGridProps } from "../types";

// ============================================
// Component
// ============================================

export function ResidentGrid({
  residents,
  onRoomClick,
  isLoading,
}: ResidentGridProps) {
  const [selectedFloor, setSelectedFloor] = useState<AllFloors>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter residents
  const filteredResidents = useMemo(() => {
    return residents.filter((resident) => {
      const matchesFloor =
        selectedFloor === "All" || resident.floor === selectedFloor;
      const matchesSearch =
        searchQuery === "" ||
        resident.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resident.room_number.includes(searchQuery);
      return matchesFloor && matchesSearch;
    });
  }, [residents, selectedFloor, searchQuery]);

  // Calculate floor counts
  const floorCounts = useMemo(() => {
    const counts: Record<string, number> = { All: residents.length };
    residents.forEach((r) => {
      counts[r.floor] = (counts[r.floor] || 0) + 1;
    });
    return counts;
  }, [residents]);

  // Loading state
  if (isLoading) {
    return <ResidentGridSkeleton />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col gap-3 sm:gap-4">
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
          onChange={setSearchQuery}
          onClear={() => setSearchQuery("")}
        />
      </div>

      {/* Results count */}
      {searchQuery && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t.components.residentGrid.searchResult(filteredResidents.length)}
        </p>
      )}

      {/* Grid */}
      {filteredResidents.length === 0 ? (
        <EmptyState
          searchQuery={searchQuery}
          onClear={() => {
            setSearchQuery("");
            setSelectedFloor("All");
          }}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
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
    </div>
  );
}

// ============================================
// Sub-components
// ============================================

interface FloorTabsProps {
  floors: readonly AllFloors[];
  selectedFloor: AllFloors;
  floorCounts: Record<string, number>;
  onSelect: (floor: AllFloors) => void;
}

function FloorTabs({
  floors,
  selectedFloor,
  floorCounts,
  onSelect,
}: FloorTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 sm:flex-wrap scrollbar-hide">
      {floors.map((floor) => (
        <button
          key={floor}
          onClick={() => onSelect(floor)}
          className={cn(
            "px-3 sm:px-4 py-2 rounded-full text-sm font-medium",
            "transition-all duration-200 flex-shrink-0 active:scale-95",
            "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
            selectedFloor === floor
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
              : cn(
                  "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300",
                  "hover:bg-slate-50 dark:hover:bg-slate-700",
                  "border border-slate-200 dark:border-slate-700"
                )
          )}
        >
          {floor}
          <span
            className={cn(
              "ml-1 sm:ml-1.5 text-xs",
              selectedFloor === floor
                ? "text-indigo-200"
                : "text-slate-400 dark:text-slate-500"
            )}
          >
            ({floorCounts[floor] || 0})
          </span>
        </button>
      ))}
    </div>
  );
}

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

function SearchInput({ value, onChange, onClear }: SearchInputProps) {
  return (
    <div className="relative">
      <label htmlFor="resident-search" className="sr-only">
        {t.components.residentGrid.searchPlaceholder}
      </label>
      <SearchIcon className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
      <input
        id="resident-search"
        type="text"
        placeholder={t.components.residentGrid.searchPlaceholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full sm:w-72 pl-10 sm:pl-12 pr-10 py-3 rounded-xl",
          "bg-white dark:bg-slate-800",
          "border border-slate-200 dark:border-slate-700",
          "text-slate-800 dark:text-slate-200 placeholder-slate-400",
          "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
          "transition-all duration-200 text-base"
        )}
      />
      {value && (
        <button
          onClick={onClear}
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 p-1",
            "text-slate-400 hover:text-slate-600",
            "rounded-full hover:bg-slate-100 dark:hover:bg-slate-700",
            "transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          )}
          aria-label={t.components.residentGrid.clearFilters}
        >
          <CloseIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  searchQuery: string;
  onClear: () => void;
}

function EmptyState({ searchQuery, onClear }: EmptyStateProps) {
  return (
    <div className="text-center py-12 sm:py-16 animate-fade-in">
      <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
        <UsersIcon className="w-7 h-7 sm:w-8 sm:h-8 text-slate-400" />
      </div>
      <h3 className="text-base sm:text-lg font-medium text-slate-800 dark:text-slate-200">
        {t.components.residentGrid.emptyTitle}
      </h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {searchQuery
          ? t.components.residentGrid.emptyDescriptionSearch
          : t.components.residentGrid.emptyDescriptionDefault}
      </p>
      {searchQuery && (
        <button
          onClick={onClear}
          className="mt-4 text-sm text-indigo-600 dark:text-indigo-400 hover:underline active:text-indigo-700"
        >
          {t.components.residentGrid.clearFilters}
        </button>
      )}
    </div>
  );
}

function ResidentGridSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 sm:flex-wrap scrollbar-hide">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-10 w-16 sm:w-20 rounded-full flex-shrink-0" />
          ))}
        </div>
        <div className="skeleton h-12 w-full sm:w-64 rounded-xl" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

// ============================================
// Icons
// ============================================

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
}
