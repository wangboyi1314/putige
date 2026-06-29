export interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(
    key: string,
    value: string,
    options?: { expirationTtl?: number }
  ): Promise<void>;
}

export interface PagesEnv {
  DEEPSEEK_API_KEY?: string;
  DEEPSEEK_BASE_URL?: string;
  DEEPSEEK_MODEL?: string;
  PAYMENT_MODE?: string;
  NEXT_PUBLIC_BASE_URL?: string;
  XUNHU_APP_ID?: string;
  XUNHU_APP_SECRET?: string;
  XUNHU_ALIPAY_APP_ID?: string;
  XUNHU_ALIPAY_APP_SECRET?: string;
  XUNHU_API_URL?: string;
  ORDERS?: KVNamespace;
}

export function json(data: unknown, status = 200, extraHeaders?: Record<string, string>): Response {
  const headers: Record<string, string> = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    ...extraHeaders,
  };
  return new Response(JSON.stringify(data), { status, headers });
}

export function jsonError(
  body: { error: string; code?: string; retryAfter?: number; tip?: string },
  status: number
): Response {
  const extra: Record<string, string> = {};
  if (body.retryAfter) {
    extra["Retry-After"] = String(body.retryAfter);
  }
  return json(body, status, extra);
}

export function envFrom(context: { env: PagesEnv }): PagesEnv {
  return context.env;
}
