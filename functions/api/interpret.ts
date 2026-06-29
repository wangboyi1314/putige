import { buildPrompt, callDeepSeek, type DivinationType } from "../_lib/deepseek";
import { assertAbuseGuard } from "../_lib/abuse-guard";
import { recordPremiumOrderUse } from "../_lib/order-usage";
import { assertPremiumAccess } from "../_lib/premium-gate";
import { assertInterpretRateLimit } from "../_lib/rate-limit";
import { json, jsonError, type PagesEnv } from "../_lib/http";

const MAX_BODY_BYTES = 32_768;

export const onRequestPost: PagesFunction<PagesEnv> = async (context) => {
  try {
    const contentLength = Number(context.request.headers.get("Content-Length") || 0);
    if (contentLength > MAX_BODY_BYTES) {
      return jsonError(
        {
          code: "payload_too_large",
          error: "提交内容过大，请精简后重试",
          tip: "请只填写必要信息；上传图片请控制在 5MB 以内。",
        },
        413
      );
    }

    const bodyText = await context.request.text();
    if (bodyText.length > MAX_BODY_BYTES) {
      return jsonError(
        {
          code: "payload_too_large",
          error: "提交内容过大，请精简后重试",
          tip: "请只填写必要信息；上传图片请控制在 5MB 以内。",
        },
        413
      );
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

    const { type, data, question, isPremium, masterId, orderId, clientId, _hp } = body;
    if (!type || !data) {
      return jsonError({ error: "缺少必要参数，请刷新页面后重试" }, 400);
    }

    const abuse = await assertAbuseGuard(context.env, context.request, {
      clientId: clientId || context.request.headers.get("X-Bodhi-Client") || undefined,
      honeypot: _hp,
      isPremium: !!isPremium,
    });
    if (!abuse.ok) {
      return jsonError(abuse.body, abuse.status);
    }

    const rate = await assertInterpretRateLimit(context.env, context.request, !!isPremium);
    if (!rate.ok) {
      return jsonError(rate.body || { error: rate.error || "请求过于频繁" }, 429);
    }

    if (isPremium) {
      const gate = await assertPremiumAccess(context.env, type, orderId);
      if (!gate.ok) {
        const tip =
          gate.status === 403
            ? "每个订单可解锁有限次详批；若次数已用完，请重新购买。"
            : gate.status === 402
              ? "请先完成支付，再解锁完整内容。"
              : "请返回页面重新发起支付。";
        return jsonError({ error: gate.error, tip }, gate.status);
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
    return jsonError(
      {
        error: "解读暂时不可用，请稍后再试",
        tip: "服务器繁忙或网络波动，请等待 1～2 分钟后重试。若持续失败，请尝试刷新页面。",
      },
      500
    );
  }
};
