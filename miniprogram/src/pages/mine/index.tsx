import { useState, useEffect } from "react";
import { View, Text, Button, Navigator } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { SITE, API_BASE, LEGAL_LINKS, WEB_SITE_URL } from "../../config";
import { mpRequest } from "../../utils/request";
import { getRecords, type MpRecord } from "../../utils/storage";
import "./index.scss";

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
  } catch {
    return "";
  }
}

export default function MinePage() {
  const [health, setHealth] = useState("");
  const [records, setRecords] = useState<MpRecord[]>([]);

  useEffect(() => {
    setRecords(getRecords());
  }, []);

  async function checkApi() {
    Taro.showLoading({ title: "检测中" });
    const res = await mpRequest<{ ok: boolean; platform: string; paymentMode: string }>("/health");
    Taro.hideLoading();
    if (res.ok) {
      setHealth(`API 正常 · ${res.data.platform} · 模式: ${res.data.paymentMode === "demo" ? "免费解锁" : res.data.paymentMode}`);
    } else {
      setHealth(`API 异常: ${res.error}`);
    }
  }

  function copyApiBase() {
    Taro.setClipboardData({ data: API_BASE });
  }

  return (
    <View className="container">
      <Text className="hero-title">{SITE.name}</Text>
      <Text className="hero-sub">个人小程序 · 详批免费体验</Text>

      <View className="card notice-card">
        <Text className="notice-title">关于支付</Text>
        <Text className="notice-text">
          微信规定：个人主体小程序无法接入微信支付。本小程序内 AI 详批已免费开放；网站版支持虎皮椒在线付款。
        </Text>
        <Button
          className="btn-ghost mt"
          onClick={() => {
            Taro.setClipboardData({ data: WEB_SITE_URL });
            Taro.showToast({ title: "网站地址已复制", icon: "success" });
          }}
        >
          复制网站地址（付费用）
        </Button>
      </View>

      {records.length > 0 ? (
        <View className="card">
          <Text className="section-title">我的记录</Text>
          {records.slice(0, 20).map((r) => (
            <View key={r.id} className="record-item">
              <Text className="record-title">{r.title}</Text>
              <Text className="record-meta">{r.summary} · {formatDate(r.createdAt)}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <View className="card">
        <Text className="info-row">API 地址</Text>
        <Text className="info-value">{API_BASE}/api/mp/*</Text>
        <Button className="btn-ghost mt" onClick={copyApiBase}>复制地址</Button>
      </View>

      <View className="card">
        <Button className="btn-primary" onClick={checkApi}>检测后端连接</Button>
        {health ? <Text className="health-text">{health}</Text> : null}
      </View>

      <View className="card legal-links">
        {LEGAL_LINKS.map((l) => (
          <Navigator key={l.path} url={l.path} className="legal-link">
            <Text>{l.label}</Text>
            <Text className="link-arrow">›</Text>
          </Navigator>
        ))}
      </View>

      <View className="card legal">
        <Text>• 仅供传统文化学习与个人参考</Text>
        <Text>• 部分解读由 AI 辅助生成</Text>
        <Text>• 未满 18 周岁请勿使用</Text>
      </View>

      <Text className="disclaimer">{SITE.disclaimer}</Text>
    </View>
  );
}
