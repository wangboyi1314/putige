import type { PagesEnv } from "./http";

export interface RateLimitResult {
  ok: boolean;
  retryAfter?: number;
  error?: string;
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
    return {
      ok: false,
      retryAfter: existing.resetAt - now,
      error: `请求过于频繁，请 ${existing.resetAt - now} 秒后再试`,
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
  const burst = await checkRateLimit(env, `interpret:burst:${ip}`, 5, 60);
  if (!burst.ok) return burst;

  if (isPremium) {
    return checkRateLimit(env, `interpret:premium:${ip}`, 25, 3600);
  }
  return checkRateLimit(env, `interpret:free:${ip}`, 8, 3600);
}

export async function assertPaymentCreateRateLimit(
  env: PagesEnv,
  request: Request
): Promise<RateLimitResult> {
  const ip = clientIp(request);
  return checkRateLimit(env, `payment:create:${ip}`, 12, 3600);
}
