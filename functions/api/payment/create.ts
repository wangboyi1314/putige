import {
  createOrder,
  isDemoMode,
  isMerchantMode,
  isQrPaymentMode,
  isXunhuMode,
  registerTradeOrderId,
  type ProductId,
  PRODUCTS,
} from "../../src/lib/payment";
import { envGet } from "../../src/lib/runtime-env";
import { alipayPrecreate, isAlipayConfigured } from "../../src/lib/alipay";
import { createWechatNativeOrder, isWechatPayConfigured } from "../../src/lib/wechat-pay";
import {
  createXunhuPayment,
  getXunhuAlipayChannel,
  getXunhuWechatChannel,
  isXunhuConfigured,
  sanitizeTradeOrderId,
} from "../../src/lib/xunhupay";
import { envFrom, json, type PagesEnv } from "../_lib/http";

export const onRequestPost: PagesFunction<PagesEnv> = async (context) => {
  try {
    const env = envFrom(context);
    const body = (await context.request.json()) as {
      productId: ProductId;
      payChannel?: "wechat" | "alipay";
    };
    const { productId, payChannel = "wechat" } = body;

    if (!productId || !PRODUCTS[productId]) {
      return json({ error: "无效的商品" }, 400);
    }

    const order = createOrder(productId);
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
      if (!isXunhuConfigured()) {
        return json(
          { error: "虎皮椒未配置：请设置 XUNHU_APP_ID 和 XUNHU_APP_SECRET" },
          503
        );
      }
      if (!baseUrl) {
        return json({ error: "缺少 NEXT_PUBLIC_BASE_URL" }, 500);
      }

      const channel =
        payChannel === "alipay" ? getXunhuAlipayChannel() : getXunhuWechatChannel();
      const active = channel ?? getXunhuWechatChannel()!;

      const xunhu = await createXunhuPayment({
        orderId: order.id,
        amountYuan: order.amount,
        title: product.name,
        notifyUrl: `${baseUrl}/api/payment/xunhu/notify`,
        returnUrl: `${baseUrl}/mine?paid=1&order=${order.id}`,
        channel: active,
      });

      registerTradeOrderId(sanitizeTradeOrderId(order.id), order.id);

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

    if (isMerchantMode(env)) {
      let wechatCodeUrl: string | undefined;
      let alipayQrCode: string | undefined;

      if (isWechatPayConfigured()) {
        try {
          const wx = await createWechatNativeOrder({
            orderId: order.id,
            amountYuan: order.amount,
            description: product.name,
          });
          wechatCodeUrl = wx?.codeUrl;
        } catch (e) {
          console.error("WeChat order error:", e);
        }
      }

      if (isAlipayConfigured()) {
        try {
          const ali = await alipayPrecreate({
            orderId: order.id,
            amountYuan: order.amount,
            subject: product.name,
          });
          alipayQrCode = ali?.qrCode;
        } catch (e) {
          console.error("Alipay order error:", e);
        }
      }

      if (!wechatCodeUrl && !alipayQrCode) {
        return json({ error: "官方商户支付未就绪" }, 503);
      }

      return json({
        orderId: order.id,
        amount: order.amount,
        merchantMode: true,
        wechatCodeUrl,
        alipayQrCode,
        pollUrl: `/api/payment/status?orderId=${order.id}`,
      });
    }

    return json({ error: "未知支付模式" }, 400);
  } catch (e) {
    console.error("Payment create error:", e);
    return json({ error: e instanceof Error ? e.message : "创建订单失败" }, 500);
  }
};
