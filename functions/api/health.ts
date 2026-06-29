import { isDemoMode, isXunhuMode } from "../_lib/payment";
import { envGet } from "../_lib/runtime-env";
import { envFrom, json, type PagesEnv } from "../_lib/http";

export const onRequestGet: PagesFunction<PagesEnv> = async (context) => {
  const env = envFrom(context);
  return json({
    ok: true,
    paymentMode: envGet("PAYMENT_MODE", env),
    xunhuAppId: (envGet("XUNHU_APP_ID", env) || "20211120137").trim(),
    xunhu: isXunhuMode(env),
    demo: isDemoMode(env),
    hasXunhuSecret: !!envGet("XUNHU_APP_SECRET", env)?.trim(),
    hasOrdersKv: !!env.ORDERS,
    baseUrl: envGet("NEXT_PUBLIC_BASE_URL", env),
  });
};
