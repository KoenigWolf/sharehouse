"use client";

/**
 * Footer Layout Component
 * Modern, feature-rich footer with multiple sections
 *
 * Features:
 * - Multi-column layout with quick links
 * - Social/contact information
 * - Newsletter-style community section
 * - Animated gradient accent
 * - Dark mode optimized
 * - Fully responsive
 */

import { memo } from "react";
import Link from "next/link";
import { cn } from "@/src/lib/utils";
import { useLanguage } from "@/src/shared/lang/context";

// ============================================
// Types
// ============================================

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

// ============================================
// Component
// ============================================

export const Footer = memo(function Footer() {
  const { lang } = useLanguage();

  const sections: FooterSection[] = [
    {
      title: "Navigation",
      links: [
        { label: lang.nav.residents, href: "/" },
        { label: lang.nav.notices, href: "/notices" },
        { label: lang.nav.events, href: "/events" },
        { label: lang.nav.meetings, href: "/meetings" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: lang.nav.houseRules, href: "/house-rules" },
        { label: lang.nav.accounting, href: "/accounting" },
        { label: lang.nav.settings, href: "/settings" },
        { label: lang.nav.editProfile, href: "/profile/edit" },
      ],
    },
  ];

  return (
    <footer className="relative mt-auto">
      {/* Gradient accent line */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-px",
          "bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"
        )}
        aria-hidden="true"
      />

      {/* Main footer content */}
      <div className="bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Upper section */}
          <div
            className={cn(
              "py-8 sm:py-10 lg:py-12",
              "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-12"
            )}
          >
            {/* Brand section */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-1 space-y-4">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 rounded-xl",
                    "bg-gradient-to-br from-indigo-500 to-purple-600",
                    "flex items-center justify-center",
                    "shadow-lg shadow-indigo-500/25"
                  )}
                >
                  <HomeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  ShareHouse
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs leading-relaxed">
                A community-driven platform connecting residents and making shared living better.
              </p>
              {/* Social icons */}
              <div className="flex items-center gap-3 pt-2">
                <SocialButton icon={<SlackIcon />} label="Slack" />
                <SocialButton icon={<DiscordIcon />} label="Discord" />
                <SocialButton icon={<InstagramIcon />} label="Instagram" />
              </div>
            </div>

            {/* Link sections */}
            {sections.map((section) => (
              <div key={section.title} className="space-y-3 sm:space-y-4">
                <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                  {section.title}
                </h3>
                <ul className="space-y-2 sm:space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "text-sm text-slate-600 dark:text-slate-400",
                          "hover:text-indigo-600 dark:hover:text-indigo-400",
                          "transition-colors duration-200",
                          "inline-flex items-center gap-1"
                        )}
                      >
                        {link.label}
                        {link.external && (
                          <ExternalLinkIcon className="w-3 h-3 opacity-50" />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Community section */}
            <div className="col-span-2 sm:col-span-1 space-y-3 sm:space-y-4">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                Community
              </h3>
              <div
                className={cn(
                  "p-4 rounded-xl",
                  "bg-gradient-to-br from-indigo-50 to-purple-50",
                  "dark:from-indigo-950/50 dark:to-purple-950/50",
                  "border border-indigo-100 dark:border-indigo-900/50"
                )}
              >
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-3">
                  Join our resident community
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-6 h-6 sm:w-7 sm:h-7 rounded-full",
                          "border-2 border-white dark:border-slate-800",
                          "bg-gradient-to-br",
                          i === 0 && "from-pink-400 to-rose-500",
                          i === 1 && "from-amber-400 to-orange-500",
                          i === 2 && "from-emerald-400 to-teal-500",
                          i === 3 && "from-blue-400 to-indigo-500"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    40+ residents
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />

          {/* Bottom section */}
          <div
            className={cn(
              "py-5 sm:py-6",
              "flex flex-col sm:flex-row items-center justify-between gap-4"
            )}
          >
            {/* Copyright */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <span>&copy; {new Date().getFullYear()} ShareHouse</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">All rights reserved</span>
            </div>

            {/* Tech stack badges */}
            <div className="flex items-center gap-2">
              <TechBadge>Next.js</TechBadge>
              <TechBadge>Supabase</TechBadge>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient accent */}
      <div
        className={cn(
          "h-1",
          "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
        )}
        aria-hidden="true"
      />
    </footer>
  );
});

// ============================================
// Sub-components
// ============================================

interface SocialButtonProps {
  icon: React.ReactNode;
  label: string;
}

const SocialButton = memo(function SocialButton({ icon, label }: SocialButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "w-9 h-9 sm:w-10 sm:h-10",
        "flex items-center justify-center",
        "rounded-lg",
        "bg-slate-100 dark:bg-slate-800",
        "text-slate-500 dark:text-slate-400",
        "hover:bg-indigo-100 dark:hover:bg-indigo-900/50",
        "hover:text-indigo-600 dark:hover:text-indigo-400",
        "transition-all duration-200",
        "hover:scale-105 active:scale-95"
      )}
    >
      {icon}
    </button>
  );
});

interface TechBadgeProps {
  children: React.ReactNode;
}

const TechBadge = memo(function TechBadge({ children }: TechBadgeProps) {
  return (
    <span
      className={cn(
        "px-2 py-1 rounded-md",
        "text-[10px] sm:text-xs font-medium",
        "bg-slate-100 dark:bg-slate-800",
        "text-slate-500 dark:text-slate-400",
        "border border-slate-200 dark:border-slate-700"
      )}
    >
      {children}
    </span>
  );
});

// ============================================
// Icons
// ============================================

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  );
}

function SlackIcon() {
  return (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  );
}
