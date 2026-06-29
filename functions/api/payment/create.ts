import {
  isDemoMode,
  isQrPaymentMode,
  isXunhuMode,
  type ProductId,
  PRODUCTS,
} from "../../_lib/payment";
import {
  createOrderAsync,
  registerTradeOrderIdAsync,
} from "../../_lib/orders-store";
import { envGet } from "../../_lib/runtime-env";
import {
  createXunhuPayment,
  getXunhuAlipayChannel,
  getXunhuWechatChannel,
  isXunhuConfigured,
  sanitizeTradeOrderId,
} from "../../_lib/xunhupay";
import { envFrom, json, type PagesEnv } from "../../_lib/http";
import { assertPaymentCreateRateLimit } from "../../_lib/rate-limit";

export const onRequestPost: PagesFunction<PagesEnv> = async (context) => {
  try {
    const env = envFrom(context);

    const rate = await assertPaymentCreateRateLimit(env, context.request);
    if (!rate.ok) {
      return json({ error: rate.error || "请求过于频繁" }, 429);
    }

    const body = (await context.request.json()) as {
      productId: ProductId;
      payChannel?: "wechat" | "alipay";
    };
    const { productId, payChannel = "wechat" } = body;

    if (!productId || !PRODUCTS[productId]) {
      return json({ error: "无效的商品" }, 400);
    }

    const order = await createOrderAsync(env, productId);
    const product = PRODUCTS[productId];
    const baseUrl = envGet("NEXT_PUBLIC_BASE_URL", env)?.replace(/\/$/, "");

    if (isDemoMode(env)) {
      return json({
        orderId: order.id,
        amount: order.amount,
        demoMode: true,
        message: "演示模式：点击确认即可完成支付",
      });
    }

    if (isXunhuMode(env)) {
      if (!isXunhuConfigured(env)) {
        return json(
          {
            error:
              "虎皮椒未配置：请在环境变量中设置 XUNHU_APP_ID 和 XUNHU_APP_SECRET，详见 DEPLOY.md",
          },
          503
        );
      }
      if (!baseUrl) {
        return json({ error: "缺少 NEXT_PUBLIC_BASE_URL" }, 500);
      }

      const channel =
        payChannel === "alipay" ? getXunhuAlipayChannel(env) : getXunhuWechatChannel(env);
      const active = channel ?? getXunhuWechatChannel(env)!;

      const xunhu = await createXunhuPayment(
        {
          orderId: order.id,
          amountYuan: order.amount,
          title: product.name,
          notifyUrl: `${baseUrl}/api/payment/xunhu/notify`,
          returnUrl: `${baseUrl}/mine?paid=1&order=${encodeURIComponent(order.id)}&product=${encodeURIComponent(productId)}`,
          channel: active,
        },
        env
      );

      const tradeId = sanitizeTradeOrderId(order.id);
      await registerTradeOrderIdAsync(env, tradeId, order.id);

      return json({
        orderId: order.id,
        amount: order.amount,
        xunhuMode: true,
        payChannel,
        payUrl: xunhu.url,
        qrUrl: xunhu.urlQrcode,
        pollUrl: `/api/payment/status?orderId=${order.id}`,
      });
    }

    if (isQrPaymentMode(env)) {
      return json({
        orderId: order.id,
        amount: order.amount,
        demoMode: false,
        qrMode: true,
        message: "请扫码支付后点击确认",
      });
    }

    return json(
      { error: "未知支付模式，请设置 PAYMENT_MODE=demo|qr|xunhu|merchant" },
      400
    );
  } catch (e) {
    console.error("Payment create error:", e);
    return json({ error: e instanceof Error ? e.message : "创建订单失败" }, 500);
  }
};
