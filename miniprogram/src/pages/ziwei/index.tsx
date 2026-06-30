import { useState } from "react";
import { View, Text, Input, Button } from "@tarojs/components";
import { calculateBaZi, type BaZiChart } from "../../lib/bazi";
import { BirthDateForm, GenderPicker } from "../../components/BirthDateForm";
import { PageHero } from "../../components/PageHero";
import { MasterPicker } from "../../components/MasterPicker";
import { Paywall, InterpretBlock } from "../../components/Paywall";
import { postInterpret } from "../../services/api";
import { saveRecord } from "../../utils/storage";
import "./index.scss";

const PILLAR_LABELS = ["年柱", "月柱", "日柱", "时柱"];

export default function ZiweiPage() {
  const [masterId, setMasterId] = useState("huiming");
  const [birth, setBirth] = useState({ year: 1990, month: 1, day: 1, hour: 12, isLeapMonth: false });
  const [gender, setGender] = useState<"男" | "女">("男");
  const [question, setQuestion] = useState("");
  const [chart, setChart] = useState<BaZiChart | null>(null);
  const [interpretation, setInterpretation] = useState("");
  const [premiumText, setPremiumText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyze(isPremium: boolean, orderId?: string) {
    const result = calculateBaZi({
      year: birth.year,
      month: birth.month,
      day: birth.day,
      hour: birth.hour,
      calendarType: "lunar",
      isLeapMonth: birth.isLeapMonth,
    });

    if (!isPremium) {
      setChart(result);
      setPremiumText("");
      saveRecord({ type: "ziwei", title: "紫微排盘", summary: result.inputLabel });
    }

    setLoading(true);
    setError("");
    const res = await postInterpret({
      type: "ziwei",
      question,
      isPremium,
      orderId,
      masterId,
      data: { ...result, gender },
    });
    setLoading(false);

    if (!res.ok) {
      setError(res.error);
      return;
    }
    if (isPremium) setPremiumText(res.interpretation);
    else setInterpretation(res.interpretation);
  }

  const pillars = chart ? [chart.year, chart.month, chart.day, chart.hour] : [];

  return (
    <View className="container">
      <PageHero title="紫微斗数" subtitle="命宫十二宫 · 主星辅星格局" />

      <View className="card">
        <MasterPicker value={masterId} onChange={setMasterId} />
        <BirthDateForm value={birth} onChange={setBirth} />
        <Text className="label">性别</Text>
        <GenderPicker value={gender} onChange={setGender} />
        <Text className="label">想了解什么</Text>
        <Input
          className="question-input"
          value={question}
          onInput={(e) => setQuestion(e.detail.value)}
          placeholder="格局、流年、事业……"
        />
        <View className="mt">
          <Button className="btn-primary" disabled={loading} onClick={() => analyze(false)}>
            {loading && !chart ? "排盘中…" : "开始分析"}
          </Button>
        </View>
      </View>

      {chart ? (
        <View className="card">
          <Text className="chart-meta">{chart.inputLabel} · {gender} · {chart.shengXiao}</Text>
          <View className="pillar-grid">
            {pillars.map((p, i) => (
              <View key={PILLAR_LABELS[i]}>
                <Text className="pillar-label">{PILLAR_LABELS[i]}</Text>
                <Text className="pillar-gz">{p.ganZhi}</Text>
                <Text className="pillar-wx">{p.wuXing}</Text>
              </View>
            ))}
          </View>
          {interpretation ? (
            <View className="mt">
              <Paywall
                productId="ziwei_premium"
                previewContent={interpretation}
                onUnlock={(orderId) => analyze(true, orderId)}
              >
                <InterpretBlock content={premiumText} loading={loading} />
              </Paywall>
            </View>
          ) : loading ? (
            <Text className="hero-sub">正在生成紫微解读…</Text>
          ) : null}
        </View>
      ) : null}

      {error ? <Text className="error-tip">{error}</Text> : null}
    </View>
  );
}
