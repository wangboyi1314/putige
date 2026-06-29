import {
  getOrderAsync,
  markOrderPaidAsync,
  resolveOrderIdAsync,
} from "../../../_lib/orders-store";
import { resolveXunhuSecretByAppId, verifyXunhuNotify } from "../../../_lib/xunhupay";
import { envFrom, type PagesEnv } from "../../../_lib/http";

/**
 * 虎皮椒支付成功回调
 * 文档: https://www.xunhupay.com/doc/api/pay.html
 */
export const onRequestPost: PagesFunction<PagesEnv> = async (context) => {
  try {
    const env = envFrom(context);
    const form = await context.request.formData();
    const params: Record<string, string> = {};
    form.forEach((v, k) => {
      params[k] = String(v);
    });

    const appid = params.appid || "";
    const secret = resolveXunhuSecretByAppId(appid, env);
    if (!secret) {
      console.error("[xunhu notify] 未知 appid:", appid);
      return new Response("fail", { status: 400 });
    }

    const { valid, orderId: tradeOrderId, paid, amount } = verifyXunhuNotify(
      params,
      secret
    );
    if (!valid) {
      console.error("[xunhu notify] 签名校验失败");
      return new Response("fail", { status: 400 });
    }

    if (!paid) {
      return new Response("success");
    }

    const orderId = await resolveOrderIdAsync(env, tradeOrderId);
    const order = await getOrderAsync(env, orderId);
    if (order && order.status !== "paid") {
      if (Math.abs(order.amount - amount) > 0.01) {
        console.error("[xunhu notify] 金额不符", order.amount, amount);
        return new Response("fail", { status: 400 });
      }
      await markOrderPaidAsync(env, orderId);
    } else if (!order) {
      await markOrderPaidAsync(env, orderId);
    }

    return new Response("success", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (e) {
    console.error("[xunhu notify]", e);
    return new Response("fail", { status: 500 });
  }
};
