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

export default function BaziPage() {
  const [masterId, setMasterId] = useState("huiming");
  const [birth, setBirth] = useState({ year: 1990, month: 1, day: 1, hour: 12, isLeapMonth: false });
  const [gender, setGender] = useState<"男" | "女">("男");
  const [question, setQuestion] = useState("");
  const [chart, setChart] = useState<BaZiChart | null>(null);
  const [interpretation, setInterpretation] = useState("");
  const [premiumText, setPremiumText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function run(isPremium: boolean, orderId?: string) {
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
      saveRecord({ type: "bazi", title: "八字排盘", summary: result.inputLabel });
    }

    setLoading(true);
    setError("");
    const res = await postInterpret({
      type: "bazi",
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
      <PageHero title="八字排盘" subtitle="四柱 · 五行 · 可与紫微交叉验证" />

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
          placeholder="事业、财运、婚姻……"
        />
        <View className="mt">
          <Button className="btn-primary" disabled={loading} onClick={() => run(false)}>
            {loading && !chart ? "排盘中…" : "开始排盘"}
          </Button>
        </View>
      </View>

      {chart ? (
        <View className="card">
          <Text className="chart-meta">{chart.inputLabel} · 日主 {chart.dayMaster}（{chart.dayMasterWuXing}）</Text>
          <View className="pillar-grid">
            {pillars.map((p, i) => (
              <View key={PILLAR_LABELS[i]}>
                <Text className="pillar-label">{PILLAR_LABELS[i]}</Text>
                <Text className="pillar-gz">{p.ganZhi}</Text>
                <Text className="pillar-wx">{p.wuXing}</Text>
              </View>
            ))}
          </View>
          <View className="wx-row">
            {Object.entries(chart.wuXingCount).map(([wx, n]) => (
              <Text key={wx}>{wx}{n}</Text>
            ))}
          </View>
          {interpretation ? (
            <View className="mt">
              <Paywall
                productId="bazi_premium"
                previewContent={interpretation}
                onUnlock={(orderId) => run(true, orderId)}
              >
                <InterpretBlock content={premiumText} loading={loading} />
              </Paywall>
            </View>
          ) : loading ? (
            <Text className="hero-sub">正在生成解读…</Text>
          ) : null}
        </View>
      ) : null}

      {error ? <Text className="error-tip">{error}</Text> : null}
    </View>
  );
}
