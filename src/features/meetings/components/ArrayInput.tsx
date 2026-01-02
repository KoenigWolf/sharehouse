"use client";

import { Plus, X } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface ArrayInputProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  addLabel?: string;
}

export function ArrayInput({
  label,
  items,
  onChange,
  placeholder = "",
  addLabel = "追加",
}: ArrayInputProps) {
  const handleItemChange = (index: number, value: string) => {
    const updated = [...items];
    updated[index] = value;
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    onChange([...items, ""]);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
    if (e.key === "Backspace" && items[index] === "" && items.length > 1) {
      e.preventDefault();
      handleRemove(index);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-strong">{label}</label>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => handleItemChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              placeholder={placeholder}
              className={cn(
                "flex-1 px-3 py-2 rounded-lg",
                "bg-white dark:bg-slate-800",
                "border border-slate-200 dark:border-slate-700",
                "text-sm text-strong",
                "placeholder:text-muted",
                "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent",
                "transition-all duration-200"
              )}
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className={cn(
                "p-2 rounded-lg",
                "text-muted hover:text-red-500",
                "hover:bg-red-50 dark:hover:bg-red-900/20",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500",
                "transition-colors"
              )}
              aria-label="削除"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg",
          "text-sm font-medium",
          "text-emerald-600 dark:text-emerald-400",
          "hover:bg-emerald-50 dark:hover:bg-emerald-900/20",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
          "transition-colors"
        )}
      >
        <Plus className="w-4 h-4" />
        {addLabel}
      </button>
    </div>
  );
}
