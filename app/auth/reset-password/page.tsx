"use client";

/**
 * Reset Password Page
 * Allows users to set a new password after clicking the reset link
 */

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/src/shared/ui";
import { useAuth } from "@/src/features/auth";
import { useLanguage } from "@/src/shared/lang/context";
import { cn } from "@/src/lib/utils";
import { Home, Loader2, CheckCircle, KeyRound } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const { updatePassword, user, loading } = useAuth();
  const { lang } = useLanguage();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError(lang.pages.resetPassword.passwordTooShort);
      return;
    }

    if (password !== confirmPassword) {
      setError(lang.pages.resetPassword.passwordMismatch);
      return;
    }

    setIsLoading(true);

    try {
      await updatePassword(password);
      setIsSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : lang.pages.login.errorMessage
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-amber-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-teal-950/30">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

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
              Share<span className="gradient-text">House</span>
            </h1>
            <p className="text-muted dark:text-subtle mt-2">
              {isSuccess
                ? lang.pages.resetPassword.success
                : lang.pages.resetPassword.subtitle}
            </p>
          </div>

          {/* Success State */}
          {isSuccess && (
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-center">
                <CheckCircle className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  {lang.pages.resetPassword.successDescription}
                </p>
              </div>
              <Link href="/login" className="block">
                <Button className="w-full h-12">
                  {lang.pages.resetPassword.goToLogin}
                </Button>
              </Link>
            </div>
          )}

          {/* Form */}
          {!isSuccess && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                id="new-password"
                type="password"
                label={lang.pages.resetPassword.newPassword}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                placeholder={lang.pages.resetPassword.newPasswordPlaceholder}
              />

              <Input
                id="confirm-password"
                type="password"
                label={lang.pages.resetPassword.confirmPassword}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                placeholder={lang.pages.resetPassword.confirmPasswordPlaceholder}
              />

              {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full h-12" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {lang.pages.resetPassword.updating}
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 mr-2" />
                    {lang.pages.resetPassword.updateButton}
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
