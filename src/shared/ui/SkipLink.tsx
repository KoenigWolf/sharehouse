"use client";

import { useLanguage } from "@/src/shared/lang/context";

export function SkipLink() {
  const { lang } = useLanguage();

  return (
    <a href="#main-content" className="skip-link">
      {lang.common.skipLink}
    </a>
  );
}
