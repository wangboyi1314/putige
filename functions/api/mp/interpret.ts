import { buildPrompt, callDeepSeek, type DivinationType } from "../../_lib/deepseek";
import { assertMpInterpretRateLimit, assertMpPlatform } from "../../_lib/mp-guard";
import { recordMpPremiumOrderUse } from "../../_lib/mp-order-usage";
import { assertMpPremiumAccess } from "../../_lib/mp-premium-gate";
import { json, jsonError, type PagesEnv } from "../../_lib/http";

const MAX_BODY_BYTES = 32_768;

export const onRequestPost: PagesFunction<PagesEnv> = async (context) => {
  const platform = assertMpPlatform(context.request);
  if (!platform.ok) {
    return jsonError({ error: platform.error }, 403);
  }

  try {
    const bodyText = await context.request.text();
    if (bodyText.length > MAX_BODY_BYTES) {
      return jsonError({ error: "提交内容过大，请精简后重试" }, 413);
    }

    const body = JSON.parse(bodyText) as {
      type: DivinationType;
      data: Record<string, unknown>;
      question?: string;
      isPremium?: boolean;
      masterId?: string;
      orderId?: string;
      clientId?: string;
      _hp?: string;
    };

    const { type, data, question, isPremium, masterId, orderId, _hp } = body;
    if (!type || !data) {
      return jsonError({ error: "缺少必要参数" }, 400);
    }

    if (_hp) {
      return jsonError({ error: "请求无效" }, 400);
    }

    const rate = await assertMpInterpretRateLimit(context.env, context.request, !!isPremium);
    if (!rate.ok) {
      return jsonError(rate.body, rate.status);
    }

    if (isPremium) {
      const gate = await assertMpPremiumAccess(context.env, type, orderId);
      if (!gate.ok) {
        const tip =
          gate.status === 403
            ? "每个订单可解锁有限次详批；若次数已用完，请重新购买。"
            : gate.status === 402
              ? "请先完成支付，再解锁完整内容。"
              : "请重新发起支付。";
        return jsonError({ error: gate.error, tip }, gate.status);
      }
    }

    const { system, user } = buildPrompt({ type, data, question, isPremium, masterId });
    const interpretation = await callDeepSeek(system, user, context.env, !!isPremium);

    if (isPremium && orderId) {
      await recordMpPremiumOrderUse(context.env, orderId);
    }

    return json({ interpretation });
  } catch (e) {
    console.error("[mp/interpret] error:", e);
    return jsonError(
      {
        error: "解读暂时不可用，请稍后再试",
        tip: "服务器繁忙或网络波动，请等待 1～2 分钟后重试。",
      },
      500
    );
  }
};
