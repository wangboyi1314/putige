/** Umami 自定义事件名 */
export type AnalyticsEvent =
  | "unlock_click"
  | "order_created"
  | "payment_success"
  | "payment_error";

export type AnalyticsEventData = Record<string, string | number | boolean>;

declare global {
  interface Window {
    umami?: {
      track: (
        eventOrPayload: string | ((props: Record<string, unknown>) => Record<string, unknown>),
        eventData?: AnalyticsEventData
      ) => void;
    };
  }
}

export function isAnalyticsEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID);
}

/** 自定义事件（解锁点击、下单、支付成功等） */
export function trackEvent(name: AnalyticsEvent, data?: AnalyticsEventData): void {
  if (typeof window === "undefined" || !window.umami) return;
  try {
    if (data && Object.keys(data).length > 0) {
      window.umami.track(name, data);
    } else {
      window.umami.track(name);
    }
  } catch {
    /* 统计失败不影响主流程 */
  }
}

/** 客户端路由切换时补发页面浏览（首屏由 Umami 脚本自动统计） */
export function trackPageView(url?: string): void {
  if (typeof window === "undefined" || !window.umami) return;
  const path = url ?? `${window.location.pathname}${window.location.search}`;
  try {
    window.umami.track((props) => ({
      ...props,
      url: path,
    }));
  } catch {
    /* ignore */
  }
}
