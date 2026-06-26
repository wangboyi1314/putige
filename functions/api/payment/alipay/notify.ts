import { markOrderPaid } from "../../../src/lib/payment";
import { verifyAlipayNotify } from "../../../src/lib/alipay";

export const onRequestPost: PagesFunction = async (context) => {
  try {
    const form = await context.request.formData();
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
};
