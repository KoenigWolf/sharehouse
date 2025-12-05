import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/src/shared/lang";
import { RoutePreloader, SkipLink, NavigationProgress } from "@/src/shared/ui";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

/**
 * Viewport configuration for optimal mobile experience
 * - viewportFit: cover enables full-screen on notched devices
 * - interactiveWidget: resizes-content ensures proper keyboard handling
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export const metadata: Metadata = {
  title: "ShareHouse - Resident Information",
  description: "Sharehouse resident information management system",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ShareHouse",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

const themeScript = `
(function() {
  try {
    var theme = localStorage.getItem('app_theme');
    var isDark = theme === 'dark' ||
      (theme === 'system' || !theme) && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased safe-area-inset`}
        suppressHydrationWarning
      >
        <LanguageProvider>
          <SkipLink />
          <Suspense fallback={null}>
            <NavigationProgress />
          </Suspense>
          <RoutePreloader />
          <div id="main-content">{children}</div>
        </LanguageProvider>
      </body>
    </html>
  );
}
