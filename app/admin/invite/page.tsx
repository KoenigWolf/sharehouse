"use client";

/**
 * Admin Invite Page
 * Allows admins to invite new residents via email
 */

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/src/shared/ui";
import { useLanguage } from "@/src/shared/lang/context";
import { cn } from "@/src/lib/utils";
import { FLOORS } from "@/src/shared/constants";
import { Home, Loader2, CheckCircle, UserPlus, Mail } from "lucide-react";

type ViewState = "form" | "success";

export default function AdminInvitePage() {
  const [email, setEmail] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [floor, setFloor] = useState(FLOORS[0]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewState, setViewState] = useState<ViewState>("form");
  const { lang } = useLanguage();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, roomNumber, floor }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send invitation");
      }

      setViewState("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send invitation");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setRoomNumber("");
    setFloor(FLOORS[0]);
    setError(null);
    setViewState("form");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-amber-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-teal-950/30 px-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200/30 dark:bg-emerald-500/12 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-amber-200/30 dark:bg-amber-500/12 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white dark:bg-slate-800/80 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700/50 p-8 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-500 to-amber-400 shadow-lg shadow-emerald-500/30 mb-4">
              <Home className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold text-strong dark:text-white">
              {lang.pages.invite.title}
            </h1>
            <p className="text-muted dark:text-subtle mt-2">
              {viewState === "success"
                ? lang.pages.invite.success
                : lang.pages.invite.subtitle}
            </p>
          </div>

          {/* Success State */}
          {viewState === "success" && (
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-center">
                <CheckCircle className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  {lang.pages.invite.successDescription}
                </p>
              </div>
              <Button
                type="button"
                className="w-full h-12"
                onClick={resetForm}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {lang.pages.invite.sendAnother}
              </Button>
            </div>
          )}

          {/* Form */}
          {viewState === "form" && (
            <form onSubmit={handleSubmit} className="space-y-6" suppressHydrationWarning>
              <Input
                id="email"
                type="email"
                label={lang.pages.invite.emailLabel}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder={lang.pages.invite.emailPlaceholder}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="roomNumber"
                  type="text"
                  label={lang.pages.invite.roomLabel}
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder={lang.pages.invite.roomPlaceholder}
                />

                <div>
                  <label
                    htmlFor="floor"
                    className="block text-sm font-medium text-strong dark:text-white mb-2"
                  >
                    {lang.pages.invite.floorLabel}
                  </label>
                  <select
                    id="floor"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value as typeof floor)}
                    className={cn(
                      "w-full h-12 px-4 rounded-xl",
                      "bg-slate-50 dark:bg-slate-900/50",
                      "border border-slate-200 dark:border-slate-700",
                      "text-strong dark:text-white",
                      "focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    )}
                  >
                    {FLOORS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full h-12" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {lang.pages.invite.sending}
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    {lang.pages.invite.sendInvite}
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
