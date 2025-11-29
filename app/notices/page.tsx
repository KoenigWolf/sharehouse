"use client";

import { PageContainer } from "@/src/shared/layouts";
import { NoticeBoard, noticeSections } from "@/src/features/notices";
import { t } from "@/src/shared/lang";

export default function NoticesPage() {
  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-8 sm:space-y-10">
        <header className="space-y-2 sm:space-y-3">
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-300 uppercase tracking-wide">
            {t.pages.notices.eyebrow}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {t.pages.notices.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl">
            {t.pages.notices.description}
          </p>
        </header>

        <NoticeBoard sections={noticeSections} />
      </div>
    </PageContainer>
  );
}
