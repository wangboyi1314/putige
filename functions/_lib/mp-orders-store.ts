import type { PagesEnv } from "./http";
import { PRODUCTS, type Order, type ProductId } from "./payment";

const ordersMem = new Map<string, Order>();
const TTL_SECONDS = 86400 * 7;

async function kvGet(env: PagesEnv, key: string): Promise<string | null> {
  if (!env.ORDERS) return null;
  return env.ORDERS.get(key);
}

async function kvPut(env: PagesEnv, key: string, value: string): Promise<void> {
  if (!env.ORDERS) return;
  await env.ORDERS.put(key, value, { expirationTtl: TTL_SECONDS });
}

/** 小程序订单与 Web 订单完全隔离（KV 键前缀 mp:） */
export async function storeMpOrder(env: PagesEnv, order: Order): Promise<void> {
  ordersMem.set(order.id, order);
  await kvPut(env, `mp:order:${order.id}`, JSON.stringify(order));
}

export async function createMpOrderAsync(
  env: PagesEnv,
  productId: ProductId
): Promise<Order> {
  const product = PRODUCTS[productId];
  const order: Order = {
    id: `MP_ORD_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    productId,
    amount: product.price,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  await storeMpOrder(env, order);
  return order;
}

export async function getMpOrderAsync(
  env: PagesEnv,
  orderId: string
): Promise<Order | undefined> {
  const mem = ordersMem.get(orderId);
  if (mem) return mem;
  const raw = await kvGet(env, `mp:order:${orderId}`);
  if (!raw) return undefined;
  const order = JSON.parse(raw) as Order;
  ordersMem.set(orderId, order);
  return order;
}

export async function markMpOrderPaidAsync(
  env: PagesEnv,
  orderId: string,
  sessionId?: string
): Promise<Order | null> {
  let order = await getMpOrderAsync(env, orderId);
  if (!order) {
    order = {
      id: orderId,
      productId: "qian_premium",
      amount: 0,
      status: "paid",
      createdAt: new Date().toISOString(),
      paidAt: new Date().toISOString(),
    };
  } else {
    order = {
      ...order,
      status: "paid",
      paidAt: new Date().toISOString(),
      ...(sessionId ? { sessionId } : {}),
    };
  }
  await storeMpOrder(env, order);
  return order;
}
