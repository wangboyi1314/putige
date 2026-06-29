"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { PRODUCTS, type ProductId } from "@/lib/payment";

interface PaywallProps {
  productId: ProductId;
  onUnlock: () => void;
  children: React.ReactNode;
  preview: React.ReactNode;
}

function paidStorageKey(productId: ProductId) {
  return `bodhi_paid_${productId}`;
}

export function Paywall({ productId, onUnlock, children, preview }: PaywallProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPay, setShowPay] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [amount, setAmount] = useState(0);
  const [demoMode, setDemoMode] = useState(false);
  const [qrMode, setQrMode] = useState(false);
  const [autoPayMode, setAutoPayMode] = useState(false);
  const [payUrl, setPayUrl] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [polling, setPolling] = useState(false);
  const [payChannel, setPayChannel] = useState<"wechat" | "alipay">("wechat");

  const product = PRODUCTS[productId];

  const markUnlocked = useCallback(() => {
    localStorage.setItem(paidStorageKey(productId), "1");
    setUnlocked(true);
    setShowPay(false);
    setPolling(false);
    onUnlock();
  }, [productId, onUnlock]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(paidStorageKey(productId)) === "1") {
      setUnlocked(true);
    }

    function handlePaymentUnlock(e: Event) {
      const detail = (e as CustomEvent<{ productId: ProductId }>).detail;
      if (detail?.productId === productId) {
        setUnlocked(true);
        onUnlock();
      }
    }
    window.addEventListener("bodhi-payment-unlock", handlePaymentUnlock);
    return () => window.removeEventListener("bodhi-payment-unlock", handlePaymentUnlock);
  }, [productId, onUnlock]);

  useEffect(() => {
    if (!polling || !orderId) return;
    const timer = window.setInterval(async () => {
      try {
        const res = await fetch(`/api/payment/status?orderId=${encodeURIComponent(orderId)}`);
        const data = await res.json();
        if (data.paid) {
          markUnlocked();
        }
      } catch {
        /* 继续轮询 */
      }
    }, 2000);
    return () => window.clearInterval(timer);
  }, [polling, orderId, markUnlocked]);

  async function startPay(channel?: "wechat" | "alipay") {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          payChannel: channel ?? payChannel,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "支付失败");

      setOrderId(data.orderId);
      setAmount(data.amount);
      setDemoMode(!!data.demoMode);
      setQrMode(!!data.qrMode);
      setAutoPayMode(!!(data.xunhuMode || data.merchantMode));
      setPayUrl(data.payUrl ?? null);
      setQrUrl(data.qrUrl ?? data.urlQrcode ?? data.wechatCodeUrl ?? data.alipayQrCode ?? null);

      if (data.demoMode) {
        const confirmRes = await fetch("/api/payment/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: data.orderId }),
        });
        if (confirmRes.ok) markUnlocked();
        else throw new Error("确认支付失败");
      } else {
        setShowPay(true);
        if (data.xunhuMode || data.merchantMode) setPolling(true);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "支付失败，请重试";
      setError(msg);
      setShowPay(false);
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmPaid() {
    if (!orderId) return;
    setLoading(true);
    setError("");
    try {
      const confirmRes = await fetch("/api/payment/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await confirmRes.json();
      if (!confirmRes.ok) throw new Error(data.error || "确认失败");
      markUnlocked();
    } catch (e) {
      setError(e instanceof Error ? e.message : "确认失败，请重试");
    } finally {
      setLoading(false);
    }
  }

  if (unlocked) return <>{children}</>;

  return (
    <div className="relative space-y-4">
      <div className="text-center p-5 sm:p-6 rounded-xl border border-amber-500/35 bg-gradient-to-b from-amber-950/50 to-amber-950/25 shadow-lg shadow-amber-900/20">
        <p className="text-amber-300 font-serif text-lg mb-1">{product.name}</p>
        <p className="text-amber-600/70 text-sm mb-4">{product.description}</p>
        <button
          type="button"
          onClick={() => startPay()}
          disabled={loading}
          className="w-full sm:w-auto px-10 py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 text-amber-950 rounded-full font-semibold hover:from-amber-500 hover:to-amber-400 transition-all disabled:opacity-50 shadow-lg shadow-amber-900/40 text-base"
        >
          {loading && !showPay ? "处理中..." : `解锁完整详批 ¥${product.price}`}
        </button>
        {error && !showPay && <p className="text-red-400 text-sm mt-3">{error}</p>}
        <p className="text-amber-400/45 text-xs mt-3">微信 / 支付宝扫码 · 付款后自动解锁</p>
      </div>

      <div className="relative overflow-hidden rounded-xl max-h-72 sm:max-h-80">
        {preview}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a1208]/50 to-[#1a1208] pointer-events-none" />
        <p className="absolute bottom-3 inset-x-0 text-center text-amber-400/70 text-xs pointer-events-none">
          以上为免费预览 · 付费解锁完整详批
        </p>
      </div>

      {showPay && !demoMode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel-heavy rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-center font-serif text-xl text-amber-100 mb-1">扫码支付</h3>
            <p className="text-center text-amber-300 text-2xl font-serif mb-1">¥{amount}</p>
            <p className="text-center text-amber-400/50 text-xs mb-4">
              {product.name} · 订单 {orderId.slice(-8)}
            </p>

            {autoPayMode && (
              <div className="flex justify-center gap-2 mb-4">
                {(["wechat", "alipay"] as const).map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => {
                      setPayChannel(ch);
                      startPay(ch);
                    }}
                    disabled={loading}
                    className={`px-4 py-1.5 rounded-full text-xs border ${
                      payChannel === ch
                        ? "border-amber-400/50 bg-amber-400/15 text-amber-100"
                        : "border-amber-400/20 text-amber-400/50"
                    }`}
                  >
                    {ch === "wechat" ? "微信支付" : "支付宝"}
                  </button>
                ))}
              </div>
            )}

            <p className="text-center text-amber-100/55 text-xs mb-4 leading-relaxed">
              {autoPayMode
                ? "请扫码或点击下方按钮支付，到账后自动解锁。"
                : "请扫码支付对应金额，完成后点击「我已支付」解锁。"}
            </p>

            {autoPayMode && qrUrl && (
              <div className="rounded-xl overflow-hidden border border-amber-400/25 bg-white p-3 mb-4">
                <p className="text-center text-xs text-gray-600 mb-2">电脑端请扫码</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrUrl} alt="付款二维码" className="mx-auto max-h-56 w-auto object-contain" />
              </div>
            )}

            {autoPayMode && payUrl && (
              <a
                href={payUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 mb-3 text-center bg-gradient-to-r from-emerald-700 to-emerald-600 text-white rounded-xl text-sm font-medium"
              >
                打开手机支付 / 跳转收银台
              </a>
            )}

            {qrMode && (
              <div className="grid sm:grid-cols-2 gap-4 mb-5">
                <div className="rounded-xl overflow-hidden border border-emerald-500/30 bg-white p-2">
                  <p className="text-center text-xs text-emerald-700 font-medium mb-2">微信支付</p>
                  <div className="relative aspect-square">
                    <Image src="/payment/wechat-qr.png" alt="微信收款码" fill className="object-contain" sizes="200px" />
                  </div>
                </div>
                <div className="rounded-xl overflow-hidden border border-blue-400/30 bg-white p-2">
                  <p className="text-center text-xs text-blue-600 font-medium mb-2">支付宝</p>
                  <div className="relative aspect-square">
                    <Image src="/payment/alipay-qr.png" alt="支付宝收款码" fill className="object-contain" sizes="200px" />
                  </div>
                </div>
              </div>
            )}

            {autoPayMode && polling && (
              <p className="text-center text-amber-400/60 text-xs mb-3 animate-pulse">等待支付到账…</p>
            )}

            {qrMode && (
              <button
                onClick={handleConfirmPaid}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-amber-950 rounded-xl font-medium disabled:opacity-50"
              >
                {loading ? "确认中..." : "我已支付，解锁内容"}
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setShowPay(false);
                setPolling(false);
              }}
              className="w-full mt-2 py-2 text-amber-400/50 text-sm hover:text-amber-300"
            >
              取消
            </button>
            {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
