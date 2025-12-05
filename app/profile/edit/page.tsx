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
import { useLanguage } from "@/src/shared/lang/context";
import { AlertTriangle, User, ChevronLeft, Sparkles, Shield } from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function EditProfilePage() {
  const router = useRouter();
  const { resident, loading, error } = useCurrentResident("user-1");
  const { lang } = useLanguage();

  const handleSuccess = () => {
    router.push("/");
    router.refresh();
  };

  return (
    <PageContainer showFooter={false}>
      <div className="relative">
        <div
          className="absolute inset-0 -z-10 bg-linear-to-b from-emerald-50/80 via-white to-transparent dark:from-teal-950/40 dark:via-slate-950/70 dark:to-transparent"
          aria-hidden="true"
        />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 sm:space-y-8">
          <Breadcrumb lang={lang} />
          <PageHeader lang={lang} />

          <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.4fr,1fr]">
            <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-white/90 dark:bg-slate-900/70 backdrop-blur-xl shadow-[0_25px_80px_-40px] shadow-emerald-500/20 p-6 sm:p-8 animate-scale-in">
              <ProfileContent
                resident={resident}
                loading={loading}
                error={error}
                onSuccess={handleSuccess}
                lang={lang}
              />
            </div>
            <SidePanel lang={lang} />
          </div>

          <BackLink lang={lang} />
        </div>
      </div>
    </PageContainer>
  );
}

import type { BaseLang } from "@/src/shared/lang/types";

function Breadcrumb({ lang }: { lang: BaseLang }) {
  return (
    <nav className="mb-6 animate-fade-in">
      <ol className="flex items-center gap-2 text-sm">
        <li>
          <Link
            href="/"
            className="text-muted hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            {lang.pages.profileEdit.breadcrumbHome}
          </Link>
        </li>
        <li className="text-subtle">/</li>
        <li className="text-strong font-medium">
          {lang.pages.profileEdit.breadcrumbEdit}
        </li>
      </ol>
    </nav>
  );
}

function PageHeader({ lang }: { lang: BaseLang }) {
  return (
    <section
      className="relative overflow-hidden rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-white/90 dark:bg-slate-900/70 backdrop-blur-xl shadow-[0_25px_80px_-40px] shadow-emerald-500/25 p-6 sm:p-8"
    >
      <div className="absolute inset-0 opacity-70 pointer-events-none" aria-hidden="true">
        <div className="absolute -left-8 top-0 h-28 w-28 sm:h-36 sm:w-36 rounded-full bg-emerald-500/18 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-32 w-40 sm:h-44 sm:w-52 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>
      <div className="relative space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-600 via-teal-500 to-amber-400 text-white shadow-lg shadow-emerald-500/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-[0.18em] bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md shadow-emerald-500/20">
            {lang.pages.profileEdit.title}
          </span>
        </div>
        <h2 className="type-display text-strong">{lang.pages.profileEdit.title}</h2>
        <p className="type-body text-muted max-w-3xl">{lang.pages.profileEdit.description}</p>
      </div>
    </section>
  );
}

interface ProfileContentProps {
  resident: ReturnType<typeof useCurrentResident>["resident"];
  loading: boolean;
  error: Error | null;
  onSuccess: () => void;
  lang: BaseLang;
}

function ProfileContent({ resident, loading, error, onSuccess, lang }: ProfileContentProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center py-12">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-emerald-200 dark:border-emerald-900 rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-emerald-500 rounded-full animate-spin" />
        </div>
        <p className="mt-4 text-muted">
          {lang.pages.profileEdit.loading}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
          <AlertTriangle className="w-8 h-8 text-red-500" strokeWidth={2} />
        </div>
        <h3 className="text-lg font-medium text-strong">
          {lang.pages.profileEdit.errorTitle}
        </h3>
        <p className="mt-1 text-sm text-muted">
          {error.message}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          {lang.common.tryAgain}
        </button>
      </div>
    );
  }

  if (!resident) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
          <User className="w-8 h-8 text-subtle" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-medium text-strong">
          {lang.pages.profileEdit.notFound}
        </h3>
        <p className="mt-1 text-sm text-muted">
          {lang.pages.profileEdit.notFoundMessage}
        </p>
      </div>
    );
  }

  return <ProfileForm resident={resident} onSuccess={onSuccess} />;
}

function BackLink({ lang }: { lang: BaseLang }) {
  return (
    <div className="mt-6 text-center animate-fade-in">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" strokeWidth={2} />
        {lang.pages.profileEdit.backLink}
      </Link>
    </div>
  );
}

function SidePanel({ lang }: { lang: BaseLang }) {
  return (
    <aside className="rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-white/90 dark:bg-slate-900/70 backdrop-blur-xl shadow-[0_25px_80px_-40px] shadow-emerald-500/20 p-5 sm:p-6 space-y-3">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-emerald-600" />
        <h3 className="text-lg font-semibold text-strong">{lang.pages.profileEdit.title}</h3>
      </div>
      <ul className="space-y-2 text-sm text-muted">
        <li className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {lang.pages.profileEdit.photoHint}
        </li>
        <li className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {lang.pages.profileEdit.description}
        </li>
        <li className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-slate-500" />
          {lang.pages.profileEdit.breadcrumbEdit}
        </li>
      </ul>
    </aside>
  );
}
