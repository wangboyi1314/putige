import { getClientId, interpretRequestHeaders } from "./client-guard";

export interface GuardErrorDetail {
  message: string;
  code?: string;
  retryAfter?: number;
  tip?: string;
}

export function parseGuardError(data: {
  error?: string;
  code?: string;
  retryAfter?: number;
  tip?: string;
}): GuardErrorDetail {
  return {
    message: data.error || "请求失败，请稍后重试",
    code: data.code,
    retryAfter: data.retryAfter,
    tip: data.tip,
  };
}

export async function postInterpret(body: Record<string, unknown>): Promise<
  | { ok: true; interpretation: string }
  | { ok: false; guard: GuardErrorDetail }
> {
  const res = await fetch("/api/interpret", {
    method: "POST",
    headers: interpretRequestHeaders(),
    body: JSON.stringify({
      ...body,
      clientId: getClientId(),
      _hp: "",
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    return { ok: false, guard: parseGuardError(data) };
  }
  return { ok: true, interpretation: data.interpretation || "" };
}
