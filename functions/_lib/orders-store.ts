import type { PagesEnv } from "./http";
import { PRODUCTS, type Order, type ProductId } from "./payment";

const ordersMem = new Map<string, Order>();
const tradeIndexMem = new Map<string, string>();

const TTL_SECONDS = 86400 * 7;

async function kvGet(env: PagesEnv, key: string): Promise<string | null> {
  if (!env.ORDERS) return null;
  return env.ORDERS.get(key);
}

async function kvPut(env: PagesEnv, key: string, value: string): Promise<void> {
  if (!env.ORDERS) return;
  await env.ORDERS.put(key, value, { expirationTtl: TTL_SECONDS });
}

export async function storeOrder(env: PagesEnv, order: Order): Promise<void> {
  ordersMem.set(order.id, order);
  await kvPut(env, `order:${order.id}`, JSON.stringify(order));
}

export async function createOrderAsync(
  env: PagesEnv,
  productId: ProductId
): Promise<Order> {
  const product = PRODUCTS[productId];
  const order: Order = {
    id: `ORD_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    productId,
    amount: product.price,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  await storeOrder(env, order);
  return order;
}

export async function getOrderAsync(
  env: PagesEnv,
  orderId: string
): Promise<Order | undefined> {
  const mem = ordersMem.get(orderId);
  if (mem) return mem;
  const raw = await kvGet(env, `order:${orderId}`);
  if (!raw) return undefined;
  const order = JSON.parse(raw) as Order;
  ordersMem.set(orderId, order);
  return order;
}

export async function registerTradeOrderIdAsync(
  env: PagesEnv,
  tradeOrderId: string,
  orderId: string
): Promise<void> {
  tradeIndexMem.set(tradeOrderId, orderId);
  await kvPut(env, `trade:${tradeOrderId}`, orderId);
}

export async function resolveOrderIdAsync(
  env: PagesEnv,
  tradeOrOrderId: string
): Promise<string> {
  const mem = tradeIndexMem.get(tradeOrOrderId);
  if (mem) return mem;
  const fromKv = await kvGet(env, `trade:${tradeOrOrderId}`);
  if (fromKv) {
    tradeIndexMem.set(tradeOrOrderId, fromKv);
    return fromKv;
  }
  return tradeOrOrderId;
}

export async function markOrderPaidAsync(
  env: PagesEnv,
  orderId: string,
  sessionId?: string
): Promise<Order | null> {
  let order = await getOrderAsync(env, orderId);
  if (!order) {
    order = {
      id: orderId,
      productId: "gua_premium",
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
  await storeOrder(env, order);
  return order;
}
