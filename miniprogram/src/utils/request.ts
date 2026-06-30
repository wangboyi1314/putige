import Taro from "@tarojs/taro";
import { API_BASE } from "../config";
import { getClientId } from "./storage";

const MP_PREFIX = "/api/mp";

interface RequestOptions {
  method?: "GET" | "POST";
  data?: Record<string, unknown>;
}

export async function mpRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<{ ok: true; data: T } | { ok: false; error: string; tip?: string }> {
  const url = `${API_BASE}${MP_PREFIX}${path}`;
  try {
    const res = await Taro.request<T & { error?: string; tip?: string }>({
      url,
      method: options.method ?? "GET",
      data: options.data,
      header: {
        "Content-Type": "application/json",
        "X-Bodhi-Platform": "miniprogram",
        "X-Bodhi-Client": getClientId(),
      },
    });

    if (res.statusCode >= 400) {
      return {
        ok: false,
        error: res.data?.error ?? `请求失败 (${res.statusCode})`,
        tip: res.data?.tip,
      };
    }
    return { ok: true, data: res.data };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "网络错误";
    return { ok: false, error: msg, tip: "请检查网络，并在小程序后台配置 request 合法域名" };
  }
}
