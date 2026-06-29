import { buildPrompt, callDeepSeek, type DivinationType } from "../_lib/deepseek";
import { assertPremiumAccess } from "../_lib/premium-gate";
import { json, type PagesEnv } from "../_lib/http";

export const onRequestPost: PagesFunction<PagesEnv> = async (context) => {
  try {
    const body = (await context.request.json()) as {
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

    if (isPremium) {
      const gate = await assertPremiumAccess(context.env, type, orderId);
      if (!gate.ok) {
        return json({ error: gate.error }, gate.status);
      }
    }

    const { system, user } = buildPrompt({ type, data, question, isPremium, masterId });
    const interpretation = await callDeepSeek(system, user, context.env, !!isPremium);
    return json({ interpretation });
  } catch (e) {
    console.error("Interpret API error:", e);
    return json({ error: "解读失败，请稍后重试" }, 500);
  }
};
