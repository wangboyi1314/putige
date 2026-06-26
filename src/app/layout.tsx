import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { MeditationPlayerProvider } from "@/components/MeditationPlayerProvider";
import { SiteBackground } from "@/components/SiteChrome";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} · ${SITE_CONFIG.tagline}`,
  description: SITE_CONFIG.heroDesc,
  keywords: [
    "紫微斗数",
    "子平八字",
    "奇门遁甲",
    "命盘",
    "灵签",
    "周易",
    "黄历",
    "传统文化",
  ],
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="min-h-full flex flex-col antialiased text-amber-50">
        <MeditationPlayerProvider>
          <SiteBackground />
          <div className="relative z-10 flex min-h-full flex-col">
            <Header />
            <main className="flex-1 pt-14 pb-20 md:pb-0">{children}</main>
            <Footer />
            <MobileNav />
          </div>
        </MeditationPlayerProvider>
      </body>
    </html>
  );
}
