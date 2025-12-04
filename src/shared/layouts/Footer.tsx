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
import { Home, ExternalLink } from "lucide-react";
import { SiSlack, SiDiscord, SiInstagram } from "@icons-pack/react-simple-icons";

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
                  <Home className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2.5} />
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
                <SocialButton icon={<SiSlack className="w-4 h-4 sm:w-5 sm:h-5" />} label="Slack" />
                <SocialButton icon={<SiDiscord className="w-4 h-4 sm:w-5 sm:h-5" />} label="Discord" />
                <SocialButton icon={<SiInstagram className="w-4 h-4 sm:w-5 sm:h-5" />} label="Instagram" />
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
                          <ExternalLink className="w-3 h-3 opacity-50" strokeWidth={2} />
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

