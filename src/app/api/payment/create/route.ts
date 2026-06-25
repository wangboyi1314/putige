import { NextRequest, NextResponse } from "next/server";
import {
  createOrder,
  isDemoMode,
  isMerchantMode,
  isQrPaymentMode,
  isXunhuMode,
  registerTradeOrderId,
  type ProductId,
  PRODUCTS,
} from "@/lib/payment";
import { alipayPrecreate, isAlipayConfigured } from "@/lib/alipay";
import { createWechatNativeOrder, isWechatPayConfigured } from "@/lib/wechat-pay";
import {
  createXunhuPayment,
  getXunhuAlipayChannel,
  getXunhuWechatChannel,
  isXunhuConfigured,
  sanitizeTradeOrderId,
} from "@/lib/xunhupay";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      productId: ProductId;
      payChannel?: "wechat" | "alipay";
    };
    const { productId, payChannel = "wechat" } = body;

    if (!productId || !PRODUCTS[productId]) {
      return NextResponse.json({ error: "无效的商品" }, { status: 400 });
    }

    const order = createOrder(productId);
    const product = PRODUCTS[productId];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");

    if (isDemoMode()) {
      return NextResponse.json({
        orderId: order.id,
        amount: order.amount,
        demoMode: true,
        message: "演示模式：点击确认即可完成支付",
      });
    }

    if (isXunhuMode()) {
      if (!isXunhuConfigured()) {
        return NextResponse.json(
          {
            error:
              "虎皮椒未配置：请在环境变量中设置 XUNHU_APP_ID 和 XUNHU_APP_SECRET，详见 DEPLOY.md",
          },
          { status: 503 }
        );
      }
      if (!baseUrl) {
        return NextResponse.json({ error: "缺少 NEXT_PUBLIC_BASE_URL" }, { status: 500 });
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

      return NextResponse.json({
        orderId: order.id,
        amount: order.amount,
        xunhuMode: true,
        payChannel: payChannel,
        payUrl: xunhu.url,
        qrUrl: xunhu.urlQrcode,
        pollUrl: `/api/payment/status?orderId=${order.id}`,
      });
    }

    if (isQrPaymentMode()) {
      return NextResponse.json({
        orderId: order.id,
        amount: order.amount,
        demoMode: false,
        qrMode: true,
        message: "请扫码支付后点击确认",
      });
    }

    if (isMerchantMode()) {
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
        return NextResponse.json(
          {
            error:
              "官方商户支付未就绪：请配置 WECHAT_PAY_* / ALIPAY_*，或改用 PAYMENT_MODE=xunhu",
          },
          { status: 503 }
        );
      }

      return NextResponse.json({
        orderId: order.id,
        amount: order.amount,
        merchantMode: true,
        wechatCodeUrl,
        alipayQrCode,
        pollUrl: `/api/payment/status?orderId=${order.id}`,
      });
    }

    return NextResponse.json(
      { error: "未知支付模式，请设置 PAYMENT_MODE=demo|qr|xunhu|merchant" },
      { status: 400 }
    );
  } catch (e) {
    console.error("Payment create error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "创建订单失败" },
      { status: 500 }
    );
  }
}
