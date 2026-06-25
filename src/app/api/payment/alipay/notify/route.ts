import { NextRequest, NextResponse } from "next/server";
import { markOrderPaid } from "@/lib/payment";
import { verifyAlipayNotify } from "@/lib/alipay";

export const runtime = "nodejs";

/**
 * 支付宝异步通知
 * 应用网关: https://你的域名/api/payment/alipay/notify
 */
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const params: Record<string, string> = {};
    form.forEach((v, k) => {
      params[k] = String(v);
    });

    const result = await verifyAlipayNotify(params);
    if (!result?.success) {
      return new Response("failure", { status: 400 });
    }

    markOrderPaid(result.orderId);
    return new Response("success");
  } catch (e) {
    console.error("[alipay notify]", e);
    return new Response("failure", { status: 500 });
  }
}
