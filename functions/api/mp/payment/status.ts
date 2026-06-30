import { getMpOrderAsync } from "../../../_lib/mp-orders-store";
import { assertMpPlatform } from "../../../_lib/mp-guard";
import { envFrom, json, type PagesEnv } from "../../../_lib/http";

export const onRequestGet: PagesFunction<PagesEnv> = async (context) => {
  const platform = assertMpPlatform(context.request);
  if (!platform.ok) {
    return json({ error: platform.error }, 403);
  }

  const env = envFrom(context);
  const orderId = new URL(context.request.url).searchParams.get("orderId");
  if (!orderId) {
    return json({ error: "缺少 orderId" }, 400);
  }

  const order = await getMpOrderAsync(env, orderId);
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
