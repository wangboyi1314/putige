import { mpRequest } from "../utils/request";
import { getClientId } from "../utils/storage";
import type { QianStick } from "../lib/qian";

export async function postInterpret(params: {
  type: string;
  data: Record<string, unknown>;
  question?: string;
  isPremium?: boolean;
  masterId?: string;
  orderId?: string;
}): Promise<{ ok: true; interpretation: string } | { ok: false; error: string; tip?: string }> {
  const res = await mpRequest<{ interpretation: string }>("/interpret", {
    method: "POST",
    data: { ...params, clientId: getClientId(), _hp: "" },
  });
  if (!res.ok) return res;
  return { ok: true, interpretation: res.data.interpretation || "" };
}

export interface CreatePaymentResult {
  orderId: string;
  amount: number;
  demoMode?: boolean;
  message?: string;
  wxPayMode?: boolean;
  payment?: Record<string, string>;
}

export async function createPayment(productId: string) {
  return mpRequest<CreatePaymentResult>("/payment/create", {
    method: "POST",
    data: { productId },
  });
}

export async function confirmPayment(orderId: string) {
  return mpRequest<{ success: boolean; sessionId?: string }>("/payment/confirm", {
    method: "POST",
    data: { orderId },
  });
}

export async function getPaymentStatus(orderId: string) {
  return mpRequest<{ paid: boolean; status: string }>(`/payment/status?orderId=${encodeURIComponent(orderId)}`);
}

export type { QianStick };
