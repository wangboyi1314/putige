import { buildPrompt, callDeepSeek, type DivinationType } from "../_lib/deepseek";
import { json, type PagesEnv } from "../_lib/http";

export const onRequestPost: PagesFunction<PagesEnv> = async (context) => {
  try {
    const body = (await context.request.json()) as {
      type: DivinationType;
      data: Record<string, unknown>;
      question?: string;
      isPremium?: boolean;
      masterId?: string;
    };

    const { type, data, question, isPremium, masterId } = body;
    if (!type || !data) {
      return json({ error: "缺少必要参数" }, 400);
    }

    const { system, user } = buildPrompt({ type, data, question, isPremium, masterId });
    const interpretation = await callDeepSeek(system, user, context.env);
    return json({ interpretation });
  } catch (e) {
    console.error("Interpret API error:", e);
    return json({ error: "解读失败，请稍后重试" }, 500);
  }
};
