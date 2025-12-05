"use client";

/**
 * Design Tokens (Tailwind utility presets)
 * Central place to fetch role-based classes instead of hardcoding colors.
 */
export type Tone =
  | "primary"
  | "accent"
  | "warm"
  | "success"
  | "danger"
  | "neutral";

const gradients: Record<Tone, string> = {
  primary: "from-emerald-600 via-teal-500 to-amber-400",
  accent: "from-emerald-500 to-teal-500",
  warm: "from-amber-500 to-orange-500",
  success: "from-emerald-500 to-teal-500",
  danger: "from-rose-500 to-orange-500",
  neutral: "from-slate-500 to-slate-600",
};

const text: Record<Tone, string> = {
  primary: "text-brand",
  accent: "text-brand",
  warm: "text-amber-600 dark:text-amber-300",
  success: "text-emerald-600 dark:text-emerald-300",
  danger: "text-rose-600 dark:text-rose-300",
  neutral: "text-slate-600 dark:text-slate-300",
};

export const designTokens = {
  gradient(tone: Tone = "primary") {
    return `bg-linear-to-r ${gradients[tone]}`;
  },
  text(tone: Tone = "primary") {
    return text[tone];
  },
  shadow(tone: Tone = "primary") {
    const map: Record<Tone, string> = {
      primary: "shadow-emerald-500/20",
      accent: "shadow-emerald-500/15",
      warm: "shadow-amber-500/20",
      success: "shadow-emerald-500/20",
      danger: "shadow-rose-500/25",
      neutral: "shadow-slate-500/15",
    };
    return map[tone];
  },
};

