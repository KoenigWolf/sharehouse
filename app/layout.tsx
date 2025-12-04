import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/src/shared/lang";
import { RoutePreloader } from "@/src/shared/ui";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
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
    <html lang="ja" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased safe-area-inset`}
        suppressHydrationWarning
      >
        {/* Skip link for accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <LanguageProvider>
          <RoutePreloader />
          <div id="main-content">{children}</div>
        </LanguageProvider>
      </body>
    </html>
  );
}
