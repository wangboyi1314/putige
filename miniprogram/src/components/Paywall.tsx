import { useState, useCallback } from "react";
import { View, Text, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { PRODUCTS, type ProductId } from "../lib/products";
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

    const { orderId, demoMode, amount } = created.data;
    if (demoMode) {
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
      title: "支付",
      content: `¥${amount} 微信支付接入中，当前为演示模式。`,
      showCancel: false,
    });
  }, [productId, onUnlock]);

  if (unlocked && children) {
    return <View className="paywall-unlocked">{children}</View>;
  }

  return (
    <View className="paywall">
      <Text className="interpretation">{truncatePreview(previewContent)}</Text>
      <View className="paywall-mask">
        <Text className="pay-title">{product.name} · ¥{product.price}</Text>
        <Text className="pay-desc">{product.description}</Text>
        <Button className="btn-primary unlock-btn" loading={payLoading} onClick={handleUnlock}>
          解锁完整详批
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
