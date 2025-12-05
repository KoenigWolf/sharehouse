"use client";

/**
 * Login Page
 * Authentication form for residents
 */

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/src/shared/ui";
import { useAuth } from "@/src/features/auth";
import { useLanguage } from "@/src/shared/lang/context";
import { Home, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();
  const { lang } = useLanguage();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await signIn(email, password);
      router.push("/");
      router.refresh();
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
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              Share<span className="gradient-text">House</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              {lang.pages.login.subtitle}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
          </form>
        </div>
      </div>
    </div>
  );
}
