import { createMpOrderAsync } from "../../../_lib/mp-orders-store";
import { assertMpPaymentCreateRateLimit, assertMpPlatform } from "../../../_lib/mp-guard";
import { PRODUCTS, type ProductId } from "../../../_lib/payment";
import { envGet } from "../../../_lib/runtime-env";
import { envFrom, json, jsonError, type PagesEnv } from "../../../_lib/http";

/** 小程序支付模式独立于 Web 的 PAYMENT_MODE */
function mpPaymentMode(env: PagesEnv): string {
  return envGet("MP_PAYMENT_MODE", env) || "demo";
}

export const onRequestPost: PagesFunction<PagesEnv> = async (context) => {
  const platform = assertMpPlatform(context.request);
  if (!platform.ok) {
    return jsonError({ error: platform.error }, 403);
  }

  try {
    const env = envFrom(context);
    const rate = await assertMpPaymentCreateRateLimit(env, context.request);
    if (!rate.ok) {
      return jsonError(rate.body, rate.status);
    }

    const body = (await context.request.json()) as { productId: ProductId };
    const { productId } = body;

    if (!productId || !PRODUCTS[productId]) {
      return json({ error: "无效的商品" }, 400);
    }

    const order = await createMpOrderAsync(env, productId);
    const mode = mpPaymentMode(env);

    if (mode === "demo") {
      return json({
        orderId: order.id,
        amount: order.amount,
        demoMode: true,
        message: "小程序演示模式：确认后即可解锁",
      });
    }

    if (mode === "wxpay") {
      return json(
        {
          error: "微信支付 JSAPI 尚未配置，请设置 MP_WECHAT_* 环境变量",
          orderId: order.id,
        },
        503
      );
    }

    return json({ error: `未知 MP_PAYMENT_MODE: ${mode}` }, 400);
  } catch (e) {
    console.error("[mp/payment/create] error:", e);
    return json({ error: e instanceof Error ? e.message : "创建订单失败" }, 500);
  }
};
