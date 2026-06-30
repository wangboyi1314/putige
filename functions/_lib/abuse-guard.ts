import type { ApiErrorBody } from "./api-errors";
import { abuseMessage, botMessage, invalidClientMessage } from "./api-errors";
import type { PagesEnv } from "./http";
import { checkRateLimit, clientIp } from "./rate-limit";

const SUSPICIOUS_UA = /curl|wget|python-requests|scrapy|httpclient|go-http|java\/|libwww|postman|insomnia/i;
const MAX_CID_IPS_PER_HOUR = 4;
const BLOCK_TTL = 86400;

type GuardResult =
  | { ok: true }
  | {
      ok: false;
      body: ApiErrorBody;
      status: number;
    };

interface CfProps {
  botManagement?: { score?: number };
  asn?: number;
}

async function isBlocked(env: PagesEnv, ip: string, clientId: string): Promise<boolean> {
  if (!env.ORDERS) return false;
  const [ipBlock, cidBlock] = await Promise.all([
    env.ORDERS.get(`block:ip:${ip}`),
    clientId ? env.ORDERS.get(`block:cid:${clientId}`) : Promise.resolve(null),
  ]);
  return !!(ipBlock || cidBlock);
}

async function addBlock(env: PagesEnv, ip: string, clientId: string, reason: string): Promise<void> {
  if (!env.ORDERS) return;
  const payload = JSON.stringify({ reason, at: new Date().toISOString() });
  await Promise.all([
    env.ORDERS.put(`block:ip:${ip}`, payload, { expirationTtl: BLOCK_TTL }),
    clientId ? env.ORDERS.put(`block:cid:${clientId}`, payload, { expirationTtl: BLOCK_TTL }) : Promise.resolve(),
  ]);
}

function ipSubnet(ip: string): string {
  if (ip.includes(":")) {
    return ip.split(":").slice(0, 4).join(":");
  }
  const parts = ip.split(".");
  return parts.length === 4 ? `${parts[0]}.${parts[1]}.${parts[2]}.0/24` : ip;
}

/** 同一设备 ID 短时间换多个 IP → 疑似代理池攻击 */
async function trackClientIps(
  env: PagesEnv,
  clientId: string,
  ip: string
): Promise<boolean> {
  if (!env.ORDERS || !clientId) return false;
  const key = `cid-ips:${clientId}`;
  const now = Date.now();
  const windowMs = 3600_000;

  let entries: { ip: string; at: number }[] = [];
  const raw = await env.ORDERS.get(key);
  if (raw) {
    try {
      entries = (JSON.parse(raw) as { ip: string; at: number }[]).filter((e) => now - e.at < windowMs);
    } catch {
      entries = [];
    }
  }
  if (!entries.some((e) => e.ip === ip)) {
    entries.push({ ip, at: now });
  }
  await env.ORDERS.put(key, JSON.stringify(entries), { expirationTtl: 7200 });

  const uniqueIps = new Set(entries.map((e) => e.ip));
  return uniqueIps.size > MAX_CID_IPS_PER_HOUR;
}

function botScore(request: Request): number | undefined {
  const cf = (request as Request & { cf?: CfProps }).cf;
  return cf?.botManagement?.score;
}

export interface AbuseCheckInput {
  clientId?: string;
  honeypot?: string;
  isPremium?: boolean;
}

export async function assertAbuseGuard(
  env: PagesEnv,
  request: Request,
  input: AbuseCheckInput
): Promise<GuardResult> {
  const ip = clientIp(request);
  const clientId = (input.clientId || "").trim().slice(0, 64);
  const ua = request.headers.get("User-Agent") || "";

  if (await isBlocked(env, ip, clientId)) {
    return { ok: false, body: abuseMessage(), status: 403 };
  }

  if (input.honeypot) {
    await addBlock(env, ip, clientId, "honeypot");
    return { ok: false, body: abuseMessage(), status: 403 };
  }

  const score = botScore(request);
  if (score !== undefined && score < 15) {
    await addBlock(env, ip, clientId, "bot_score");
    return { ok: false, body: botMessage(), status: 403 };
  }

  if (!ua || ua.length < 12 || SUSPICIOUS_UA.test(ua)) {
    const strict = await checkRateLimit(env, `abuse:badua:${ip}`, 2, 3600);
    if (!strict.ok) {
      await addBlock(env, ip, clientId, "bad_ua");
      return { ok: false, body: botMessage(), status: 403 };
    }
  }

  if (!input.isPremium) {
    if (!clientId || !clientId.startsWith("cid_")) {
      const missing = await checkRateLimit(env, `abuse:nocid:${ip}`, 2, 3600);
      if (!missing.ok) {
        return { ok: false, body: invalidClientMessage(), status: 403 };
      }
    } else {
      const cidLimit = await checkRateLimit(env, `interpret:cid:free:${clientId}`, 6, 3600);
      if (!cidLimit.ok) {
        return { ok: false, body: abuseMessage(3600), status: 403 };
      }

      const ipSwap = await trackClientIps(env, clientId, ip);
      if (ipSwap) {
        await addBlock(env, ip, clientId, "ip_rotation");
        return { ok: false, body: abuseMessage(), status: 403 };
      }
    }

    const subnet = ipSubnet(ip);
    const subnetLimit = await checkRateLimit(env, `interpret:subnet:free:${subnet}`, 15, 3600);
    if (!subnetLimit.ok) {
      return { ok: false, body: abuseMessage(7200), status: 403 };
    }

    const global = await checkRateLimit(env, "interpret:global:free", 300, 3600);
    if (!global.ok) {
      return {
        ok: false,
        body: {
          code: "rate_limit",
          error: "当前访问人数较多，免费预览暂时繁忙",
          retryAfter: global.retryAfter,
          tip: "请稍后再试，或直接解锁付费详批（付费通道优先保障）。",
        },
        status: 503,
      };
    }
  }

  return { ok: true };
}
