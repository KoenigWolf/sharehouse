import { t } from "@/src/shared/lang";
import { Card, CardContent } from "@/components/ui/card";
import type { NoticeSection } from "../types";

interface NoticeBoardProps {
  sections: NoticeSection[];
}

export function NoticeBoard({ sections }: NoticeBoardProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      {sections.map((section) => (
        <section key={section.id} className="space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
            {section.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
            {section.items.map((item, idx) => (
              <Card
                key={`${section.id}-${idx}`}
                className="dark:bg-slate-800/70 dark:border-slate-700/60"
              >
                <CardContent className="p-4 sm:p-5 space-y-3">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  {item.content && (
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-line">
                      {item.content}
                    </p>
                  )}
                  {item.list && (
                    <ul className="space-y-1.5">
                      {item.list.map((line, i) => (
                        <li
                          key={i}
                          className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed"
                        >
                          • {line}
                        </li>
                      ))}
                    </ul>
                  )}
                  {item.table && (
                    <div className="overflow-auto">
                      <table className="min-w-full text-sm text-left border border-slate-200 dark:border-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300">
                          <tr>
                            {item.table.headers.map((h) => (
                              <th key={h} className="px-3 py-2 border-b border-slate-200 dark:border-slate-700">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {item.table.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="divide-x divide-slate-200 dark:divide-slate-700">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="px-3 py-2 text-slate-700 dark:text-slate-200">
                                  {cell || t.common.emptyCell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
