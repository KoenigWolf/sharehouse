"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getLang, setLang } from "./registry";
import type { BaseLang, LangCode } from "./types";

interface LangContextValue {
  code: LangCode;
  lang: BaseLang;
  setCode: (code: LangCode) => void;
}

const LangContext = createContext<LangContextValue>({
  code: "en",
  lang: getLang("en"),
  setCode: () => {},
});

const STORAGE_KEY = "app_lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [code, setCodeState] = useState<LangCode>("en");

  // Load saved language on mount
  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? (localStorage.getItem(STORAGE_KEY) as LangCode | null)
        : null;
    if (stored) {
      setCodeState(stored);
      setLang(stored);
    }
  }, []);

  // Update registry and localStorage when code changes
  const setCode = (newCode: LangCode) => {
    setCodeState(newCode);
    setLang(newCode);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, newCode);
    }
  };

  // Compute lang directly from code to ensure reactivity
  const value = useMemo(
    () => ({
      code,
      lang: getLang(code),
      setCode,
    }),
    [code]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLanguage() {
  return useContext(LangContext);
}
