export type ApiErrorCode =
  | "rate_limit"
  | "abuse_detected"
  | "bot_blocked"
  | "invalid_client"
  | "order_exhausted"
  | "payload_too_large";

export interface ApiErrorBody {
  error: string;
  code?: ApiErrorCode;
  retryAfter?: number;
  tip?: string;
}

export function formatRetryMinutes(seconds: number): string {
  if (seconds < 60) return `${seconds} 秒`;
  const m = Math.ceil(seconds / 60);
  return m < 60 ? `${m} 分钟` : `${Math.ceil(m / 60)} 小时`;
}

export function rateLimitMessage(retryAfter: number, isPremium: boolean): ApiErrorBody {
  const wait = formatRetryMinutes(retryAfter);
  if (isPremium) {
    return {
      code: "rate_limit",
      error: `操作过于频繁，请 ${wait} 后再试`,
      retryAfter,
      tip: "您已完成付费，请稍候片刻后重试；若持续失败，可在「我的」查看订单或联系客服。",
    };
  }
  if (retryAfter <= 90) {
    return {
      code: "rate_limit",
      error: "您点得有点快啦，请稍歇片刻再试",
      retryAfter,
      tip: `约 ${wait} 后可继续免费预览。如需马上查看完整详批，可点击下方「解锁完整详批」完成支付。`,
    };
  }
  return {
    code: "rate_limit",
    error: `今日免费预览次数已用完，请 ${wait} 后再试`,
    retryAfter,
    tip: "免费预览每小时有限额，用于保障服务稳定。解锁付费详批不受此限制影响。",
  };
}

export function abuseMessage(retryAfter = 86400): ApiErrorBody {
  return {
    code: "abuse_detected",
    error: "检测到异常访问，已暂时限制",
    retryAfter,
    tip: "请通过菩提阁官网正常页面使用。若您未进行异常操作，请稍后再试或更换网络；恶意刷接口将被持续拦截。",
  };
}

export function botMessage(): ApiErrorBody {
  return {
    code: "bot_blocked",
    error: "无法完成本次请求",
    tip: "请使用浏览器打开菩提阁官网，不要使用自动化脚本访问。正常用户不受影响。",
  };
}

export function invalidClientMessage(): ApiErrorBody {
  return {
    code: "invalid_client",
    error: "请通过官网页面使用本功能",
    tip: "直接调用接口无法获取解读。请在浏览器中打开菩提阁，输入信息后点击排盘/解读按钮。",
  };
}
