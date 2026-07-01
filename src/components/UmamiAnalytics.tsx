import Script from "next/script";
import { Suspense } from "react";
import { AnalyticsPageView } from "@/components/AnalyticsPageView";

const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
const scriptUrl =
  process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL || "https://cloud.umami.is/script.js";

/** Umami 统计：页面浏览（自动）+ 自定义事件（见 lib/analytics.ts） */
export function UmamiAnalytics() {
  if (!websiteId) return null;

  return (
    <>
      <Script
        defer
        src={scriptUrl}
        data-website-id={websiteId}
        strategy="afterInteractive"
      />
      <Suspense fallback={null}>
        <AnalyticsPageView />
      </Suspense>
    </>
  );
}
