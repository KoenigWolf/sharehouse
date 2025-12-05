"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { PageContainer } from "@/src/shared/layouts";
import { useLanguage } from "@/src/shared/lang/context";
import type { LangCode } from "@/src/shared/lang";
import { env } from "@/src/config";
import { cn } from "@/src/lib/utils";
import {
  Sun,
  Moon,
  Monitor,
  Languages,
  Palette,
  Sparkles,
  Shield,
  Server,
  Check,
} from "lucide-react";

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

  const preferenceSummary = useMemo(() => {
    const themeLabel =
      theme === "light"
        ? lang.pages.settings.themeLight
        : theme === "dark"
          ? lang.pages.settings.themeDark
          : lang.pages.settings.themeSystem;
    const sourceLabel = env.features.useMockData
      ? lang.pages.settings.mockMode
      : lang.pages.settings.liveMode;
    return { themeLabel, sourceLabel };
  }, [lang.pages.settings.themeDark, lang.pages.settings.themeLight, lang.pages.settings.themeSystem, lang.pages.settings.liveMode, lang.pages.settings.mockMode, theme]);

  return (
    <PageContainer>
      <div className="relative">
        <div
          className={cn(
            "absolute inset-0 -z-10",
            "gradient-brand-soft",
            "dark:from-teal-950/40 dark:via-slate-950/60 dark:to-transparent"
          )}
          aria-hidden="true"
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-14 space-y-8 sm:space-y-10">
          <Hero lang={lang} saved={saved} preferenceSummary={preferenceSummary} code={code} />

          <div className="grid gap-6 lg:gap-8 lg:grid-cols-[1.4fr,1fr]">
            <div className="space-y-6 lg:space-y-8">
              <LanguageSection
                code={code}
                onChange={handleLanguageChange}
                lang={lang}
                saved={saved}
              />
              <ThemeSection theme={theme} onChange={handleThemeChange} lang={lang} />
            </div>
            <aside className="space-y-6 lg:space-y-8">
              <DataSourceCard lang={lang} />
              <LiveStatus lang={lang} code={code} themeLabel={preferenceSummary.themeLabel} />
            </aside>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

function Hero({
  lang,
  saved,
  preferenceSummary,
  code,
}: {
  lang: ReturnType<typeof useLanguage>["lang"];
  saved: boolean;
  preferenceSummary: { themeLabel: string; sourceLabel: string };
  code: LangCode;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl border border-slate-200/70 dark:border-slate-800/70",
        "bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl",
        "shadow-[0_25px_80px_-40px] shadow-emerald-500/25 p-6 sm:p-8 lg:p-10"
      )}
      aria-labelledby="settings-hero-title"
    >
      <div className="absolute inset-0 opacity-70" aria-hidden="true">
        <div className="absolute -left-10 sm:-left-16 top-0 w-40 sm:w-56 h-40 sm:h-56 bg-linear-to-br from-emerald-500/18 via-teal-400/18 to-amber-300/14 blur-3xl" />
        <div className="absolute right-0 -bottom-16 w-48 sm:w-64 h-48 sm:h-64 bg-linear-to-tr from-amber-400/20 via-rose-300/15 to-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative grid gap-6 lg:gap-8 lg:grid-cols-[1.5fr,1fr] items-start">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-600 via-teal-500 to-amber-400 text-white shadow-lg shadow-emerald-500/30">
              <Sparkles className="h-6 w-6" strokeWidth={2.25} />
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-[0.18em] bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md shadow-emerald-500/20">
              {lang.pages.settings.eyebrow}
            </span>
            {saved && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                <Check className="w-4 h-4" />
                {lang.pages.settings.saved}
              </span>
            )}
          </div>
          <div className="space-y-3">
            <h1
              id="settings-hero-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-slate-900 dark:text-white"
            >
              {lang.pages.settings.title}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
              {lang.pages.settings.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            <BadgePill icon={<Languages className="h-3.5 w-3.5" />} label={`${lang.pages.settings.language}: ${code.toUpperCase()}`} />
            <BadgePill icon={<Palette className="h-3.5 w-3.5" />} label={`${lang.pages.settings.theme}: ${preferenceSummary.themeLabel}`} />
            <BadgePill icon={<Server className="h-3.5 w-3.5" />} label={preferenceSummary.sourceLabel} />
          </div>
        </div>

        <div className="grid gap-3 sm:gap-4">
          <HeroStat label={lang.pages.settings.language} value={code.toUpperCase()} icon={Languages} />
          <HeroStat label={lang.pages.settings.theme} value={preferenceSummary.themeLabel} icon={Palette} />
          <HeroStat
            label={lang.pages.settings.dataSource}
            value={preferenceSummary.sourceLabel}
            icon={Shield}
            accent={env.features.useMockData ? "from-amber-400 to-orange-500" : "from-emerald-500 to-teal-500"}
          />
        </div>
      </div>
    </section>
  );
}

function BadgePill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/70 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200">
      {icon}
      {label}
    </span>
  );
}

