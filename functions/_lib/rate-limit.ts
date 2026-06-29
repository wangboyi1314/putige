import type { ApiErrorBody } from "./api-errors";
import { rateLimitMessage } from "./api-errors";
import type { PagesEnv } from "./http";

export interface RateLimitResult {
  ok: boolean;
  retryAfter?: number;
  error?: string;
  body?: ApiErrorBody;
}

interface Bucket {
  count: number;
  resetAt: number;
}

const memBuckets = new Map<string, Bucket>();

function nowSec(): number {
  return Math.floor(Date.now() / 1000);
}

async function readBucket(env: PagesEnv, key: string): Promise<Bucket | null> {
  if (env.ORDERS) {
    const raw = await env.ORDERS.get(`rl:${key}`);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Bucket;
    } catch {
      return null;
    }
  }
  return memBuckets.get(key) ?? null;
}

async function writeBucket(env: PagesEnv, key: string, bucket: Bucket, ttl: number): Promise<void> {
  if (env.ORDERS) {
    await env.ORDERS.put(`rl:${key}`, JSON.stringify(bucket), { expirationTtl: ttl });
    return;
  }
  memBuckets.set(key, bucket);
}

export async function checkRateLimit(
  env: PagesEnv,
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const now = nowSec();
  const existing = await readBucket(env, key);
  if (!existing || existing.resetAt <= now) {
    await writeBucket(env, key, { count: 1, resetAt: now + windowSeconds }, windowSeconds + 60);
    return { ok: true };
  }
  if (existing.count >= limit) {
    const retryAfter = existing.resetAt - now;
    return {
      ok: false,
      retryAfter,
      error: `请求过于频繁，请 ${retryAfter} 秒后再试`,
    };
  }
  existing.count += 1;
  await writeBucket(env, key, existing, windowSeconds + 60);
  return { ok: true };
}

export function clientIp(request: Request): string {
  return (
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

/** 解读接口限流：防刷 token */
export async function assertInterpretRateLimit(
  env: PagesEnv,
  request: Request,
  isPremium: boolean
): Promise<RateLimitResult> {
  const ip = clientIp(request);
  const clientId = request.headers.get("X-Bodhi-Client")?.trim().slice(0, 64) || "";

  const burst = await checkRateLimit(env, `interpret:burst:${ip}`, 4, 60);
  if (!burst.ok) {
    return { ...burst, body: rateLimitMessage(burst.retryAfter ?? 60, isPremium) };
  }

  if (clientId) {
    const cidBurst = await checkRateLimit(env, `interpret:burst:cid:${clientId}`, 4, 60);
    if (!cidBurst.ok) {
      return { ...cidBurst, body: rateLimitMessage(cidBurst.retryAfter ?? 60, isPremium) };
    }
  }

  if (isPremium) {
    const premium = await checkRateLimit(env, `interpret:premium:${ip}`, 20, 3600);
    if (!premium.ok) {
      return { ...premium, body: rateLimitMessage(premium.retryAfter ?? 300, true) };
    }
    return { ok: true };
  }

  const freeIp = await checkRateLimit(env, `interpret:free:${ip}`, 6, 3600);
  if (!freeIp.ok) {
    return { ...freeIp, body: rateLimitMessage(freeIp.retryAfter ?? 600, false) };
  }
  return { ok: true };
}

export async function assertPaymentCreateRateLimit(
  env: PagesEnv,
  request: Request
): Promise<RateLimitResult> {
  const ip = clientIp(request);
  const limit = await checkRateLimit(env, `payment:create:${ip}`, 10, 3600);
  if (!limit.ok) {
    return {
      ...limit,
      body: {
        code: "rate_limit",
        error: "创建订单过于频繁，请稍后再试",
        retryAfter: limit.retryAfter,
        tip: "若您正在尝试支付，请等待片刻后重试；频繁点击可能触发安全保护。",
      },
    };
  }
  return { ok: true };
}
