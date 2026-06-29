import { getOrderAsync } from "../../_lib/orders-store";
import { envFrom, json, type PagesEnv } from "../../_lib/http";

export const onRequestGet: PagesFunction<PagesEnv> = async (context) => {
  const env = envFrom(context);
  const orderId = new URL(context.request.url).searchParams.get("orderId");
  if (!orderId) {
    return json({ error: "缺少 orderId" }, 400);
  }

  const order = await getOrderAsync(env, orderId);
  if (!order) {
    return json({ error: "订单不存在" }, 404);
  }

  return json({
    orderId: order.id,
    status: order.status,
    paid: order.status === "paid",
    amount: order.amount,
    productId: order.productId,
  });
};
