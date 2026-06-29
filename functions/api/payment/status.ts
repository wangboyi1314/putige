import { isXunhuMode } from "../../_lib/payment";
import { getOrderAsync, markOrderPaidAsync } from "../../_lib/orders-store";
import {
  getXunhuWechatChannel,
  queryXunhuOrderStatus,
} from "../../_lib/xunhupay";
import { envFrom, json, type PagesEnv } from "../../_lib/http";

export const onRequestGet: PagesFunction<PagesEnv> = async (context) => {
  const env = envFrom(context);
  const orderId = new URL(context.request.url).searchParams.get("orderId");
  if (!orderId) {
    return json({ error: "缺少 orderId" }, 400);
  }

  const order = await getOrderAsync(env, orderId);
  if (order?.status === "paid") {
    return json({
      orderId: order.id,
      status: "paid",
      paid: true,
      amount: order.amount,
      productId: order.productId,
    });
  }

  if (isXunhuMode(env)) {
    const channel = getXunhuWechatChannel(env);
    if (channel) {
      try {
        const remote = await queryXunhuOrderStatus(orderId, channel, env);
        if (remote.paid) {
          const paidOrder = await markOrderPaidAsync(env, orderId);
          return json({
            orderId,
            status: "paid",
            paid: true,
            amount: paidOrder?.amount ?? order?.amount ?? 0,
            productId: paidOrder?.productId ?? order?.productId,
          });
        }
        if (order) {
          return json({
            orderId: order.id,
            status: remote.status === "WP" ? "pending" : order.status,
            paid: false,
            amount: order.amount,
            productId: order.productId,
          });
        }
        return json({
          orderId,
          status: remote.status === "OD" ? "paid" : "pending",
          paid: false,
          amount: 0,
        });
      } catch (e) {
        console.error("[payment/status] xunhu query error:", e);
      }
    }
  }

  if (order) {
    return json({
      orderId: order.id,
      status: order.status,
      paid: false,
      amount: order.amount,
      productId: order.productId,
    });
  }

  return json({ error: "订单不存在" }, 404);
};
