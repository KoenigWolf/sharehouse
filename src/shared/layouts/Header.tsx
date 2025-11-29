"use client";

/**
 * Header Layout Component
 * Sticky navigation header with mobile menu
 */

import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/src/lib/utils";

// ============================================
// Component
// ============================================

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled || mobileMenuOpen
            ? "glass shadow-lg shadow-slate-900/5 border-b border-slate-200/50 dark:border-slate-700/50"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <Logo onClick={() => setMobileMenuOpen(false)} />

            {/* Desktop Navigation */}
            <DesktopNav />

            {/* Mobile Menu Button */}
            <MobileMenuButton
              isOpen={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            />
          </div>
        </div>

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={mobileMenuOpen}
          onItemClick={() => setMobileMenuOpen(false)}
        />
      </header>

      {/* Mobile menu backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm sm:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

// ============================================
// Sub-components
// ============================================

function Logo({ onClick }: { onClick: () => void }) {
  return (
    <Link href="/" className="flex items-center gap-2 sm:gap-3 group" onClick={onClick}>
      <div className="relative">
        <div
          className={cn(
            "w-9 h-9 sm:w-10 sm:h-10 rounded-xl",
            "bg-gradient-to-br from-indigo-500 to-purple-600",
            "flex items-center justify-center",
            "shadow-lg shadow-indigo-500/30",
            "group-hover:shadow-indigo-500/50 transition-shadow duration-300"
          )}
        >
          <HomeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
      </div>
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">
          Share<span className="gradient-text">House</span>
        </h1>
        <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 -mt-0.5">
          Resident Directory
        </p>
      </div>
    </Link>
  );
}

function DesktopNav() {
  return (
    <nav className="hidden sm:flex items-center gap-2">
      <NavLink href="/">All Residents</NavLink>
      <NavButton href="/profile/edit">
        <EditIcon className="w-4 h-4" />
        Edit Profile
      </NavButton>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "px-4 py-2 rounded-lg text-sm font-medium",
        "text-slate-600 dark:text-slate-300",
        "hover:text-slate-900 dark:hover:text-white",
        "hover:bg-slate-100 dark:hover:bg-slate-800",
        "transition-colors duration-200"
      )}
    >
      {children}
    </Link>
  );
}

function NavButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium",
        "bg-indigo-600 text-white",
        "hover:bg-indigo-700",
        "shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30",
        "transition-all duration-300 hover:-translate-y-0.5",
        "active:translate-y-0"
      )}
    >
      {children}
    </Link>
  );
}

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

function MobileMenuButton({ isOpen, onClick }: MobileMenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "sm:hidden p-2 rounded-lg",
        "text-slate-600 dark:text-slate-300",
        "hover:bg-slate-100 dark:hover:bg-slate-800",
        "transition-colors active:scale-95"
      )}
      aria-label="Toggle menu"
    >
      {isOpen ? (
        <CloseIcon className="w-6 h-6" />
      ) : (
        <MenuIcon className="w-6 h-6" />
      )}
    </button>
  );
}

interface MobileMenuProps {
  isOpen: boolean;
  onItemClick: () => void;
}

function MobileMenu({ isOpen, onItemClick }: MobileMenuProps) {
  return (
    <div
      className={cn(
        "sm:hidden overflow-hidden transition-all duration-300 ease-in-out",
        isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
      )}
    >
      <nav className="px-4 pb-4 space-y-2">
        <MobileNavLink href="/" onClick={onItemClick}>
          <UsersIcon className="w-5 h-5 text-slate-500" />
          All Residents
        </MobileNavLink>
        <MobileNavButton href="/profile/edit" onClick={onItemClick}>
          <EditIcon className="w-5 h-5" />
          Edit Profile
        </MobileNavButton>
      </nav>
    </div>
  );
}

interface MobileNavItemProps {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}

function MobileNavLink({ href, onClick, children }: MobileNavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl",
        "text-slate-700 dark:text-slate-200",
        "hover:bg-slate-100 dark:hover:bg-slate-800",
        "transition-colors active:bg-slate-200 dark:active:bg-slate-700"
      )}
    >
      {children}
    </Link>
  );
}

function MobileNavButton({ href, onClick, children }: MobileNavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl",
        "bg-gradient-to-r from-indigo-500 to-purple-600 text-white",
        "active:from-indigo-600 active:to-purple-700"
      )}
    >
      {children}
    </Link>
  );
}

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

function EditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
}
