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
  Sparkles,
  Calendar,
  BookOpen,
  Bell,
  Lock,
  Settings,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  protected?: boolean;
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

  // Navigation configuration - Public + Protected areas
  const navItems: NavItem[] = [
    { href: "/", label: lang.nav.home, icon: Home },
    { href: "/house-rules", label: lang.nav.houseRules, icon: BookOpen },
    { href: "/meetings", label: lang.nav.meetings, icon: Calendar },
    { href: "/events", label: lang.nav.events, icon: Calendar },
    { href: "/notices", label: lang.nav.notices, icon: Bell },
    { href: "/updates", label: lang.nav.updates, icon: Sparkles },
    { href: "/members", label: lang.nav.members, icon: Users, protected: true },
    { href: "/settings", label: lang.nav.settings, icon: Settings },
  ];

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 safe-area-inset-top",
          "transition-all duration-500",
          scrolled || mobileMenuOpen
            ? "backdrop-blur-xl bg-white/75 dark:bg-slate-950/70 shadow-lg shadow-emerald-700/10 border-b border-white/40 dark:border-slate-800/80"
            : "bg-transparent"
        )}
        role="banner"
      >
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-emerald-600/0 via-emerald-500/40 to-transparent" />
          <div className="absolute -left-10 top-6 h-24 w-24 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="absolute right-0 top-10 h-20 w-28 rounded-full bg-amber-300/20 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 xs:h-16 sm:h-[72px] gap-3">
            {/* Logo */}
            <Logo onClick={closeMobileMenu} />

            {/* Desktop Navigation */}
            <DesktopNav navItems={navItems} pathname={pathname} />

            {/* Mobile Menu Button */}
            <MobileMenuButton isOpen={mobileMenuOpen} onClick={toggleMobileMenu} />
          </div>
        </div>

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={mobileMenuOpen}
          onItemClick={closeMobileMenu}
          navItems={navItems}
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
      className="flex items-center gap-2 xs:gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded-lg"
      onClick={onClick}
    >
      <div className="relative">
        <div
          className={cn(
            "w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl",
            "bg-gradient-to-br from-emerald-600 via-teal-500 to-amber-400",
            "flex items-center justify-center",
            "shadow-lg shadow-emerald-500/25",
            "group-hover:shadow-emerald-500/40 group-hover:scale-105",
            "transition-all duration-300"
          )}
        >
          <Home className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5 text-white" strokeWidth={2.5} />
        </div>
        {/* Glow effect - only on hover-capable devices */}
        <div
          className={cn(
            "absolute inset-0 rounded-lg sm:rounded-xl",
            "bg-gradient-to-br from-emerald-600 via-teal-500 to-amber-400",
            "opacity-0 group-hover:opacity-40 blur-xl",
            "transition-opacity duration-300",
            "hidden sm:block"
          )}
          aria-hidden="true"
        />
      </div>
      <div className="flex flex-col">
        <h1 className="text-base xs:text-lg sm:text-xl font-bold text-strong leading-tight">
          Share<span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-400 bg-clip-text text-transparent">House</span>
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
  pathname: string;
}

const DesktopNav = memo(function DesktopNav({ navItems, pathname }: DesktopNavProps) {
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  // Separate public and protected items
  const publicItems = navItems.filter((item) => !item.protected);
  const protectedItems = navItems.filter((item) => item.protected);

  return (
    <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
      {/* Public nav items */}
      {publicItems.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          icon={item.icon}
          label={item.label}
          active={isActive(item.href)}
        />
      ))}

      {/* Divider */}
      <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" aria-hidden="true" />

      {/* Protected items with lock indicator */}
      {protectedItems.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          icon={item.icon}
          label={item.label}
          active={isActive(item.href)}
          protected
        />
      ))}
    </nav>
  );
});

interface NavLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  protected?: boolean;
}

