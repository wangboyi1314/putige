import { rateLimitMessage } from "./api-errors";
import type { PagesEnv } from "./http";
import { checkRateLimit, clientIp } from "./rate-limit";

export function assertMpPlatform(request: Request): { ok: true } | { ok: false; error: string } {
  const platform = request.headers.get("X-Bodhi-Platform");
  if (platform !== "miniprogram") {
    return { ok: false, error: "仅小程序客户端可访问此接口" };
  }
  return { ok: true };
}

/** 小程序独立限流（键前缀 mp:，与 Web 互不影响） */
export async function assertMpInterpretRateLimit(
  env: PagesEnv,
  request: Request,
  isPremium: boolean
) {
  const ip = clientIp(request);
  const clientId = request.headers.get("X-Bodhi-Client")?.trim().slice(0, 64) || "";

  const burst = await checkRateLimit(env, `mp:interpret:burst:${ip}`, 4, 60);
  if (!burst.ok) {
    return { ok: false as const, body: rateLimitMessage(burst.retryAfter ?? 60, isPremium), status: 429 };
  }

  if (clientId) {
    const cidBurst = await checkRateLimit(env, `mp:interpret:burst:cid:${clientId}`, 4, 60);
    if (!cidBurst.ok) {
      return { ok: false as const, body: rateLimitMessage(cidBurst.retryAfter ?? 60, isPremium), status: 429 };
    }
  }

  if (isPremium) {
    const premium = await checkRateLimit(env, `mp:interpret:premium:${ip}`, 20, 3600);
    if (!premium.ok) {
      return { ok: false as const, body: rateLimitMessage(premium.retryAfter ?? 300, true), status: 429 };
    }
    return { ok: true as const };
  }

  const freeIp = await checkRateLimit(env, `mp:interpret:free:${ip}`, 6, 3600);
  if (!freeIp.ok) {
    return { ok: false as const, body: rateLimitMessage(freeIp.retryAfter ?? 600, false), status: 429 };
  }
  return { ok: true as const };
}

export async function assertMpPaymentCreateRateLimit(env: PagesEnv, request: Request) {
  const ip = clientIp(request);
  const limit = await checkRateLimit(env, `mp:payment:create:${ip}`, 10, 3600);
  if (!limit.ok) {
    return {
      ok: false as const,
      body: {
        code: "rate_limit",
        error: "创建订单过于频繁，请稍后再试",
        retryAfter: limit.retryAfter,
      },
      status: 429,
    };
  }
  return { ok: true as const };
}
