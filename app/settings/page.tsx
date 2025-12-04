"use client";

import { useEffect, useState, useCallback } from "react";
import { PageContainer } from "@/src/shared/layouts";
import { useLanguage } from "@/src/shared/lang/context";
import type { LangCode } from "@/src/shared/lang";
import { env } from "@/src/config";
import { cn } from "@/src/lib/utils";

// ============================================
// Types
// ============================================

type Theme = "light" | "dark" | "system";

const LANG_OPTIONS: Array<{ code: LangCode; label: string }> = [
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "it", label: "Italiano" },
  { code: "es", label: "Español" },
  { code: "zh", label: "中文" },
];

const THEME_STORAGE_KEY = "app_theme";

// ============================================
// Component
// ============================================

export default function SettingsPage() {
  const { code, setCode, lang } = useLanguage();
  const [saved, setSaved] = useState(false);
  const [theme, setTheme] = useState<Theme>("system");

  // Load theme on mount
  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (stored) {
      setTheme(stored);
    }
  }, []);

  // Apply theme changes
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "system") {
      // Follow system preference
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
        root.classList.toggle("dark", e.matches);
      };
      handleChange(mediaQuery);
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      root.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  // Save feedback timer
  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => setSaved(false), 1500);
    return () => clearTimeout(timer);
  }, [saved]);

  const handleLanguageChange = useCallback((newCode: LangCode) => {
    setCode(newCode);
    setSaved(true);
  }, [setCode]);

  const handleThemeChange = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    setSaved(true);
  }, []);

  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-6 sm:space-y-8">
        {/* Header */}
        <header className="space-y-2 sm:space-y-3">
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-300 uppercase tracking-wide">
            {lang.pages.settings.eyebrow}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {lang.pages.settings.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
            {lang.pages.settings.description}
          </p>
        </header>

        {/* Language Section */}
        <section className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/70 shadow-sm p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                {lang.pages.settings.language}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {lang.pages.settings.languageDesc}
              </p>
            </div>
            {saved && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-300 animate-fade-in">
                {lang.pages.settings.saved}
              </span>
            )}
          </div>
          <select
            value={code}
            onChange={(e) => handleLanguageChange(e.target.value as LangCode)}
            className={cn(
              "w-full px-3 py-2.5 rounded-xl",
              "border border-slate-200 dark:border-slate-700",
              "bg-white dark:bg-slate-800",
              "text-slate-800 dark:text-slate-100",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500",
              "min-h-[44px]"
            )}
          >
            {LANG_OPTIONS.map((opt) => (
              <option key={opt.code} value={opt.code}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {lang.pages.settings.applyNote}
          </p>
        </section>

        {/* Theme Section */}
        <section className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/70 shadow-sm p-4 sm:p-5 space-y-4">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
              {lang.pages.settings.theme}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {lang.pages.settings.themeDesc}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <ThemeButton
              active={theme === "light"}
              onClick={() => handleThemeChange("light")}
              icon={<SunIcon />}
              label={lang.pages.settings.themeLight}
            />
            <ThemeButton
              active={theme === "dark"}
              onClick={() => handleThemeChange("dark")}
              icon={<MoonIcon />}
              label={lang.pages.settings.themeDark}
            />
            <ThemeButton
              active={theme === "system"}
              onClick={() => handleThemeChange("system")}
              icon={<ComputerIcon />}
              label={lang.pages.settings.themeSystem}
            />
          </div>
        </section>

        {/* Data Source Section */}
        <section className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/70 shadow-sm p-4 sm:p-5 space-y-2">
          <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
            {lang.pages.settings.dataSource}
          </h2>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                env.features.useMockData
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  env.features.useMockData ? "bg-amber-500" : "bg-emerald-500"
                )}
              />
              {env.features.useMockData
                ? lang.pages.settings.mockMode
                : lang.pages.settings.liveMode}
            </span>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}

// ============================================
// Sub-components
// ============================================

interface ThemeButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function ThemeButton({ active, onClick, icon, label }: ThemeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-2 p-3 sm:p-4 rounded-xl",
        "border-2 transition-all duration-200",
        "min-h-[80px] sm:min-h-[90px]",
        active
          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400"
      )}
    >
      <span className="w-5 h-5 sm:w-6 sm:h-6">{icon}</span>
      <span className="text-xs sm:text-sm font-medium">{label}</span>
    </button>
  );
}

// ============================================
// Icons
// ============================================

function SunIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  );
}

function ComputerIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}
