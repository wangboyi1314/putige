import { buildPrompt, callDeepSeek, type DivinationType } from "../_lib/deepseek";
import { recordPremiumOrderUse } from "../_lib/order-usage";
import { assertPremiumAccess } from "../_lib/premium-gate";
import { assertInterpretRateLimit } from "../_lib/rate-limit";
import { json, type PagesEnv } from "../_lib/http";

const MAX_BODY_BYTES = 32_768;

export const onRequestPost: PagesFunction<PagesEnv> = async (context) => {
  try {
    const contentLength = Number(context.request.headers.get("Content-Length") || 0);
    if (contentLength > MAX_BODY_BYTES) {
      return json({ error: "请求体过大" }, 413);
    }

    const bodyText = await context.request.text();
    if (bodyText.length > MAX_BODY_BYTES) {
      return json({ error: "请求体过大" }, 413);
    }

    const body = JSON.parse(bodyText) as {
      type: DivinationType;
      data: Record<string, unknown>;
      question?: string;
      isPremium?: boolean;
      masterId?: string;
      orderId?: string;
    };

    const { type, data, question, isPremium, masterId, orderId } = body;
    if (!type || !data) {
      return json({ error: "缺少必要参数" }, 400);
    }

    const rate = await assertInterpretRateLimit(context.env, context.request, !!isPremium);
    if (!rate.ok) {
      return json({ error: rate.error || "请求过于频繁" }, 429);
    }

    if (isPremium) {
      const gate = await assertPremiumAccess(context.env, type, orderId);
      if (!gate.ok) {
        return json({ error: gate.error }, gate.status);
      }
    }

    const { system, user } = buildPrompt({ type, data, question, isPremium, masterId });
    const interpretation = await callDeepSeek(system, user, context.env, !!isPremium);

    if (isPremium && orderId) {
      await recordPremiumOrderUse(context.env, orderId);
    }

    return json({ interpretation });
  } catch (e) {
    console.error("Interpret API error:", e);
    return json({ error: "解读失败，请稍后重试" }, 500);
  }
};
