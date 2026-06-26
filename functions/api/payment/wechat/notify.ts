import { markOrderPaid } from "../../../src/lib/payment";
import { verifyWechatNotify } from "../../../src/lib/wechat-pay";

export const onRequestPost: PagesFunction = async (context) => {
  try {
    const rawBody = await context.request.text();
    const headers: Record<string, string> = {};
    context.request.headers.forEach((v, k) => {
      headers[k] = v;
    });

    const result = await verifyWechatNotify(headers, rawBody);
    if (!result?.success) {
      return Response.json({ code: "FAIL", message: "验签失败" }, { status: 400 });
    }

    markOrderPaid(result.orderId);
    return Response.json({ code: "SUCCESS", message: "成功" });
  } catch (e) {
    console.error("[wechat notify]", e);
    return Response.json({ code: "FAIL", message: "处理失败" }, { status: 500 });
  }
};
