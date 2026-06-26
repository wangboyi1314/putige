import {
  createOrder,
  isDemoMode,
  type ProductId,
  PRODUCTS,
} from "../../_lib/payment";
import { envFrom, json, type PagesEnv } from "../../_lib/http";

export const onRequestPost: PagesFunction<PagesEnv> = async (context) => {
  try {
    const env = envFrom(context);
    const body = (await context.request.json()) as {
      productId: ProductId;
      payChannel?: "wechat" | "alipay";
    };
    const { productId } = body;

    if (!productId || !PRODUCTS[productId]) {
      return json({ error: "无效的商品" }, 400);
    }

    const order = createOrder(productId);

    if (isDemoMode(env)) {
      return json({
        orderId: order.id,
        amount: order.amount,
        demoMode: true,
        message: "演示模式：点击确认即可完成支付",
      });
    }

    return json(
      { error: "当前仅启用演示支付，请设置 PAYMENT_MODE=demo" },
      400
    );
  } catch (e) {
    console.error("Payment create error:", e);
    return json({ error: e instanceof Error ? e.message : "创建订单失败" }, 500);
  }
};
