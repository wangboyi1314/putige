import { isDemoMode, isXunhuMode } from "../../_lib/payment";
import { envGet } from "../../_lib/runtime-env";
import { envFrom, json, type PagesEnv } from "../../_lib/http";

export const onRequestGet: PagesFunction<PagesEnv> = async (context) => {
  const env = envFrom(context);
  return json({
    ok: true,
    paymentMode: envGet("PAYMENT_MODE", env),
    xunhu: isXunhuMode(env),
    demo: isDemoMode(env),
    hasXunhuSecret: !!envGet("XUNHU_APP_SECRET", env),
    baseUrl: envGet("NEXT_PUBLIC_BASE_URL", env),
  });
};
