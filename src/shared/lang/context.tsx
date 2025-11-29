"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getLang } from "./registry";
import type { BaseLang, LangCode } from "./types";
import { setLang, getCurrentLang } from "./registry";

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
  const [code, setCode] = useState<LangCode>("en");

  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? (localStorage.getItem(STORAGE_KEY) as LangCode | null)
        : null;
    if (stored) {
      setCode(stored);
      setLang(stored);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, code);
      setLang(code);
    }
  }, [code]);

  const value = useMemo(
    () => ({
      code,
      lang: getCurrentLang(),
      setCode,
    }),
    [code]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLanguage() {
  return useContext(LangContext);
}
