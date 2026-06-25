import crypto from "crypto";

const DEFAULT_GATEWAY = "https://api.xunhupay.com/payment/do.html";

export interface XunhuChannel {
  appId: string;
  appSecret: string;
  label: string;
}

export interface XunhuCreateResult {
  url: string;
  urlQrcode: string;
  openOrderId?: string;
}

/** 虎皮椒签名：参数名 ASCII 升序，空值与 hash 不参与，末尾拼接 APPSECRET 后 MD5 */
export function xunhuHash(
  data: Record<string, string | number | undefined | null>,
  appSecret: string
): string {
  const keys = Object.keys(data)
    .filter((k) => {
      if (k === "hash") return false;
      const v = data[k];
      return v !== null && v !== undefined && v !== "";
    })
    .sort();

  const stringA = keys.map((k) => `${k}=${data[k]}`).join("&");
  return crypto.createHash("md5").update(stringA + appSecret).digest("hex");
}

function randomNonce(length = 16): string {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
}

/** 商户订单号仅允许数字、字母、_-*，最长 32 */
export function sanitizeTradeOrderId(orderId: string): string {
  const cleaned = orderId.replace(/[^a-zA-Z0-9_*-]/g, "_");
  return cleaned.slice(0, 32);
}

export function getXunhuWechatChannel(): XunhuChannel | null {
  const appId = process.env.XUNHU_APP_ID;
  const appSecret = process.env.XUNHU_APP_SECRET;
  if (!appId || !appSecret) return null;
  return { appId, appSecret, label: "微信" };
}

export function getXunhuAlipayChannel(): XunhuChannel | null {
  const appId = process.env.XUNHU_ALIPAY_APP_ID || process.env.XUNHU_APP_ID;
  const appSecret = process.env.XUNHU_ALIPAY_APP_SECRET || process.env.XUNHU_APP_SECRET;
  if (!appId || !appSecret) return null;
  if (!process.env.XUNHU_ALIPAY_APP_ID) return null;
  return { appId, appSecret, label: "支付宝" };
}

export function isXunhuConfigured(): boolean {
  return !!getXunhuWechatChannel();
}

/** 发起虎皮椒支付，返回收银台链接与 PC 二维码图地址 */
export async function createXunhuPayment(params: {
  orderId: string;
  amountYuan: number;
  title: string;
  notifyUrl: string;
  returnUrl?: string;
  channel: XunhuChannel;
}): Promise<XunhuCreateResult> {
  const gateway = process.env.XUNHU_API_URL || DEFAULT_GATEWAY;
  const tradeOrderId = sanitizeTradeOrderId(params.orderId);
  const payload: Record<string, string | number> = {
    version: "1.1",
    appid: params.channel.appId,
    trade_order_id: tradeOrderId,
    total_fee: params.amountYuan,
    title: params.title.replace(/%/g, "").slice(0, 42),
    time: Math.floor(Date.now() / 1000),
    notify_url: params.notifyUrl,
    nonce_str: randomNonce(16),
    plugins: "bodhi",
  };

  if (params.returnUrl) {
    payload.return_url = params.returnUrl;
  }

  payload.hash = xunhuHash(payload, params.channel.appSecret);

  const res = await fetch(gateway, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(
      Object.fromEntries(Object.entries(payload).map(([k, v]) => [k, String(v)]))
    ),
  });

  const data = (await res.json()) as {
    errcode?: number;
    errmsg?: string;
    url?: string;
    url_qrcode?: string;
    openid?: string;
    hash?: string;
  };

  if (data.errcode !== 0 || !data.url) {
    throw new Error(data.errmsg || "虎皮椒下单失败");
  }

  if (data.hash) {
    const { hash, ...rest } = data;
    const expected = xunhuHash(
      rest as Record<string, string | number>,
      params.channel.appSecret
    );
    if (hash !== expected) {
      console.warn("[xunhupay] 响应签名校验未通过");
    }
  }

  return {
    url: data.url,
    urlQrcode: data.url_qrcode || data.url,
    openOrderId: data.openid,
  };
}

/** 验证虎皮椒支付回调（form 表单 POST） */
export function verifyXunhuNotify(
  params: Record<string, string>,
  appSecret: string
): { valid: boolean; orderId: string; paid: boolean; amount: number } {
  const { hash, ...rest } = params;
  const expected = xunhuHash(rest, appSecret);
  const valid = hash === expected;
  const orderId = params.trade_order_id || "";
  const paid = params.status === "OD";
  const amount = parseFloat(params.total_fee || "0");
  return { valid, orderId, paid, amount };
}

/** 根据回调 appid 匹配对应密钥 */
export function resolveXunhuSecretByAppId(appid: string): string | null {
  if (appid === process.env.XUNHU_ALIPAY_APP_ID && process.env.XUNHU_ALIPAY_APP_SECRET) {
    return process.env.XUNHU_ALIPAY_APP_SECRET;
  }
  if (appid === process.env.XUNHU_APP_ID && process.env.XUNHU_APP_SECRET) {
    return process.env.XUNHU_APP_SECRET;
  }
  return process.env.XUNHU_APP_SECRET || null;
}
