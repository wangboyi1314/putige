import type { PagesEnv } from "./http";

const MAX_PREMIUM_CALLS_PER_ORDER = 3;
const memUsage = new Map<string, number>();

async function getUsage(env: PagesEnv, orderId: string): Promise<number> {
  if (env.ORDERS) {
    const raw = await env.ORDERS.get(`mp:usage:${orderId}`);
    return raw ? Number(raw) || 0 : 0;
  }
  return memUsage.get(orderId) ?? 0;
}

async function setUsage(env: PagesEnv, orderId: string, count: number): Promise<void> {
  if (env.ORDERS) {
    await env.ORDERS.put(`mp:usage:${orderId}`, String(count), { expirationTtl: 86400 * 7 });
    return;
  }
  memUsage.set(orderId, count);
}

export async function canUseMpPremiumOrder(env: PagesEnv, orderId: string): Promise<boolean> {
  const usage = await getUsage(env, orderId);
  return usage < MAX_PREMIUM_CALLS_PER_ORDER;
}

export async function recordMpPremiumOrderUse(env: PagesEnv, orderId: string): Promise<void> {
  const usage = await getUsage(env, orderId);
  await setUsage(env, orderId, usage + 1);
}
