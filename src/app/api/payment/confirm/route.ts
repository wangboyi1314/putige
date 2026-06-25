import { NextRequest, NextResponse } from "next/server";
import { markOrderPaid, getOrder } from "@/lib/payment";

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json() as { orderId: string };

    if (!orderId) {
      return NextResponse.json({ error: "缺少订单号" }, { status: 400 });
    }

    const order = getOrder(orderId);
    if (!order) {
      return NextResponse.json({ error: "订单不存在" }, { status: 404 });
    }

    const sessionId = `session_${orderId}`;
    const paid = markOrderPaid(orderId, sessionId);

    return NextResponse.json({
      success: true,
      sessionId,
      order: paid,
    });
  } catch (e) {
    console.error("Payment confirm error:", e);
    return NextResponse.json({ error: "确认支付失败" }, { status: 500 });
  }
}
