"use client";

/**
 * Header Layout Component
 * Modern navigation header with dropdown menus and icons
 *
 * Responsive breakpoints:
 * - Mobile (< 1024px): Hamburger menu with grid navigation
 * - Desktop (>= 1024px): Horizontal navigation with dropdown
 */

import { useState, useEffect, useCallback, memo } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";
import { useLanguage } from "@/src/shared/lang/context";
import { TransitionLink } from "@/src/shared/ui";
import {
  Home,
  Users,
  Bell,
  Sparkles,
  Calendar,
  BookOpen,
  Wallet,
  Settings,
  UserCircle,
  LayoutGrid,
} from "lucide-react";

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

export const Header = memo(function Header() {
  const { lang } = useLanguage();
  const pathname = usePathname() || "/";
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
    { href: "/", label: lang.nav.residents, icon: Users },
    { href: "/notices", label: lang.nav.notices, icon: Bell },
    { href: "/events", label: lang.nav.events, icon: Sparkles },
  ];

  // Secondary: Less frequently accessed features grouped in dropdown
  const moreItems: NavGroup = {
    label: lang.nav.more || "More",
    icon: LayoutGrid,
    items: [
      { href: "/meetings", label: lang.nav.meetings, icon: Calendar },
      { href: "/house-rules", label: lang.nav.houseRules, icon: BookOpen },
      { href: "/accounting", label: lang.nav.accounting, icon: Wallet },
      { href: "/settings", label: lang.nav.settings, icon: Settings },
    ],
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 safe-area-inset-top",
          "transition-all duration-500",
          scrolled || mobileMenuOpen
            ? "backdrop-blur-xl bg-white/75 dark:bg-slate-950/70 shadow-lg shadow-indigo-500/10 border-b border-white/40 dark:border-slate-800/80"
            : "bg-transparent"
        )}
        role="banner"
      >
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-indigo-500/0 via-indigo-500/50 to-transparent" />
          <div className="absolute -left-10 top-6 h-24 w-24 rounded-full bg-indigo-500/15 blur-3xl" />
          <div className="absolute right-0 top-10 h-20 w-28 rounded-full bg-emerald-400/10 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 xs:h-16 sm:h-[72px] gap-3">
            {/* Logo */}
            <Logo onClick={closeMobileMenu} />

            {/* Desktop Navigation */}
            <DesktopNav navItems={navItems} moreItems={moreItems} lang={lang} pathname={pathname} />

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
          <Home className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5 text-white" strokeWidth={2.5} />
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
        <h1 className="text-base xs:text-lg sm:text-xl font-bold text-strong leading-tight">
          Share<span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">House</span>
        </h1>
        <p className="hidden sm:block type-caption font-medium tracking-wide uppercase text-muted">
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
  pathname: string;
}

const DesktopNav = memo(function DesktopNav({ navItems, moreItems, lang, pathname }: DesktopNavProps) {
  // Combine all items for flat navigation
  const allNavItems = [...navItems, ...moreItems.items];
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
      {/* All nav items in a clean row */}
      {allNavItems.map((item) => (
        <NavLink key={item.href} href={item.href} icon={item.icon} active={isActive(item.href)}>
          {item.label}
        </NavLink>
      ))}

      {/* Divider */}
      <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-2" aria-hidden="true" />

      {/* Profile button - highlighted */}
      <NavButton href="/profile/edit">
        <UserCircle className="w-4 h-4" strokeWidth={2} />
        {lang.nav.editProfile}
      </NavButton>
    </nav>
  );
});

interface NavLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  active?: boolean;
}

const NavLink = memo(function NavLink({ href, icon: Icon, children, active }: NavLinkProps) {
  return (
    <TransitionLink
      href={href}
      className={cn(
        "group flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold",
        "transition-all duration-250",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950",
        active
          ? "bg-gradient-to-r from-indigo-500/90 to-purple-500/90 text-white shadow-md shadow-indigo-500/20"
          : "text-muted hover:text-strong hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
      )}
    >
      <Icon
        className={cn(
          "w-4 h-4",
          active ? "text-white" : "text-subtle group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors"
        )}
      />
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
  const { lang } = useLanguage();

  return (
    <button
      onClick={onClick}
      className={cn(
        "lg:hidden",
        "p-2 xs:p-2.5",
        "min-w-[40px] min-h-[40px]",
        "rounded-lg xs:rounded-xl",
        "text-muted",
        "hover:bg-slate-100 dark:hover:bg-slate-800",
        "transition-all duration-200",
        "active:scale-95",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
        isOpen && "bg-slate-100 dark:bg-slate-800"
      )}
      aria-label={isOpen ? lang.common.closeMenu : lang.common.openMenu}
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
      <div className="px-3 xs:px-4 pb-4 safe-area-inset-bottom">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800/70 bg-white/90 dark:bg-slate-900/80 shadow-lg shadow-indigo-500/10">
          <div className="absolute inset-0 opacity-60" aria-hidden="true">
            <div className="absolute -left-10 top-0 h-24 w-24 bg-indigo-500/15 blur-3xl" />
            <div className="absolute right-0 bottom-0 h-20 w-28 bg-emerald-400/10 blur-3xl" />
          </div>
          <div className="relative space-y-2 p-2.5 xs:p-3">
            <div className="grid grid-cols-4 gap-1 xs:gap-1.5">
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
                icon={UserCircle}
                onClick={onItemClick}
              >
                {lang.nav.editProfile}
              </MobileNavLink>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-slate-200/80 dark:via-slate-700/80 to-transparent" />
            <div className="grid grid-cols-4 gap-1 xs:gap-1.5">
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
        "p-1.5 xs:p-2 rounded-xl",
        "min-h-[60px] xs:min-h-[72px]",
        "text-strong",
        "hover:bg-gradient-to-br hover:from-indigo-500/10 hover:to-sky-500/10 dark:hover:from-indigo-500/20 dark:hover:to-sky-500/10",
        "active:scale-95 transition-all",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-inset",
        "group"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center",
          "w-8 h-8 xs:w-10 xs:h-10",
          "rounded-xl",
          "bg-slate-100 dark:bg-slate-800",
          "group-hover:bg-white group-hover:shadow-md group-hover:shadow-indigo-500/15 dark:group-hover:bg-slate-800/80",
          "transition-all"
        )}
      >
        <Icon
          className={cn(
            "w-4 h-4 xs:w-5 xs:h-5",
            "text-subtle",
            "group-hover:text-indigo-600 dark:group-hover:text-indigo-300",
            "transition-colors"
          )}
        />
      </div>
      <span className="type-caption text-center leading-tight line-clamp-2 text-muted">
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
