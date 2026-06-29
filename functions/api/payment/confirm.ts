import { getOrderAsync, markOrderPaidAsync } from "../../_lib/orders-store";
import { canManualConfirmPayment } from "../../_lib/premium-gate";
import { envFrom, json, type PagesEnv } from "../../_lib/http";

export const onRequestPost: PagesFunction<PagesEnv> = async (context) => {
  try {
    const env = envFrom(context);
    const { orderId } = (await context.request.json()) as { orderId: string };
    if (!orderId) {
      return json({ error: "缺少订单号" }, 400);
    }

    const order = await getOrderAsync(env, orderId);
    if (!order) {
      return json({ error: "订单不存在" }, 404);
    }

    if (order.status === "paid") {
      return json({ success: true, sessionId: order.sessionId, order });
    }

    if (!canManualConfirmPayment(env)) {
      return json({ error: "请完成支付，系统将自动到账解锁" }, 403);
    }

    const sessionId = `session_${orderId}`;
    const paid = await markOrderPaidAsync(env, orderId, sessionId);
    return json({ success: true, sessionId, order: paid });
  } catch (e) {
    console.error("Payment confirm error:", e);
    return json({ error: "确认支付失败" }, 500);
  }
};
