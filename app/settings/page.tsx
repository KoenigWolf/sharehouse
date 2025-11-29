"use client";

import { useEffect, useState } from "react";
import { PageContainer } from "@/src/shared/layouts";
import { useLanguage } from "@/src/shared/lang/context";
import type { LangCode } from "@/src/shared/lang";
import { env } from "@/src/config";

const LANG_OPTIONS: Array<{ code: LangCode; label: string }> = [
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "it", label: "Italiano" },
  { code: "es", label: "Español" },
  { code: "zh", label: "中文" },
];

const STORAGE_KEY = "app_lang";

export default function SettingsPage() {
  const { code, setCode, lang } = useLanguage();
  const [langCode, setLangCode] = useState<LangCode>(code);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => setSaved(false), 1500);
    return () => clearTimeout(timer);
  }, [saved]);

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, langCode);
    setCode(langCode);
    setSaved(true);
  };

  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-6 sm:space-y-8">
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

        <section className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/70 shadow-sm p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                {lang.pages.settings.language}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">{lang.pages.settings.languageDesc}</p>
            </div>
            {saved && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                {lang.pages.settings.saved}
              </span>
            )}
          </div>
          <select
            value={langCode}
            onChange={(e) => setLangCode(e.target.value as LangCode)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {LANG_OPTIONS.map((opt) => (
              <option key={opt.code} value={opt.code}>
                {opt.label}
              </option>
            ))}
          </select>
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{lang.pages.settings.applyNote}</span>
          <button
            onClick={handleSave}
            className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Save
          </button>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Sample (current selection): {lang.nav.residents}, {lang.pages.home.title}
        </div>
        </section>

        <section className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/70 shadow-sm p-4 sm:p-5 space-y-2">
          <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
            {lang.pages.settings.dataSource}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {env.features.useMockData ? lang.pages.settings.mockMode : lang.pages.settings.liveMode}
          </p>
        </section>
      </div>
    </PageContainer>
  );
}
