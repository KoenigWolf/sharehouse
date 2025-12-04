"use client";

/**
 * Header Layout Component
 * Modern navigation header with dropdown menus and icons
 *
 * Responsive breakpoints:
 * - Mobile (< 1024px): Hamburger menu with grid navigation
 * - Desktop (>= 1024px): Horizontal navigation with dropdown
 */

import { useState, useEffect, useRef, useCallback, memo } from "react";
import { cn } from "@/src/lib/utils";
import { useLanguage } from "@/src/shared/lang/context";
import { TransitionLink } from "@/src/shared/ui";

// ============================================
// Types
// ============================================

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavItem[];
}

// ============================================
// Component
// ============================================

export const Header = memo(function Header() {
  const { lang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll detection with throttle via passive listener
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Memoized toggle handler
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  // Navigation configuration - organized by category
  // Primary: Main features users access frequently
  const navItems: NavItem[] = [
    { href: "/", label: lang.nav.residents, icon: UsersIcon },
    { href: "/notices", label: lang.nav.notices, icon: BellIcon },
    { href: "/events", label: lang.nav.events, icon: SparklesIcon },
  ];

  // Secondary: Less frequently accessed features grouped in dropdown
  const moreItems: NavGroup = {
    label: lang.nav.more || "More",
    icon: GridIcon,
    items: [
      { href: "/meetings", label: lang.nav.meetings, icon: CalendarIcon },
      { href: "/house-rules", label: lang.nav.houseRules, icon: BookOpenIcon },
      { href: "/accounting", label: lang.nav.accounting, icon: WalletIcon },
      { href: "/settings", label: lang.nav.settings, icon: SettingsIcon },
    ],
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50",
          "transition-all duration-300",
          "safe-area-inset-top",
          scrolled || mobileMenuOpen
            ? "glass shadow-lg shadow-slate-900/5 border-b border-slate-200/50 dark:border-slate-700/50"
            : "bg-transparent"
        )}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12 xs:h-14 sm:h-16">
            {/* Logo */}
            <Logo onClick={closeMobileMenu} />

            {/* Desktop Navigation */}
            <DesktopNav navItems={navItems} moreItems={moreItems} lang={lang} />

            {/* Mobile Menu Button */}
            <MobileMenuButton isOpen={mobileMenuOpen} onClick={toggleMobileMenu} />
          </div>
        </div>

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={mobileMenuOpen}
          onItemClick={closeMobileMenu}
          navItems={navItems}
          moreItems={moreItems}
          lang={lang}
        />
      </header>

      {/* Mobile menu backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
});

// ============================================
// Sub-components
// ============================================

const Logo = memo(function Logo({ onClick }: { onClick: () => void }) {
  return (
    <TransitionLink
      href="/"
      className="flex items-center gap-2 xs:gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-lg"
      onClick={onClick}
    >
      <div className="relative">
        <div
          className={cn(
            "w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl",
            "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500",
            "flex items-center justify-center",
            "shadow-lg shadow-indigo-500/25",
            "group-hover:shadow-indigo-500/40 group-hover:scale-105",
            "transition-all duration-300"
          )}
        >
          <HomeIcon className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5 text-white" />
        </div>
        {/* Glow effect - only on hover-capable devices */}
        <div
          className={cn(
            "absolute inset-0 rounded-lg sm:rounded-xl",
            "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500",
            "opacity-0 group-hover:opacity-40 blur-xl",
            "transition-opacity duration-300",
            "hidden sm:block"
          )}
          aria-hidden="true"
        />
      </div>
      <div className="flex flex-col">
        <h1 className="text-base xs:text-lg sm:text-xl font-bold text-slate-800 dark:text-white leading-tight">
          Share<span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">House</span>
        </h1>
        <p className="hidden sm:block text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">
          Resident Portal
        </p>
      </div>
    </TransitionLink>
  );
});

interface DesktopNavProps {
  navItems: NavItem[];
  moreItems: NavGroup;
  lang: ReturnType<typeof useLanguage>["lang"];
}

const DesktopNav = memo(function DesktopNav({ navItems, moreItems, lang }: DesktopNavProps) {
  // Combine all items for flat navigation
  const allNavItems = [...navItems, ...moreItems.items];

  return (
    <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
      {/* All nav items in a clean row */}
      {allNavItems.map((item) => (
        <NavLink key={item.href} href={item.href} icon={item.icon}>
          {item.label}
        </NavLink>
      ))}

      {/* Divider */}
      <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-2" aria-hidden="true" />

      {/* Profile button - highlighted */}
      <NavButton href="/profile/edit">
        <UserCircleIcon className="w-4 h-4" />
        {lang.nav.editProfile}
      </NavButton>
    </nav>
  );
});

interface NavLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}

const NavLink = memo(function NavLink({ href, icon: Icon, children }: NavLinkProps) {
  return (
    <TransitionLink
      href={href}
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm font-medium",
        "text-slate-600 dark:text-slate-300",
        "hover:text-slate-900 dark:hover:text-white",
        "hover:bg-slate-100/80 dark:hover:bg-slate-800/80",
        "transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
        "group"
      )}
    >
      <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors" />
      {children}
    </TransitionLink>
  );
});

