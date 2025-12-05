"use client";

import { memo } from "react";
import { PageContainer } from "@/src/shared/layouts";
import { NoticeBoard, noticeSections } from "@/src/features/notices";
import { useLanguage } from "@/src/shared/lang/context";
import { cn } from "@/src/lib/utils";
import {
  Bell,
  FileText,
  Shield,
  Wifi,
  Home,
  AlertTriangle,
  BookOpen,
} from "lucide-react";

export default function NoticesPage() {
  const { lang } = useLanguage();

  return (
    <PageContainer>
      <div className="relative">
        <div
          className={cn(
            "absolute inset-0 -z-10",
            "gradient-brand-soft",
            "dark:from-teal-950/30 dark:via-slate-950/20 dark:to-transparent"
          )}
          aria-hidden="true"
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-14 space-y-10 sm:space-y-12 lg:space-y-16">
          <HeroSection lang={lang} sectionCount={noticeSections.length} />
          <NoticeBoard sections={noticeSections} />
        </div>
      </div>
    </PageContainer>
  );
}

interface HeroSectionProps {
  lang: ReturnType<typeof useLanguage>["lang"];
  sectionCount: number;
}

const HeroSection = memo(function HeroSection({ lang, sectionCount }: HeroSectionProps) {
  const quickLinks = [
    { icon: Shield, label: "防災", color: "from-emerald-600 via-teal-500 to-amber-400" },
    { icon: Wifi, label: "Wi-Fi", color: "from-emerald-500 to-teal-500" },
    { icon: Home, label: "フロア", color: "from-amber-500 to-orange-500" },
  ];

  return (
    <header className="relative">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl",
                "bg-linear-to-br from-emerald-600 via-teal-500 to-amber-400",
                "shadow-xl shadow-emerald-500/25"
              )}
            >
              <Bell className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2} />
            </div>
            <span
              className={cn(
                "text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider",
                "bg-linear-to-r from-emerald-600 via-teal-500 to-amber-400 text-white",
                "shadow-lg shadow-emerald-500/20"
              )}
            >
              {lang.pages.notices.eyebrow}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
            {lang.pages.notices.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            {lang.pages.notices.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {quickLinks.map(({ icon: Icon, label, color }) => (
            <div
              key={label}
              className={cn(
                "flex items-center gap-2.5 px-4 py-3 rounded-xl",
                "bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm",
                "border border-slate-200/80 dark:border-slate-700/60",
                "shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg",
                  "bg-linear-to-br text-white",
                  color
                )}
              >
                <Icon className="w-4 h-4" strokeWidth={2} />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center gap-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50">
        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/50">
          <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" strokeWidth={2} />
        </div>
        <div>
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
            {sectionCount}カテゴリの情報を掲載
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400">
            各セクションをクリックして展開・折りたたみできます
          </p>
        </div>
      </div>
    </header>
  );
});
