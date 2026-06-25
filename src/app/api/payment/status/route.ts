import { NextRequest, NextResponse } from "next/server";
import { getOrder } from "@/lib/payment";

/** 前端轮询订单是否已支付（商户模式自动到账后返回 paid: true） */
export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("orderId");
  if (!orderId) {
    return NextResponse.json({ error: "缺少 orderId" }, { status: 400 });
  }

  const order = getOrder(orderId);
  if (!order) {
    return NextResponse.json({ error: "订单不存在" }, { status: 404 });
  }

  return NextResponse.json({
    orderId: order.id,
    status: order.status,
    paid: order.status === "paid",
    amount: order.amount,
    productId: order.productId,
  });
}