const NavButton = memo(function NavButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <TransitionLink
      href={href}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium",
        "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white",
        "shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/30",
        "transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02]",
        "active:translate-y-0 active:scale-100",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-500"
      )}
    >
      {children}
    </TransitionLink>
  );
});

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const MobileMenuButton = memo(function MobileMenuButton({
  isOpen,
  onClick,
}: MobileMenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "lg:hidden",
        "p-2 xs:p-2.5",
        "min-w-[40px] min-h-[40px]",
        "rounded-lg xs:rounded-xl",
        "text-slate-600 dark:text-slate-300",
        "hover:bg-slate-100 dark:hover:bg-slate-800",
        "transition-all duration-200",
        "active:scale-95",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
        isOpen && "bg-slate-100 dark:bg-slate-800"
      )}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
    >
      <div className="w-5 h-5 relative" aria-hidden="true">
        <span
          className={cn(
            "absolute left-0 w-5 h-0.5 bg-current rounded-full",
            "transition-all duration-300 ease-out",
            isOpen ? "top-[9px] rotate-45" : "top-1"
          )}
        />
        <span
          className={cn(
            "absolute left-0 top-[9px] w-5 h-0.5 bg-current rounded-full",
            "transition-all duration-300 ease-out",
            isOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
          )}
        />
        <span
          className={cn(
            "absolute left-0 w-5 h-0.5 bg-current rounded-full",
            "transition-all duration-300 ease-out",
            isOpen ? "top-[9px] -rotate-45" : "top-[17px]"
          )}
        />
      </div>
    </button>
  );
});

interface MobileMenuProps {
  isOpen: boolean;
  onItemClick: () => void;
  navItems: NavItem[];
  moreItems: NavGroup;
  lang: ReturnType<typeof useLanguage>["lang"];
}

const MobileMenu = memo(function MobileMenu({
  isOpen,
  onItemClick,
  navItems,
  moreItems,
  lang,
}: MobileMenuProps) {
  // Organize items into rows for clean grid layout
  // Row 1: Primary navigation (居住者, お知らせ, イベント) + Profile
  // Row 2: Secondary navigation (議事録, ルール, 会計, 設定)
  const primaryItems = navItems;
  const secondaryItems = moreItems.items;

  return (
    <nav
      id="mobile-menu"
      className={cn(
        "lg:hidden overflow-hidden",
        "transition-all duration-300 ease-out",
        isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
      )}
      aria-label="Mobile navigation"
    >
      <div className="px-2.5 xs:px-3 pb-3 safe-area-inset-bottom">
        {/* Row 1: Primary items + Profile (4 items = perfect 4-col grid) */}
        <div
          className="grid grid-cols-4 gap-1 xs:gap-1.5 mb-1 xs:mb-1.5"
          role="list"
        >
          {primaryItems.map((item) => (
            <MobileNavLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              onClick={onItemClick}
            >
              {item.label}
            </MobileNavLink>
          ))}
          <MobileNavLink
            href="/profile/edit"
            icon={UserCircleIcon}
            onClick={onItemClick}
          >
            {lang.nav.editProfile}
          </MobileNavLink>
        </div>

        {/* Row 2: Secondary items (4 items = perfect 4-col grid) */}
        <div
          className="grid grid-cols-4 gap-1 xs:gap-1.5"
          role="list"
        >
          {secondaryItems.map((item) => (
            <MobileNavLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              onClick={onItemClick}
            >
              {item.label}
            </MobileNavLink>
          ))}
        </div>
      </div>
    </nav>
  );
});

interface MobileNavLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  children: React.ReactNode;
}

const MobileNavLink = memo(function MobileNavLink({
  href,
  icon: Icon,
  onClick,
  children,
}: MobileNavLinkProps) {
  return (
    <TransitionLink
      href={href}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-0.5 xs:gap-1",
        "p-1.5 xs:p-2 rounded-lg xs:rounded-xl",
        "min-h-[60px] xs:min-h-[72px]",
        "text-slate-600 dark:text-slate-300",
        "hover:bg-slate-100 dark:hover:bg-slate-800",
        "active:bg-slate-200 dark:active:bg-slate-700",
        "transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-inset",
        "group"
      )}
      role="listitem"
    >
      <div
        className={cn(
          "flex items-center justify-center",
          "w-8 h-8 xs:w-10 xs:h-10",
          "rounded-lg xs:rounded-xl",
          "bg-slate-100 dark:bg-slate-800",
          "group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30",
          "transition-colors"
        )}
      >
        <Icon
          className={cn(
            "w-4 h-4 xs:w-5 xs:h-5",
            "text-slate-500 dark:text-slate-400",
            "group-hover:text-indigo-600 dark:group-hover:text-indigo-400",
            "transition-colors"
          )}
        />
      </div>
      <span className="text-[9px] xs:text-[10px] font-medium text-center leading-tight line-clamp-2">
        {children}
      </span>
    </TransitionLink>
  );
});

interface MobileNavButtonProps {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}

const MobileNavButton = memo(function MobileNavButton({
  href,
  onClick,
  children,
}: MobileNavButtonProps) {
  return (
    <TransitionLink
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2",
        "px-4 py-2.5 xs:py-3",
        "min-h-[44px]",
        "rounded-lg xs:rounded-xl",
        "text-sm font-medium text-white",
        "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
        "shadow-md shadow-indigo-500/20",
        "active:from-indigo-600 active:via-purple-600 active:to-pink-600",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
      )}
    >
      {children}
    </TransitionLink>
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

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  );
}

function BookOpenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  );
}

function WalletIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
      />
    </svg>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function UserCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function GridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
      />
    </svg>
  );
}

