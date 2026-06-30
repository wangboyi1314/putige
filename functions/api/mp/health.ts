import { envGet } from "../../_lib/runtime-env";
import { envFrom, json, type PagesEnv } from "../../_lib/http";

export const onRequestGet: PagesFunction<PagesEnv> = async (context) => {
  const env = envFrom(context);
  const mpMode = envGet("MP_PAYMENT_MODE", env) || "demo";
  return json({
    ok: true,
    platform: "miniprogram",
    paymentMode: mpMode,
    apiPrefix: "/api/mp",
  });
};
