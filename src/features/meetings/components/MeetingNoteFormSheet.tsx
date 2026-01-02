"use client";

import { useEffect, useRef } from "react";
import { X, NotebookPen, Pencil } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useMeetingNote } from "../hooks";
import { MeetingNoteForm } from "./MeetingNoteForm";

interface MeetingNoteFormSheetProps {
  mode: "create" | "edit";
  noteId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function MeetingNoteFormSheet({
  mode,
  noteId,
  isOpen,
  onClose,
  onSuccess,
}: MeetingNoteFormSheetProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const { note, loading } = useMeetingNote(mode === "edit" ? noteId : undefined);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handler);
    }
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.focus();
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSuccess = () => {
    onSuccess?.();
    onClose();
  };

  const isEditMode = mode === "edit";
  const title = isEditMode ? "会議記録を編集" : "新しい会議記録";
  const Icon = isEditMode ? Pencil : NotebookPen;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        tabIndex={-1}
        className={cn(
          "relative w-full sm:w-[600px] max-h-[90vh] overflow-auto",
          "bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl",
          "outline-none"
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-sheet-title"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-5 pt-4 pb-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-emerald-600 via-teal-500 to-amber-400 text-white flex items-center justify-center shadow shadow-emerald-500/20">
              <Icon className="w-4 h-4" />
            </div>
            <h2
              id="form-sheet-title"
              className="text-sm font-semibold text-strong"
            >
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-muted hover:text-strong hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label="閉じる"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 sm:px-5 py-4">
          {isEditMode && loading ? (
            <div className="py-8 text-center text-sm text-muted">
              読み込み中...
            </div>
          ) : (
            <MeetingNoteForm
              note={isEditMode ? note : undefined}
              onSuccess={handleSuccess}
              onCancel={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}