const NavLink = memo(function NavLink({ href, icon: Icon, label, active, protected: isProtected }: NavLinkProps) {
  return (
    <TransitionLink
      href={href}
      className={cn(
        "relative group flex items-center justify-center",
        "w-10 h-10 rounded-xl",
        "transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950",
        active
          ? isProtected
            ? "bg-linear-to-r from-slate-800 to-slate-700 shadow-md shadow-slate-500/20"
            : "bg-linear-to-r from-teal-600/95 to-emerald-600/90 shadow-md shadow-emerald-500/20"
          : isProtected
            ? "hover:bg-slate-800/10 dark:hover:bg-slate-700/50"
            : "hover:bg-slate-100/80 dark:hover:bg-slate-800/80",
        "active:scale-95"
      )}
      aria-label={label}
    >
      <Icon
        className={cn(
          "w-5 h-5 transition-transform duration-200",
          active
            ? "text-white"
            : isProtected
              ? "text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200"
              : "text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
          "group-hover:scale-110"
        )}
      />

      {/* Protected indicator */}
      {isProtected && !active && (
        <Lock className="absolute -bottom-0.5 -right-0.5 w-3 h-3 text-amber-500" />
      )}

      {/* Tooltip on hover */}
      <span
        className={cn(
          "absolute top-full mt-2 left-1/2 -translate-x-1/2",
          "px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap",
          "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900",
          "shadow-lg shadow-slate-900/20",
          "opacity-0 invisible group-hover:opacity-100 group-hover:visible",
          "transition-all duration-200 ease-out",
          "pointer-events-none",
          "z-50"
        )}
      >
        {label}
        {isProtected && (
          <Lock className="inline-block ml-1 w-3 h-3 text-amber-400 dark:text-amber-500" />
        )}
        {/* Tooltip arrow */}
        <span
          className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-900 dark:border-b-slate-100"
          aria-hidden="true"
        />
      </span>
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
      type="button"
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
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
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
}

const MobileMenu = memo(function MobileMenu({
  isOpen,
  onItemClick,
  navItems,
}: MobileMenuProps) {
  // Separate public and protected items
  const publicItems = navItems.filter((item) => !item.protected);
  const protectedItems = navItems.filter((item) => item.protected);

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
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800/70 bg-white/90 dark:bg-slate-900/80 shadow-lg shadow-emerald-500/10">
          <div className="absolute inset-0 opacity-60" aria-hidden="true">
            <div className="absolute -left-10 top-0 h-24 w-24 bg-emerald-400/20 blur-3xl" />
            <div className="absolute right-0 bottom-0 h-20 w-28 bg-amber-300/15 blur-3xl" />
          </div>
          <div className="relative space-y-2 p-2.5 xs:p-3">
            {/* Public items - 4x2 grid */}
            <div className="grid grid-cols-4 gap-1 xs:gap-1.5">
              {publicItems.slice(0, 4).map((item) => (
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
            <div className="grid grid-cols-4 gap-1 xs:gap-1.5">
              {publicItems.slice(4).map((item) => (
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

            {/* Divider */}
            <div className="h-px bg-linear-to-r from-transparent via-slate-200/80 dark:via-slate-700/80 to-transparent" />

            {/* Protected items */}
            <div className="grid grid-cols-4 gap-1 xs:gap-1.5">
              {protectedItems.map((item) => (
                <MobileNavLink
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  onClick={onItemClick}
                  protected
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
  protected?: boolean;
}

const MobileNavLink = memo(function MobileNavLink({
  href,
  icon: Icon,
  onClick,
  children,
  protected: isProtected,
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
        isProtected
          ? "hover:bg-linear-to-br hover:from-slate-700/10 hover:to-slate-600/10 dark:hover:from-slate-600/30 dark:hover:to-slate-500/20"
          : "hover:bg-linear-to-br hover:from-emerald-500/10 hover:to-amber-400/10 dark:hover:from-emerald-500/20 dark:hover:to-amber-400/10",
        "active:scale-95 transition-all",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-inset",
        "group"
      )}
    >
      <div
        className={cn(
          "relative flex items-center justify-center",
          "w-8 h-8 xs:w-10 xs:h-10",
          "rounded-xl",
          isProtected
            ? "bg-slate-800 dark:bg-slate-700"
            : "bg-slate-100 dark:bg-slate-800",
          isProtected
            ? "group-hover:bg-slate-700 group-hover:shadow-md group-hover:shadow-slate-500/15 dark:group-hover:bg-slate-600"
            : "group-hover:bg-white group-hover:shadow-md group-hover:shadow-emerald-500/15 dark:group-hover:bg-slate-800/80",
          "transition-all"
        )}
      >
        <Icon
          className={cn(
            "w-4 h-4 xs:w-5 xs:h-5",
            isProtected
              ? "text-white"
              : "text-subtle group-hover:text-emerald-600 dark:group-hover:text-emerald-300",
            "transition-colors"
          )}
        />
        {isProtected && (
          <Lock className="absolute -bottom-0.5 -right-0.5 w-3 h-3 text-amber-400" />
        )}
      </div>
      <span className={cn(
        "type-caption text-center leading-tight line-clamp-2",
        isProtected ? "text-strong" : "text-muted"
      )}>
        {children}
      </span>
    </TransitionLink>
  );
});