function HeroStat({
  label,
  value,
  icon: Icon,
  accent = "from-emerald-600 via-teal-500 to-amber-400",
}: {
  label: string;
  value: string;
  icon: typeof Sun;
  accent?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/70",
        "bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm",
        "shadow-md shadow-emerald-500/10 px-4 py-3"
      )}
    >
      <div className={cn("h-10 w-10 rounded-xl text-white flex items-center justify-center bg-linear-to-br", accent)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 font-semibold">{label}</p>
        <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white truncate">{value}</p>
      </div>
    </div>
  );
}

function LanguageSection({
  code,
  onChange,
  lang,
  saved,
}: {
  code: LangCode;
  onChange: (c: LangCode) => void;
  lang: ReturnType<typeof useLanguage>["lang"];
  saved: boolean;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white/90 dark:bg-slate-900/70 backdrop-blur-sm shadow-lg shadow-emerald-500/5 p-5 sm:p-6 space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Languages className="h-5 w-5 text-emerald-600" />
            {lang.pages.settings.language}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">{lang.pages.settings.languageDesc}</p>
        </div>
        {saved && (
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-300 inline-flex items-center gap-1">
            <Check className="w-4 h-4" />
            {lang.pages.settings.saved}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
        {LANG_OPTIONS.map((opt) => {
          const isActive = code === opt.code;
          return (
            <button
              key={opt.code}
              type="button"
              onClick={() => onChange(opt.code)}
              aria-pressed={isActive}
              className={cn(
                "flex flex-col items-start gap-1 rounded-xl border p-3 sm:p-4 text-left transition-all duration-200",
                "min-h-[72px]",
                isActive
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-slate-900 dark:text-white shadow-md shadow-emerald-500/20"
                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-emerald-200 dark:hover:border-emerald-700"
              )}
            >
              <span className="text-sm font-semibold">{opt.label}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">{opt.code}</span>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">{lang.pages.settings.applyNote}</p>
    </section>
  );
}

function ThemeSection({
  theme,
  onChange,
  lang,
}: {
  theme: Theme;
  onChange: (t: Theme) => void;
  lang: ReturnType<typeof useLanguage>["lang"];
}) {
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white/90 dark:bg-slate-900/70 backdrop-blur-sm shadow-lg shadow-emerald-500/5 p-5 sm:p-6 space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Palette className="h-5 w-5 text-emerald-600" />
          {lang.pages.settings.theme}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">{lang.pages.settings.themeDesc}</p>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <ThemeButton
          active={theme === "light"}
          onClick={() => onChange("light")}
          icon={<Sun className="w-full h-full" strokeWidth={1.5} />}
          label={lang.pages.settings.themeLight}
        />
        <ThemeButton
          active={theme === "dark"}
          onClick={() => onChange("dark")}
          icon={<Moon className="w-full h-full" strokeWidth={1.5} />}
          label={lang.pages.settings.themeDark}
        />
        <ThemeButton
          active={theme === "system"}
          onClick={() => onChange("system")}
          icon={<Monitor className="w-full h-full" strokeWidth={1.5} />}
          label={lang.pages.settings.themeSystem}
        />
      </div>
    </section>
  );
}

function DataSourceCard({ lang }: { lang: ReturnType<typeof useLanguage>["lang"] }) {
  const isMock = env.features.useMockData;
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white/90 dark:bg-slate-900/70 backdrop-blur-sm shadow-lg shadow-emerald-500/5 p-5 sm:p-6 space-y-3">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-emerald-600" />
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          {lang.pages.settings.dataSource}
        </h2>
      </div>
      <div
        className={cn(
          "flex items-center justify-between rounded-xl border px-3.5 py-3",
          isMock
            ? "border-amber-200 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-900/20"
            : "border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/70 dark:bg-emerald-900/20"
        )}
      >
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
              isMock
                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"
                : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
            )}
          >
            <span className={cn("w-1.5 h-1.5 rounded-full", isMock ? "bg-amber-500" : "bg-emerald-500")} />
            {isMock ? lang.pages.settings.mockMode : lang.pages.settings.liveMode}
          </span>
          <p className="text-sm text-slate-700 dark:text-slate-200">
            {isMock ? lang.pages.settings.mockMode : lang.pages.settings.liveMode}
          </p>
        </div>
        <Server className={cn("h-5 w-5", isMock ? "text-amber-600 dark:text-amber-300" : "text-emerald-600 dark:text-emerald-300")} />
      </div>
    </section>
  );
}

function LiveStatus({
  lang,
  code,
  themeLabel,
}: {
  lang: ReturnType<typeof useLanguage>["lang"];
  code: LangCode;
  themeLabel: string;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white/90 dark:bg-slate-900/70 backdrop-blur-sm shadow-lg shadow-emerald-500/5 p-5 sm:p-6 space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-emerald-600" />
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          {lang.pages.settings.title}
        </h2>
      </div>
      <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
        <li className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {lang.pages.settings.language}: {code.toUpperCase()}
        </li>
        <li className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {lang.pages.settings.theme}: {themeLabel}
        </li>
        <li className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-slate-500" />
          {lang.pages.settings.applyNote}
        </li>
      </ul>
    </section>
  );
}

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
          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
          : "border-slate-200 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-700 text-slate-600 dark:text-slate-400"
      )}
    >
      <span className="w-5 h-5 sm:w-6 sm:h-6">{icon}</span>
      <span className="text-xs sm:text-sm font-medium">{label}</span>
    </button>
  );
}
