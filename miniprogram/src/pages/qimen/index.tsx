import { useState } from "react";
import { View, Text, Textarea, Button } from "@tarojs/components";
import { PageHero } from "../../components/PageHero";
import { MasterPicker } from "../../components/MasterPicker";
import { Paywall, InterpretBlock } from "../../components/Paywall";
import { postInterpret } from "../../services/api";
import { saveRecord } from "../../utils/storage";
import "./index.scss";

export default function QimenPage() {
  const [masterId, setMasterId] = useState("huiming");
  const [question, setQuestion] = useState("");
  const [interpretation, setInterpretation] = useState("");
  const [premiumText, setPremiumText] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState("");

  async function analyze(isPremium: boolean, orderId?: string) {
    if (!question.trim()) {
      setError("请先写下要问的事");
      return;
    }

    if (!isPremium) {
      setStarted(true);
      setPremiumText("");
      saveRecord({ type: "qimen", title: "奇门问事", summary: question.slice(0, 40) });
    }

    setLoading(true);
    setError("");
    const now = new Date();
    const res = await postInterpret({
      type: "qimen",
      question,
      isPremium,
      orderId,
      masterId,
      data: {
        datetime: now.toISOString(),
        solarDate: `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`,
      },
    });
    setLoading(false);

    if (!res.ok) {
      setError(res.error);
      return;
    }
    if (isPremium) setPremiumText(res.interpretation);
    else setInterpretation(res.interpretation);
  }

  return (
    <View className="container">
      <PageHero title="奇门遁甲" subtitle="一事一问 · 九宫八门观势" />

      <View className="card">
        <MasterPicker value={masterId} onChange={setMasterId} />
        <Text className="label">心中所问（一事一问）</Text>
        <Textarea
          className="question-area"
          value={question}
          onInput={(e) => setQuestion(e.detail.value)}
          placeholder="例如：下周谈合作，此时机是否合适？"
          maxlength={200}
        />
        <View className="mt">
          <Button className="btn-primary" disabled={loading} onClick={() => analyze(false)}>
            {loading && !started ? "起局中…" : "起局分析"}
          </Button>
        </View>
        <Text className="hint">以当前时辰起局，结合九宫八门给出参考</Text>
      </View>

      {started && interpretation ? (
        <View className="card">
          <Paywall
            productId="qimen_premium"
            previewContent={interpretation}
            onUnlock={(orderId) => analyze(true, orderId)}
          >
            <InterpretBlock content={premiumText} loading={loading} />
          </Paywall>
        </View>
      ) : started && loading ? (
        <View className="card">
          <Text className="hero-sub">正在推演奇门格局…</Text>
        </View>
      ) : null}

      {error ? <Text className="error-tip">{error}</Text> : null}
    </View>
  );
}
