import type { DivinationType } from "./deepseek";
import type { PagesEnv } from "./http";
import { getMpOrderAsync } from "./mp-orders-store";
import { canUseMpPremiumOrder } from "./mp-order-usage";
import type { ProductId } from "./payment";

const TYPE_TO_PRODUCT: Partial<Record<DivinationType, ProductId>> = {
  bazi: "bazi_premium",
  ziwei: "ziwei_premium",
  ziwei_charts: "ziwei_charts_premium",
  qimen: "qimen_premium",
  qimen_charts: "qimen_charts_premium",
  qian: "qian_premium",
  gua: "gua_premium",
  dream: "dream_premium",
  xiang: "xiang_premium",
  naming: "naming_premium",
};

export async function assertMpPremiumAccess(
  env: PagesEnv,
  type: DivinationType,
  orderId?: string
): Promise<{ ok: true } | { ok: false; error: string; status: number }> {
  const expectedProduct = TYPE_TO_PRODUCT[type];
  if (!expectedProduct) {
    return { ok: false, error: "该类型不支持付费详批", status: 400 };
  }
  if (!orderId) {
    return { ok: false, error: "请先完成支付再解锁详批", status: 402 };
  }

  const order = await getMpOrderAsync(env, orderId);
  if (!order) {
    return { ok: false, error: "订单不存在或已过期，请重新支付", status: 404 };
  }
  if (order.productId !== expectedProduct) {
    return { ok: false, error: "订单与商品不匹配", status: 403 };
  }
  if (order.status !== "paid") {
    return { ok: false, error: "订单未支付，请先完成付款", status: 402 };
  }

  const canUse = await canUseMpPremiumOrder(env, orderId);
  if (!canUse) {
    return { ok: false, error: "该订单详批次数已用完，请重新购买", status: 403 };
  }

  return { ok: true };
}
