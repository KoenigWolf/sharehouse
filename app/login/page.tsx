"use client";

/**
 * Login Page
 * Authentication form for residents
 */

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/src/shared/ui";
import { useAuth } from "@/src/features/auth";
import { useLanguage } from "@/src/shared/lang/context";
import { cn } from "@/src/lib/utils";
import { Home, Loader2, Mail, MessageCircle, HelpCircle, ChevronDown, ExternalLink, ArrowLeft, CheckCircle } from "lucide-react";

type ViewMode = "login" | "reset" | "reset-sent";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("login");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, resetPassword } = useAuth();
  const { lang } = useLanguage();

  const redirectTo = searchParams.get("redirect") || "/";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await signIn(email, password);
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : lang.pages.login.errorMessage
      );
      setShowHelp(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await resetPassword(email);
      setViewMode("reset-sent");
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

  const switchToReset = () => {
    setError(null);
    setViewMode("reset");
  };

  const switchToLogin = () => {
    setError(null);
    setViewMode("login");
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
              Share<span className="gradient-text">House</span>
            </h1>
            <p className="text-muted dark:text-subtle mt-2">
              {viewMode === "login" && lang.pages.login.subtitle}
              {viewMode === "reset" && lang.pages.login.resetPassword}
              {viewMode === "reset-sent" && lang.pages.login.resetEmailSent}
            </p>
          </div>

          {/* Reset Email Sent Confirmation */}
          {viewMode === "reset-sent" && (
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-center">
                <CheckCircle className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  {lang.pages.login.resetEmailSentDescription}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full h-12"
                onClick={switchToLogin}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {lang.pages.login.backToLogin}
              </Button>
            </div>
          )}

          {/* Password Reset Form */}
          {viewMode === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-6" suppressHydrationWarning>
              <Input
                id="reset-email"
                type="email"
                label={lang.pages.login.emailLabel}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder={lang.pages.login.emailPlaceholder}
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
                    {lang.pages.login.sending}
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    {lang.pages.login.sendResetEmail}
                  </>
                )}
              </Button>

              <button
                type="button"
                onClick={switchToLogin}
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-2",
                  "text-sm text-muted hover:text-strong transition-colors"
                )}
              >
                <ArrowLeft className="w-4 h-4" />
                {lang.pages.login.backToLogin}
              </button>
            </form>
          )}

          {/* Login Form */}
          {viewMode === "login" && (
            <form onSubmit={handleSubmit} className="space-y-6" suppressHydrationWarning>
              <Input
                id="email"
                type="email"
                label={lang.pages.login.emailLabel}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder={lang.pages.login.emailPlaceholder}
              />

              <Input
                id="password"
                type="password"
                label={lang.pages.login.passwordLabel}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder={lang.pages.login.passwordPlaceholder}
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
                    {lang.pages.login.signingIn}
                  </>
                ) : (
                  lang.pages.login.signInButton
                )}
              </Button>

              <button
                type="button"
                onClick={switchToReset}
                className={cn(
                  "w-full text-center text-sm text-muted hover:text-emerald-600 dark:hover:text-emerald-400",
                  "transition-colors"
                )}
              >
                {lang.pages.login.forgotPassword}
              </button>
            </form>
          )}

          {/* Help Section - Only show on login view */}
          {viewMode === "login" && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setShowHelp(!showHelp)}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-xl",
                  "text-sm text-muted hover:text-strong",
                  "hover:bg-slate-50 dark:hover:bg-slate-800/50",
                  "transition-colors"
                )}
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  ログインできない場合
                </span>
                <ChevronDown className={cn(
                  "w-4 h-4 transition-transform duration-200",
                  showHelp && "rotate-180"
                )} />
              </button>

              {showHelp && (
                <div className="mt-3 space-y-3 animate-in slide-in-from-top-2 duration-200">
                  {/* Account Issues */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                      <HelpCircle className="w-4 h-4" />
                      アカウントがない・わからない場合
                    </h3>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 mb-3">
                      <li>• 新規入居者はまず管理者に登録を依頼してください</li>
                      <li>• メールアドレスが不明な場合は管理者に確認</li>
                      <li>• 退去済みの方はアクセス権限がありません</li>
                    </ul>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href="https://slack.com/app_redirect?channel=house-info"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium",
                          "bg-slate-600 text-white",
                          "hover:bg-slate-700 transition-colors"
                        )}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Slackで連絡する
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-200/50 dark:border-emerald-800/30">
                    <p className="text-xs text-emerald-700 dark:text-emerald-400">
                      💡 <strong>ヒント:</strong> ブラウザのパスワードマネージャーを使うと、次回から自動入力できます。
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
