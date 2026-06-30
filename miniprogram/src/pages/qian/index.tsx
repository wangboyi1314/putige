import { useState, useCallback } from "react";
import { View, Text, Input, Button } from "@tarojs/components";
import { drawQian, type QianStick } from "../../lib/qian";
import { PageHero } from "../../components/PageHero";
import { MasterPicker } from "../../components/MasterPicker";
import { Paywall, InterpretBlock } from "../../components/Paywall";
import { postInterpret } from "../../services/api";
import { saveRecord } from "../../utils/storage";
import "./index.scss";

const LEVEL_CLASS: Record<string, string> = {
  上上: "level-best", 上吉: "level-good", 中吉: "level-mid",
  中平: "level-neutral", 下: "level-low", 下下: "level-worst",
};

export default function QianPage() {
  const [masterId, setMasterId] = useState("huiming");
  const [question, setQuestion] = useState("");
  const [stick, setStick] = useState<QianStick | null>(null);
  const [shaking, setShaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [interpretation, setInterpretation] = useState("");
  const [premiumText, setPremiumText] = useState("");
  const [error, setError] = useState("");

  const fetchInterpret = useCallback(
    async (target: QianStick, isPremium: boolean, orderId?: string) => {
      setLoading(true);
      setError("");
      const res = await postInterpret({
        type: "qian",
        question,
        isPremium,
        orderId,
        masterId,
        data: { ...target, signType: "关帝灵签" },
      });
      setLoading(false);
      if (!res.ok) {
        setError(res.error + (res.tip ? `\n${res.tip}` : ""));
        return;
      }
      if (isPremium) setPremiumText(res.interpretation);
      else setInterpretation(res.interpretation);
    },
    [question, masterId]
  );

  async function handleDraw() {
    setShaking(true);
    setStick(null);
    setInterpretation("");
    setPremiumText("");
    setError("");
    await new Promise((r) => setTimeout(r, 1500));
    const drawn = drawQian();
    setStick(drawn);
    setShaking(false);
    saveRecord({ type: "qian", title: `第${drawn.number}签 · ${drawn.level}`, summary: drawn.poem.slice(0, 40) });
    await fetchInterpret(drawn, false);
  }

  return (
    <View className="container">
      <PageHero title="关帝灵签" subtitle="心诚则灵 · 默念所问 · 抽一支签" />

      <View className="card">
        <MasterPicker value={masterId} onChange={setMasterId} />
        <Text className="label">您要问的事</Text>
        <Input
          className="question-input"
          value={question}
          onInput={(e) => setQuestion(e.detail.value)}
          placeholder="例如：家人身体能否安康？"
          placeholderClass="placeholder"
        />
        <View className="draw-area">
          <Text className={`lantern ${shaking ? "shake" : ""}`}>🏮</Text>
          <Button className="btn-primary draw-btn" disabled={shaking || loading} onClick={handleDraw}>
            {shaking ? "摇签中…" : loading ? "解签中…" : stick ? "再求一签" : "求一支签"}
          </Button>
        </View>
      </View>

      {error ? <Text className="error-tip">{error}</Text> : null}

      {stick ? (
        <View className="card stick-card">
          <Text className="stick-meta">关帝灵签 · 第 {stick.number} 签 / 100</Text>
          <Text className={`stick-level ${LEVEL_CLASS[stick.level] ?? ""}`}>{stick.level}签</Text>
          <Text className="stick-poem">{stick.poem}</Text>
          <Text className="stick-story">典故：{stick.story}</Text>
          <Text className="stick-meaning">{stick.meaning}</Text>
        </View>
      ) : null}

      {interpretation ? (
        <Paywall
          productId="qian_premium"
          previewContent={interpretation}
          onUnlock={(orderId) => stick && fetchInterpret(stick, true, orderId)}
        >
          <InterpretBlock content={premiumText} loading={loading} />
        </Paywall>
      ) : null}

      {loading && stick && !interpretation ? (
        <View className="card"><Text className="hero-sub">师父正在为您解签…</Text></View>
      ) : null}
    </View>
  );
}
