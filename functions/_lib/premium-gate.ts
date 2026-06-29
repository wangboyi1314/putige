import type { DivinationType } from "./deepseek";
import type { PagesEnv } from "./http";
import { getOrderAsync } from "./orders-store";
import { isDemoMode, isQrPaymentMode, type ProductId } from "./payment";

const TYPE_TO_PRODUCT: Partial<Record<DivinationType, ProductId>> = {
  bazi: "bazi_premium",
  qian: "qian_premium",
  gua: "gua_premium",
  dream: "dream_premium",
  xiang: "xiang_premium",
  naming: "naming_premium",
};

export function productIdForType(type: DivinationType): ProductId | null {
  return TYPE_TO_PRODUCT[type] ?? null;
}

/** 详批接口必须携带已支付订单号 */
export async function assertPremiumAccess(
  env: PagesEnv,
  type: DivinationType,
  orderId?: string
): Promise<{ ok: true } | { ok: false; error: string; status: number }> {
  const expectedProduct = productIdForType(type);
  if (!expectedProduct) {
    return { ok: false, error: "该类型不支持付费详批", status: 400 };
  }
  if (!orderId) {
    return { ok: false, error: "请先完成支付再解锁详批", status: 402 };
  }

  const order = await getOrderAsync(env, orderId);
  if (!order) {
    return { ok: false, error: "订单不存在或已过期，请重新支付", status: 404 };
  }
  if (order.productId !== expectedProduct) {
    return { ok: false, error: "订单与商品不匹配", status: 403 };
  }
  if (order.status !== "paid") {
    return { ok: false, error: "订单未支付，请先完成付款", status: 402 };
  }

  return { ok: true };
}

/** 手动确认支付：仅演示/收款码模式可用 */
export function canManualConfirmPayment(env: PagesEnv): boolean {
  return isDemoMode(env) || isQrPaymentMode(env);
}
