"use client";

/**
 * Profile Edit Page
 * Allows residents to edit their profile information
 */

import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageContainer } from "@/src/shared/layouts";
import { Spinner } from "@/src/shared/ui";
import { ProfileForm, useCurrentResident } from "@/src/features/residents";

// ============================================
// Component
// ============================================

export default function EditProfilePage() {
  const router = useRouter();
  const { resident, loading, error } = useCurrentResident("user-1");

  const handleSuccess = () => {
    router.push("/");
    router.refresh();
  };

  return (
    <PageContainer showFooter={false}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <Breadcrumb />

        {/* Page Header */}
        <PageHeader />

        {/* Form Card */}
        <div className="bg-white dark:bg-slate-800/50 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700/50 p-6 sm:p-8 animate-scale-in">
          <ProfileContent
            resident={resident}
            loading={loading}
            error={error}
            onSuccess={handleSuccess}
          />
        </div>

        {/* Back link */}
        <BackLink />
      </div>
    </PageContainer>
  );
}

// ============================================
// Sub-components
// ============================================

function Breadcrumb() {
  return (
    <nav className="mb-6 animate-fade-in">
      <ol className="flex items-center gap-2 text-sm">
        <li>
          <Link
            href="/"
            className="text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
          >
            Home
          </Link>
        </li>
        <li className="text-slate-400">/</li>
        <li className="text-slate-800 dark:text-white font-medium">
          Edit Profile
        </li>
      </ol>
    </nav>
  );
}

function PageHeader() {
  return (
    <div className="mb-8 animate-slide-up">
      <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
        Edit <span className="gradient-text">Profile</span>
      </h2>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Update your photo and nickname to help other residents recognize you
      </p>
    </div>
  );
}

interface ProfileContentProps {
  resident: ReturnType<typeof useCurrentResident>["resident"];
  loading: boolean;
  error: Error | null;
  onSuccess: () => void;
}

function ProfileContent({ resident, loading, error, onSuccess }: ProfileContentProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center py-12">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-900 rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin" />
        </div>
        <p className="mt-4 text-slate-500 dark:text-slate-400">
          Loading your profile...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
          <AlertIcon className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-medium text-slate-800 dark:text-white">
          Failed to load profile
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {error.message}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!resident) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
          <UserIcon className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-800 dark:text-white">
          No profile found
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Your resident profile hasn&apos;t been created yet
        </p>
      </div>
    );
  }

  return <ProfileForm resident={resident} onSuccess={onSuccess} />;
}

function BackLink() {
  return (
    <div className="mt-6 text-center animate-fade-in">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <ChevronLeftIcon className="w-4 h-4" />
        Back to all residents
      </Link>
    </div>
  );
}

// ============================================
// Icons
// ============================================

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}
