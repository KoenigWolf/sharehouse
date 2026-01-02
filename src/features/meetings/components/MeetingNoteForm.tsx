"use client";

import { useState, type FormEvent } from "react";
import { Check, Save, AlertCircle } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrayInput } from "./ArrayInput";
import { useMeetingNoteMutation } from "../hooks";
import type { MeetingNote, MeetingNoteFormData } from "../types";

interface MeetingNoteFormProps {
  note?: MeetingNote;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function MeetingNoteForm({
  note,
  onSuccess,
  onCancel,
}: MeetingNoteFormProps) {
  const isEditMode = !!note;
  const { createNote, updateNote, isLoading } = useMeetingNoteMutation();

  const [date, setDate] = useState(note?.date || "");
  const [title, setTitle] = useState(note?.title || "");
  const [summary, setSummary] = useState(note?.summary || "");
  const [decisions, setDecisions] = useState<string[]>(
    note?.decisions?.length ? note.decisions : [""]
  );
  const [actionItems, setActionItems] = useState<string[]>(
    note?.actionItems?.length ? note.actionItems : [""]
  );
  const [attendees, setAttendees] = useState<string[]>(
    note?.attendees?.length ? note.attendees : [""]
  );
  const [content, setContent] = useState(note?.content || "");
  const [docUrl, setDocUrl] = useState(note?.docUrl || "");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!date) {
      setError("日付は必須です");
      return;
    }
    if (!title.trim()) {
      setError("タイトルは必須です");
      return;
    }
    if (title.length > 200) {
      setError("タイトルは200文字以内にしてください");
      return;
    }

    setError(null);

    const formData: MeetingNoteFormData = {
      date,
      title: title.trim(),
      summary: summary.trim(),
      decisions: decisions.filter((d) => d.trim()),
      actionItems: actionItems.filter((a) => a.trim()),
      attendees: attendees.filter((a) => a.trim()),
      content: content.trim() || undefined,
      docUrl: docUrl.trim() || undefined,
    };

    try {
      if (isEditMode && note) {
        await updateNote(note.id, formData);
      } else {
        await createNote(formData);
      }
      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存に失敗しました");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {success && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
          <Check className="w-5 h-5" />
          <span className="text-sm font-medium">
            {isEditMode ? "更新しました" : "作成しました"}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-strong mb-1.5"
          >
            日付 <span className="text-red-500">*</span>
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className={cn(
              "w-full px-3 py-2 rounded-lg",
              "bg-white dark:bg-slate-800",
              "border border-slate-200 dark:border-slate-700",
              "text-sm text-strong",
              "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent",
              "transition-all duration-200"
            )}
          />
        </div>

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-strong mb-1.5"
          >
            タイトル <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={200}
            placeholder="例: 1月 住民会議"
            className={cn(
              "w-full px-3 py-2 rounded-lg",
              "bg-white dark:bg-slate-800",
              "border border-slate-200 dark:border-slate-700",
              "text-sm text-strong",
              "placeholder:text-muted",
              "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent",
              "transition-all duration-200"
            )}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="summary"
          className="block text-sm font-medium text-strong mb-1.5"
        >
          サマリー
        </label>
        <textarea
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={2}
          placeholder="会議の概要を記入..."
          className={cn(
            "w-full px-3 py-2 rounded-lg resize-none",
            "bg-white dark:bg-slate-800",
            "border border-slate-200 dark:border-slate-700",
            "text-sm text-strong",
            "placeholder:text-muted",
            "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent",
            "transition-all duration-200"
          )}
        />
      </div>

      <ArrayInput
        label="決定事項"
        items={decisions}
        onChange={setDecisions}
        placeholder="決定した内容を記入..."
        addLabel="決定事項を追加"
      />

      <ArrayInput
        label="アクションアイテム"
        items={actionItems}
        onChange={setActionItems}
        placeholder="やることを記入..."
        addLabel="アクションを追加"
      />

      <ArrayInput
        label="参加者"
        items={attendees}
        onChange={setAttendees}
        placeholder="名前を記入..."
        addLabel="参加者を追加"
      />

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-strong mb-1.5"
        >
          詳細メモ（任意）
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          placeholder="詳細なメモがあれば記入..."
          className={cn(
            "w-full px-3 py-2 rounded-lg resize-none",
            "bg-white dark:bg-slate-800",
            "border border-slate-200 dark:border-slate-700",
            "text-sm text-strong",
            "placeholder:text-muted",
            "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent",
            "transition-all duration-200"
          )}
        />
      </div>

      <div>
        <label
          htmlFor="docUrl"
          className="block text-sm font-medium text-strong mb-1.5"
        >
          ドキュメントURL（任意）
        </label>
        <input
          id="docUrl"
          type="url"
          value={docUrl}
          onChange={(e) => setDocUrl(e.target.value)}
          placeholder="https://..."
          className={cn(
            "w-full px-3 py-2 rounded-lg",
            "bg-white dark:bg-slate-800",
            "border border-slate-200 dark:border-slate-700",
            "text-sm text-strong",
            "placeholder:text-muted",
            "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent",
            "transition-all duration-200"
          )}
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <Button
          type="submit"
          disabled={isLoading || success}
          className="flex-1 h-11"
        >
          {isLoading ? (
            "保存中..."
          ) : success ? (
            <>
              <Check className="w-4 h-4" />
              保存しました
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {isEditMode ? "更新する" : "作成する"}
            </>
          )}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="h-11"
          >
            キャンセル
          </Button>
        )}
      </div>
    </form>
  );
}
