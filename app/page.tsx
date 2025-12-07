"use client";

/**
 * Home Page (Public)
 * Landing page with overview of the sharehouse
 */

import Link from "next/link";
import { cn } from "@/src/lib/utils";
import { PageContainer } from "@/src/shared/layouts";
import { useLanguage } from "@/src/shared/lang/context";
import {
  Home,
  BookOpen,
  Calendar,
  Users,
  Bell,
  ArrowRight,
  Sparkles,
  Shield,
  Lock,
} from "lucide-react";

export default function HomePage() {
  const { lang } = useLanguage();

  return (
    <PageContainer>
      <div className="relative">
        <div
          className="absolute inset-0 -z-10 bg-linear-to-b from-emerald-50/80 via-white to-transparent dark:from-teal-950/40 dark:via-slate-950/70 dark:to-transparent"
          aria-hidden="true"
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-14 space-y-10 sm:space-y-12">
          {/* Hero Section */}
          <HeroSection />

          {/* Quick Links */}
          <QuickLinksSection />

          {/* Info Section */}
          <InfoSection />
        </div>
      </div>
    </PageContainer>
  );
}

function HeroSection() {
  const { lang } = useLanguage();

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl border border-slate-200/70 dark:border-slate-800/70",
        "bg-white/85 dark:bg-slate-900/70 backdrop-blur-xl",
        "shadow-[0_25px_80px_-40px] shadow-emerald-500/25 p-6 sm:p-8 lg:p-10"
      )}
    >
      <div className="absolute inset-0 opacity-70 pointer-events-none" aria-hidden="true">
        <div className="absolute -left-12 top-0 h-40 w-40 sm:h-56 sm:w-56 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute right-0 -bottom-10 h-48 w-48 sm:h-64 sm:w-64 rounded-full bg-amber-300/20 blur-3xl" />
      </div>

      <div className="relative space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-600 via-teal-500 to-amber-400 text-white shadow-xl shadow-emerald-500/30">
            <Home className="h-7 w-7" />
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-[0.18em] bg-slate-900 text-white dark:bg-white dark:text-strong shadow-md">
            ShareHouse
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-strong dark:text-white leading-tight">
            {lang.pages.home.title}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-400 bg-clip-text text-transparent">
              {lang.pages.home.titleAccent}
            </span>
          </h1>
          <p className="text-base sm:text-lg text-muted dark:text-subtle max-w-2xl leading-relaxed">
            {lang.pages.home.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/house-rules"
            className={cn(
              "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl",
              "bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-600",
              "text-white font-semibold text-sm",
              "shadow-lg shadow-emerald-500/25",
              "hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            )}
          >
            <BookOpen className="h-4 w-4" />
            {lang.pages.home.viewHouseRules}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/members"
            className={cn(
              "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl",
              "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700",
              "text-slate-700 dark:text-slate-200 font-semibold text-sm",
              "shadow-md",
              "hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            )}
          >
            <Lock className="h-4 w-4" />
            {lang.pages.home.memberArea}
          </Link>
        </div>
      </div>
    </section>
  );
}

function QuickLinksSection() {
  const { lang } = useLanguage();

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-linear-to-br from-emerald-600 via-teal-500 to-amber-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25">
          <Sparkles className="h-5 w-5" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-strong dark:text-white">
          {lang.pages.home.quickAccess}
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <QuickLinkCard
          href="/house-rules"
          icon={<BookOpen className="h-6 w-6" />}
          title={lang.pages.home.houseRulesTitle}
          description={lang.pages.home.houseRulesDesc}
          gradient="from-emerald-500 via-teal-500 to-cyan-500"
        />
        <QuickLinkCard
          href="/meetings"
          icon={<Calendar className="h-6 w-6" />}
          title={lang.pages.home.meetingsTitle}
          description={lang.pages.home.meetingsDesc}
          gradient="from-violet-500 via-purple-500 to-fuchsia-500"
        />
        <QuickLinkCard
          href="/events"
          icon={<Calendar className="h-6 w-6" />}
          title={lang.pages.home.eventsTitle}
          description={lang.pages.home.eventsDesc}
          gradient="from-amber-500 via-orange-500 to-red-500"
        />
        <QuickLinkCard
          href="/notices"
          icon={<Bell className="h-6 w-6" />}
          title={lang.pages.home.noticesTitle}
          description={lang.pages.home.noticesDesc}
          gradient="from-cyan-500 via-sky-500 to-blue-500"
        />
        <QuickLinkCard
          href="/updates"
          icon={<Sparkles className="h-6 w-6" />}
          title={lang.pages.home.updatesTitle}
          description={lang.pages.home.updatesDesc}
          gradient="from-rose-500 via-pink-500 to-red-500"
        />
        <MembersLinkCard />
      </div>
    </section>
  );
}

interface QuickLinkCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}

function QuickLinkCard({ href, icon, title, description, gradient }: QuickLinkCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative overflow-hidden rounded-2xl",
        "bg-white dark:bg-slate-900/80",
        "border border-slate-200/60 dark:border-slate-800/60",
        "shadow-lg shadow-slate-900/5 dark:shadow-slate-950/50",
        "p-5 transition-all duration-300",
        "hover:shadow-xl hover:-translate-y-1"
      )}
    >
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1 transition-all duration-300",
          "bg-linear-to-b",
          gradient,
          "group-hover:w-1.5"
        )}
      />

      <div className="flex items-start gap-4">
        <div
          className={cn(
            "shrink-0 h-12 w-12 rounded-xl",
            "bg-linear-to-br",
            gradient,
            "text-white flex items-center justify-center",
            "shadow-lg transition-all duration-300",
            "group-hover:scale-110 group-hover:rotate-3"
          )}
        >
          {icon}
        </div>
        <div className="min-w-0 space-y-1">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
            {description}
          </p>
        </div>
        <ArrowRight className="shrink-0 h-5 w-5 text-slate-400 transition-all duration-300 group-hover:text-emerald-500 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function MembersLinkCard() {
  const { lang } = useLanguage();

  return (
    <Link
      href="/members"
      className={cn(
        "group relative overflow-hidden rounded-2xl",
        "bg-linear-to-br from-slate-900 via-slate-800 to-slate-900",
        "dark:from-slate-800 dark:via-slate-900 dark:to-slate-800",
        "border border-slate-700/50",
        "shadow-lg shadow-slate-900/20",
        "p-5 transition-all duration-300",
        "hover:shadow-xl hover:-translate-y-1"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative flex items-start gap-4">
        <div
          className={cn(
            "shrink-0 h-12 w-12 rounded-xl",
            "bg-linear-to-br from-emerald-500 via-teal-500 to-amber-500",
            "text-white flex items-center justify-center",
            "shadow-lg shadow-emerald-500/30",
            "transition-all duration-300",
            "group-hover:scale-110 group-hover:rotate-3"
          )}
        >
          <Users className="h-6 w-6" />
        </div>
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white">
              {lang.pages.home.membersTitle}
            </h3>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
              <Lock className="h-2.5 w-2.5" />
              {lang.pages.home.membersAuth}
            </span>
          </div>
          <p className="text-sm text-slate-400 line-clamp-2">
            {lang.pages.home.membersDesc}
          </p>
        </div>
        <ArrowRight className="shrink-0 h-5 w-5 text-slate-500 transition-all duration-300 group-hover:text-emerald-400 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function InfoSection() {
  const { lang } = useLanguage();

  const privacyText = lang.pages.home.privacyText.replace(
    "{highlight}",
    `<strong class="text-emerald-600 dark:text-emerald-400">${lang.pages.home.privacyHighlight}</strong>`
  );

  return (
    <section
      className={cn(
        "rounded-2xl border border-slate-200/70 dark:border-slate-800/70",
        "bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm",
        "shadow-lg shadow-emerald-500/5 p-6"
      )}
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0 h-10 w-10 rounded-xl bg-linear-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center">
          <Shield className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            {lang.pages.home.privacyTitle}
          </h3>
          <p
            className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: privacyText }}
          />
        </div>
      </div>
    </section>
  );
}
