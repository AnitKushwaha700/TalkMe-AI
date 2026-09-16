import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TalkMe AI — Free AI English Speaking Coach",
    template: "%s | TalkMe AI",
  },
  description:
    "Practice spoken English with an AI coach. Get real-time feedback on grammar, vocabulary, and pronunciation. 100% free, no signup required.",
  keywords: [
    "English speaking practice",
    "AI English coach",
    "speak English online",
    "grammar correction",
    "pronunciation practice",
    "CEFR level test",
    "free English learning",
    "conversation practice",
  ],
  authors: [{ name: "TalkMe AI" }],
  creator: "TalkMe AI",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TalkMe AI",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://talkme-ai.vercel.app",
    title: "TalkMe AI — Free AI English Speaking Coach",
    description:
      "Practice spoken English with AI. Real-time grammar corrections, vocabulary suggestions, and pronunciation tips. Free forever.",
    siteName: "TalkMe AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "TalkMe AI — Free AI English Speaking Coach",
    description:
      "Practice spoken English with AI. Real-time grammar corrections, vocabulary suggestions, and pronunciation tips.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <AppSidebar />
            <div className="flex-1 flex flex-col min-h-screen">
              <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
                <div className="flex items-center gap-2">
                  <SidebarTrigger className="-ml-1" />
                </div>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                </div>
              </header>
              <main className="flex-1 p-6">
                {children}
              </main>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
