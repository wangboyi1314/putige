import { getMpOrderAsync, markMpOrderPaidAsync } from "../../../_lib/mp-orders-store";
import { assertMpPlatform } from "../../../_lib/mp-guard";
import { envGet } from "../../../_lib/runtime-env";
import { envFrom, json, type PagesEnv } from "../../../_lib/http";

function mpPaymentMode(env: PagesEnv): string {
  return envGet("MP_PAYMENT_MODE", env) || "demo";
}

export const onRequestPost: PagesFunction<PagesEnv> = async (context) => {
  const platform = assertMpPlatform(context.request);
  if (!platform.ok) {
    return json({ error: platform.error }, 403);
  }

  try {
    const env = envFrom(context);
    const { orderId } = (await context.request.json()) as { orderId: string };
    if (!orderId) {
      return json({ error: "缺少订单号" }, 400);
    }

    const order = await getMpOrderAsync(env, orderId);
    if (!order) {
      return json({ error: "订单不存在" }, 404);
    }

    if (order.status === "paid") {
      return json({ success: true, sessionId: order.sessionId, order });
    }

    if (mpPaymentMode(env) !== "demo") {
      return json({ error: "请完成微信支付，系统将自动到账" }, 403);
    }

    const sessionId = `mp_session_${orderId}`;
    const paid = await markMpOrderPaidAsync(env, orderId, sessionId);
    return json({ success: true, sessionId, order: paid });
  } catch (e) {
    console.error("[mp/payment/confirm] error:", e);
    return json({ error: "确认支付失败" }, 500);
  }
};
