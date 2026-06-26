import { getOrder, markOrderPaid, resolveOrderId } from "../../../_lib/payment";
import { resolveXunhuSecretByAppId, verifyXunhuNotify } from "../../../_lib/xunhupay";

export const onRequestPost: PagesFunction = async (context) => {
  try {
    const form = await context.request.formData();
    const params: Record<string, string> = {};
    form.forEach((v, k) => {
      params[k] = String(v);
    });

    const appid = params.appid || "";
    const secret = resolveXunhuSecretByAppId(appid);
    if (!secret) {
      return new Response("fail", { status: 400 });
    }

    const { valid, orderId: tradeOrderId, paid, amount } = verifyXunhuNotify(params, secret);
    if (!valid) {
      return new Response("fail", { status: 400 });
    }

    if (!paid) {
      return new Response("success");
    }

    const orderId = resolveOrderId(tradeOrderId);
    const order = getOrder(orderId);
    if (order && order.status !== "paid") {
      if (Math.abs(order.amount - amount) > 0.01) {
        return new Response("fail", { status: 400 });
      }
      markOrderPaid(orderId);
    } else if (!order) {
      markOrderPaid(orderId);
    }

    return new Response("success", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (e) {
    console.error("[xunhu notify]", e);
    return new Response("fail", { status: 500 });
  }
};
