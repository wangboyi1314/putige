import { NextRequest, NextResponse } from "next/server";
import { markOrderPaid } from "@/lib/payment";
import { verifyWechatNotify } from "@/lib/wechat-pay";

export const runtime = "nodejs";

/**
 * 微信支付结果通知（APIv3）
 * 商户平台配置: https://你的域名/api/payment/wechat/notify
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const headers: Record<string, string> = {};
    req.headers.forEach((v, k) => {
      headers[k] = v;
    });

    const result = await verifyWechatNotify(headers, rawBody);
    if (!result?.success) {
      return NextResponse.json({ code: "FAIL", message: "验签失败" }, { status: 400 });
    }

    markOrderPaid(result.orderId);

    return NextResponse.json({ code: "SUCCESS", message: "成功" });
  } catch (e) {
    console.error("[wechat notify]", e);
    return NextResponse.json({ code: "FAIL", message: "处理失败" }, { status: 500 });
  }
}
