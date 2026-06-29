import type { ProductId } from "./payment";

const SESSION_PREFIX = "bodhi_paid_order_";
const LEGACY_PREFIX = "bodhi_paid_";

function sessionKey(productId: ProductId): string {
  return `${SESSION_PREFIX}${productId}`;
}

/** 清除旧版 localStorage 永久解锁（会导致未付款也能看） */
export function clearLegacyPaidFlags(): void {
  if (typeof window === "undefined") return;
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k?.startsWith(LEGACY_PREFIX)) keys.push(k);
  }
  keys.forEach((k) => localStorage.removeItem(k));
}

export function savePaidOrder(productId: ProductId, orderId: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(sessionKey(productId), orderId);
}

export function getPaidOrderId(productId: ProductId): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(sessionKey(productId));
}

export async function verifyPaidSession(productId: ProductId): Promise<string | null> {
  const orderId = getPaidOrderId(productId);
  if (!orderId) return null;
  try {
    const res = await fetch(`/api/payment/status?orderId=${encodeURIComponent(orderId)}`);
    const data = await res.json();
    if (data.paid) return orderId;
    sessionStorage.removeItem(sessionKey(productId));
  } catch {
    /* ignore */
  }
  return null;
}
