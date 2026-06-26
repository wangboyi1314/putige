export type ProductId =
  | "gua_premium"
  | "qian_premium"
  | "bazi_premium"
  | "dream_premium"
  | "xiang_premium"
  | "naming_premium"
  | "vip_monthly";

export interface Product {
  id: ProductId;
  name: string;
  description: string;
  price: number;
  currency: string;
}

export const PRODUCTS: Record<ProductId, Product> = {
  gua_premium: {
    id: "gua_premium",
    name: "周易卦象详批",
    description: "本卦·互卦·变卦深度解读，引经据典",
    price: 8.8,
    currency: "CNY",
  },
  qian_premium: {
    id: "qian_premium",
    name: "灵签详批",
    description: "签诗逐句释义，针对您的问题深度分析",
    price: 6.6,
    currency: "CNY",
  },
  bazi_premium: {
    id: "bazi_premium",
    name: "八字精批",
    description: "四柱格局、五行喜忌、流年运势完整解读",
    price: 18.8,
    currency: "CNY",
  },
  dream_premium: {
    id: "dream_premium",
    name: "梦境详批",
    description: "周公解梦深度分析，结合心境解读",
    price: 6.6,
    currency: "CNY",
  },
  xiang_premium: {
    id: "xiang_premium",
    name: "掌纹面相详批",
    description: "完整相学分析，逐部位详解",
    price: 18.8,
    currency: "CNY",
  },
  naming_premium: {
    id: "naming_premium",
    name: "取名完整方案",
    description: "多个候选名字、寓意、音韵与八字喜忌详解",
    price: 15.9,
    currency: "CNY",
  },
  vip_monthly: {
    id: "vip_monthly",
    name: "月度会员",
    description: "全部功能无限次详批，尊享会员价",
    price: 49.9,
    currency: "CNY",
  },
};

export interface Order {
  id: string;
  productId: ProductId;
  amount: number;
  status: "pending" | "paid" | "failed" | "refunded";
  createdAt: string;
  paidAt?: string;
  sessionId?: string;
}

const orders = new Map<string, Order>();
const paidSessions = new Set<string>();
/** 虎皮椒 trade_order_id（可能被截断）→ 本站订单号 */
const tradeOrderIndex = new Map<string, string>();

export function createOrder(productId: ProductId): Order {
  const product = PRODUCTS[productId];
  const order: Order = {
    id: `ORD_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    productId,
    amount: product.price,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  orders.set(order.id, order);
  return order;
}

export function registerTradeOrderId(tradeOrderId: string, orderId: string) {
  tradeOrderIndex.set(tradeOrderId, orderId);
}

export function resolveOrderId(tradeOrOrderId: string): string {
  return tradeOrderIndex.get(tradeOrOrderId) || tradeOrOrderId;
}

export function markOrderPaid(orderId: string, sessionId?: string): Order | null {
  const order = orders.get(orderId);
  if (!order) return null;
  order.status = "paid";
  order.paidAt = new Date().toISOString();
  if (sessionId) {
    order.sessionId = sessionId;
    paidSessions.add(sessionId);
  }
  return order;
}

export function isSessionPaid(sessionId: string): boolean {
  return paidSessions.has(sessionId);
}

export function getOrder(orderId: string): Order | undefined {
  return orders.get(orderId);
}

import type { RuntimeEnv } from "./runtime-env";
import { envGet } from "./runtime-env";

function paymentMode(runtimeEnv?: RuntimeEnv): string | undefined {
  return envGet("PAYMENT_MODE", runtimeEnv);
}

export function isDemoMode(runtimeEnv?: RuntimeEnv): boolean {
  return paymentMode(runtimeEnv) === "demo";
}

/** 个人收款码：展示静态码，用户手动确认 */
export function isQrPaymentMode(runtimeEnv?: RuntimeEnv): boolean {
  return paymentMode(runtimeEnv) === "qr";
}

/** 微信/支付宝官方商户 API */
export function isMerchantMode(runtimeEnv?: RuntimeEnv): boolean {
  return paymentMode(runtimeEnv) === "merchant";
}

/** 虎皮椒等聚合支付：个人可接入，自动回调 */
export function isXunhuMode(runtimeEnv?: RuntimeEnv): boolean {
  const mode = paymentMode(runtimeEnv);
  return mode === "xunhu" || mode === "aggregator";
}
