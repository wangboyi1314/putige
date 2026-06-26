/**
 * 支付宝当面付 — 扫码预下单
 * 文档: https://opendocs.alipay.com/open/02ekfg
 */

export interface AlipayPrecreateResult {
  qrCode: string;
}

function configured(): boolean {
  return !!(
    process.env.ALIPAY_APP_ID &&
    process.env.ALIPAY_PRIVATE_KEY &&
    process.env.ALIPAY_PUBLIC_KEY
  );
}

/** 当面付预下单，返回 qr_code 字符串 */
export async function alipayPrecreate(params: {
  orderId: string;
  amountYuan: number;
  subject: string;
}): Promise<AlipayPrecreateResult | null> {
  if (!configured()) {
    console.warn("[alipay] 未配置商户参数，跳过预下单");
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) throw new Error("缺少 NEXT_PUBLIC_BASE_URL");

  const bizContent = {
    out_trade_no: params.orderId,
    total_amount: params.amountYuan.toFixed(2),
    subject: params.subject.slice(0, 256),
  };

  // TODO: 构造 alipay.trade.precreate 请求并 RSA2 签名
  // notify_url: `${baseUrl}/api/payment/alipay/notify`
  // 推荐使用: npm install alipay-sdk
  void bizContent;
  throw new Error(
    "支付宝预下单尚未完成签名实现。请安装 alipay-sdk 并按 DEPLOY.md 配置密钥后实现 alipayPrecreate。"
  );
}

/** 验证支付宝异步通知 */
export async function verifyAlipayNotify(
  _params: Record<string, string>
): Promise<{ orderId: string; success: boolean } | null> {
  if (!configured()) return null;

  // TODO: alipay-sdk 验签，检查 trade_status === TRADE_SUCCESS
  return null;
}

export function isAlipayConfigured(): boolean {
  return configured();
}
