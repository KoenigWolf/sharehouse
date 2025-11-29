"use client";

/**
 * Home Page
 * Displays the resident directory with filtering and search
 */

import { useState } from "react";
import { PageContainer } from "@/src/shared/layouts";
import { ResidentGrid, useResidents } from "@/src/features/residents";
import { FloorPlanModal } from "@/src/features/rooms";

// ============================================
// Component
// ============================================

export default function HomePage() {
  const { residents, loading, error } = useResidents();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Page Header */}
        <PageHeader residentCount={residents.length} />

        {/* Main Content */}
        {error ? (
          <ErrorState message={error.message} />
        ) : (
          <ResidentGrid
            residents={residents}
            isLoading={loading}
            onRoomClick={setSelectedRoom}
          />
        )}
      </div>

      {/* Floor Plan Modal */}
      <FloorPlanModal
        roomNumber={selectedRoom}
        onClose={() => setSelectedRoom(null)}
      />
    </PageContainer>
  );
}

// ============================================
// Sub-components
// ============================================

interface PageHeaderProps {
  residentCount: number;
}

function PageHeader({ residentCount }: PageHeaderProps) {
  return (
    <div className="mb-6 sm:mb-8 lg:mb-12 animate-slide-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white">
            Our <span className="gradient-text">Community</span>
          </h2>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-lg">
            Meet the amazing people living in our sharehouse
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-4 sm:gap-6">
          <StatItem value={residentCount} label="Residents" color="indigo" />
          <StatItem value={4} label="Floors" color="purple" />
        </div>
      </div>
    </div>
  );
}

interface StatItemProps {
  value: number;
  label: string;
  color: "indigo" | "purple";
}

function StatItem({ value, label, color }: StatItemProps) {
  const colorClasses = {
    indigo: "text-indigo-600 dark:text-indigo-400",
    purple: "text-purple-600 dark:text-purple-400",
  };

  return (
    <div className="text-center">
      <div className={`text-2xl sm:text-3xl font-bold ${colorClasses[color]}`}>
        {value}
      </div>
      <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="text-center py-12 sm:py-16 animate-fade-in">
      <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
        <svg
          className="w-7 h-7 sm:w-8 sm:h-8 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 className="text-base sm:text-lg font-medium text-slate-800 dark:text-white">
        Something went wrong
      </h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
}
