import { getOrder } from "../../../_lib/payment";
import { json } from "../../_lib/http";

export const onRequestGet: PagesFunction = async (context) => {
  const orderId = new URL(context.request.url).searchParams.get("orderId");
  if (!orderId) {
    return json({ error: "缺少 orderId" }, 400);
  }

  const order = getOrder(orderId);
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
