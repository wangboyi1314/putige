import { useState, useCallback } from "react";
import { View, Text, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { PRODUCTS, type ProductId } from "../lib/products";
import { UNLOCK_MODE, WEB_SITE_URL } from "../config";
import { truncatePreview } from "../lib/preview";
import { createPayment, confirmPayment } from "../services/api";
import { savePaidOrder, getPaidOrder } from "../utils/storage";
import "./Paywall.scss";

interface PaywallProps {
  productId: ProductId;
  previewContent: string;
  onUnlock: (orderId: string) => void | Promise<void>;
  children?: React.ReactNode;
}

export function Paywall({ productId, previewContent, onUnlock, children }: PaywallProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [error, setError] = useState("");
  const product = PRODUCTS[productId];
  const isFree = UNLOCK_MODE === "free";

  const handleUnlock = useCallback(async () => {
    const saved = getPaidOrder(productId);
    if (saved) {
      setUnlocked(true);
      await onUnlock(saved);
      return;
    }

    setPayLoading(true);
    setError("");
    const created = await createPayment(productId);
    if (!created.ok) {
      setPayLoading(false);
      setError(created.error);
      return;
    }

    const { orderId, demoMode } = created.data;
    if (demoMode || isFree) {
      const confirmed = await confirmPayment(orderId);
      setPayLoading(false);
      if (!confirmed.ok) {
        setError(confirmed.error);
        return;
      }
      savePaidOrder(productId, orderId);
      setUnlocked(true);
      await onUnlock(orderId);
      return;
    }

    setPayLoading(false);
    Taro.showModal({
      title: "暂不支持小程序内支付",
      content: "个人主体小程序无法接入微信支付。如需付费详批，请前往网站使用。",
      confirmText: "打开网站",
      cancelText: "取消",
      success: (res) => {
        if (res.confirm) {
          Taro.setClipboardData({ data: WEB_SITE_URL });
          Taro.showToast({ title: "网址已复制", icon: "success" });
        }
      },
    });
  }, [productId, onUnlock, isFree]);

  if (unlocked && children) {
    return <View className="paywall-unlocked">{children}</View>;
  }

  return (
    <View className="paywall">
      <Text className="interpretation">{truncatePreview(previewContent)}</Text>
      <View className="paywall-mask">
        <Text className="pay-title">
          {isFree ? `查看${product.name}` : `${product.name} · ¥${product.price}`}
        </Text>
        <Text className="pay-desc">
          {isFree
            ? "个人小程序暂不支持收款，详批功能免费开放体验。"
            : product.description}
        </Text>
        <Button className="btn-primary unlock-btn" loading={payLoading} onClick={handleUnlock}>
          {isFree ? "免费查看完整详批" : "解锁完整详批"}
        </Button>
        {error ? <Text className="error-tip">{error}</Text> : null}
      </View>
    </View>
  );
}

export function InterpretBlock({ content, loading }: { content: string; loading?: boolean }) {
  if (loading && !content) {
    return (
      <View className="card">
        <Text className="loading-text">解读生成中…</Text>
      </View>
    );
  }
  return (
    <View className="card">
      <Text className="section-label">完整详批</Text>
      <Text className="interpretation">{content}</Text>
    </View>
  );
}
