"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/src/lib/utils";

// ============================================
// Types
// ============================================

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

// ============================================
// Styles
// ============================================

const baseInputStyles = `
  w-full px-4 py-3 rounded-xl
  bg-slate-50 dark:bg-slate-700/50
  border border-slate-200 dark:border-slate-600
  text-slate-800 dark:text-slate-200
  placeholder-slate-400 dark:placeholder-slate-500
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
  disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-slate-800
`;

const errorInputStyles = `
  border-red-500 dark:border-red-500
  focus:ring-red-500
`;

// ============================================
// Component
// ============================================

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            baseInputStyles,
            error && errorInputStyles,
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          suppressHydrationWarning
          {...props}
        />
        {error && (
          <p id={`${id}-error`} className="mt-2 text-sm text-red-500 dark:text-red-400">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${id}-hint`} className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
