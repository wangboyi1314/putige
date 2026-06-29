"use client";

import { useEffect } from "react";
import type { ProductId } from "@/lib/payment";
import { savePaidOrder } from "@/lib/paid-session";

/** 处理虎皮椒支付完成后的 return_url 跳转，自动解锁对应商品 */
export function PaymentReturnHandler() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    if (params.get("paid") !== "1") return;

    const orderId = params.get("order");
    const productId = params.get("product") as ProductId | null;
    if (!orderId || !productId) return;

    let cancelled = false;

    async function tryUnlock() {
      for (let i = 0; i < 15; i++) {
        if (cancelled) return;
        try {
          const res = await fetch(
            `/api/payment/status?orderId=${encodeURIComponent(orderId!)}`
          );
          const data = await res.json();
          if (data.paid) {
            savePaidOrder(productId!, orderId!);
            window.dispatchEvent(
              new CustomEvent("bodhi-payment-unlock", {
                detail: { productId, orderId },
              })
            );
            const url = new URL(window.location.href);
            url.searchParams.delete("paid");
            url.searchParams.delete("order");
            url.searchParams.delete("product");
            window.history.replaceState({}, "", url.pathname + url.search);
            return;
          }
        } catch {
          /* 继续轮询 */
        }
        await new Promise((r) => setTimeout(r, 2000));
      }
    }

    void tryUnlock();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
