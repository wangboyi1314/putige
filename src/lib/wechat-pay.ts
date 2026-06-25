/**
 * 微信支付 APIv3 — Native 扫码支付
 * 文档: https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_4_1.shtml
 *
 * 配置 WECHAT_PAY_* 环境变量后，在 PAYMENT_MODE=merchant 时启用。
 */

export interface WechatNativeOrder {
  codeUrl: string;
  prepayId?: string;
}

function configured(): boolean {
  return !!(
    process.env.WECHAT_PAY_MCH_ID &&
    process.env.WECHAT_PAY_APP_ID &&
    process.env.WECHAT_PAY_API_V3_KEY &&
    process.env.WECHAT_PAY_SERIAL_NO &&
    process.env.WECHAT_PAY_PRIVATE_KEY
  );
}

/** 创建 Native 支付订单，返回 code_url 供前端生成二维码 */
export async function createWechatNativeOrder(params: {
  orderId: string;
  amountYuan: number;
  description: string;
}): Promise<WechatNativeOrder | null> {
  if (!configured()) {
    console.warn("[wechat-pay] 未配置商户参数，跳过 Native 下单");
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) throw new Error("缺少 NEXT_PUBLIC_BASE_URL");

  const totalFen = Math.round(params.amountYuan * 100);
  const body = {
    appid: process.env.WECHAT_PAY_APP_ID,
    mchid: process.env.WECHAT_PAY_MCH_ID,
    description: params.description.slice(0, 127),
    out_trade_no: params.orderId,
    notify_url: `${baseUrl.replace(/\/$/, "")}/api/payment/wechat/notify`,
    amount: { total: totalFen, currency: "CNY" },
  };

  // TODO: 使用商户私钥对请求签名，调用 POST https://api.mch.weixin.qq.com/v3/pay/transactions/native
  // 推荐使用官方 SDK: npm install wechatpay-node-v3
  // 下方为占位，接入时替换为真实 HTTP 调用
  void body;
  throw new Error(
    "微信 Native 下单尚未完成签名实现。请安装 wechatpay-node-v3 并按 DEPLOY.md 配置证书后实现 createWechatNativeOrder。"
  );
}

/** 验证并解析微信支付回调（APIv3） */
export async function verifyWechatNotify(
  _headers: Record<string, string>,
  _rawBody: string
): Promise<{ orderId: string; success: boolean } | null> {
  if (!configured()) return null;

  // TODO: 验签 Wechatpay-Signature，解密 resource，解析 out_trade_no 与 trade_state
  // trade_state === 'SUCCESS' 时返回 { orderId, success: true }
  return null;
}

export function isWechatPayConfigured(): boolean {
  return configured();
}
