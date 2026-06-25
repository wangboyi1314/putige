import { NextRequest } from "next/server";
import { markOrderPaid, getOrder, resolveOrderId } from "@/lib/payment";
import { resolveXunhuSecretByAppId, verifyXunhuNotify } from "@/lib/xunhupay";

export const runtime = "nodejs";

/**
 * 虎皮椒支付成功回调
 * 文档: https://www.xunhupay.com/doc/api/pay.html
 * 商户后台无需单独配置，下单时 notify_url 已传入
 */
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const params: Record<string, string> = {};
    form.forEach((v, k) => {
      params[k] = String(v);
    });

    const appid = params.appid || "";
    const secret = resolveXunhuSecretByAppId(appid);
    if (!secret) {
      console.error("[xunhu notify] 未知 appid:", appid);
      return new Response("fail", { status: 400 });
    }

    const { valid, orderId: tradeOrderId, paid, amount } = verifyXunhuNotify(params, secret);
    if (!valid) {
      console.error("[xunhu notify] 签名校验失败");
      return new Response("fail", { status: 400 });
    }

    if (!paid) {
      return new Response("success");
    }

    const orderId = resolveOrderId(tradeOrderId);
    const order = getOrder(orderId);
    if (order && order.status !== "paid") {
      if (Math.abs(order.amount - amount) > 0.01) {
        console.error("[xunhu notify] 金额不符", order.amount, amount);
        return new Response("fail", { status: 400 });
      }
      markOrderPaid(orderId);
    } else if (!order) {
      // 订单可能因 serverless 内存丢失；仍标记成功避免重复回调
      markOrderPaid(orderId);
    }

    return new Response("success", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (e) {
    console.error("[xunhu notify]", e);
    return new Response("fail", { status: 500 });
  }
}
