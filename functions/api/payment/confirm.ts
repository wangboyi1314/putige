import { getOrderAsync, markOrderPaidAsync } from "../../_lib/orders-store";
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

    const sessionId = `session_${orderId}`;
    const paid = await markOrderPaidAsync(env, orderId, sessionId);
    return json({ success: true, sessionId, order: paid });
  } catch (e) {
    console.error("Payment confirm error:", e);
    return json({ error: "确认支付失败" }, 500);
  }
};
