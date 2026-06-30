import { useState, useCallback } from "react";
import { View, Text, Input, Button } from "@tarojs/components";
import { tossCoins, castHexagram, type LineValue, type GuaResult } from "../../lib/iching";
import { PageHero } from "../../components/PageHero";
import { MasterPicker } from "../../components/MasterPicker";
import { Paywall, InterpretBlock } from "../../components/Paywall";
import { postInterpret } from "../../services/api";
import { saveRecord } from "../../utils/storage";
import "./index.scss";

const LINE_LABELS: Record<LineValue, string> = {
  6: "老阴 ○×",
  7: "少阳 —",
  8: "少阴 --",
  9: "老阳 ○",
};

export default function GuaPage() {
  const [masterId, setMasterId] = useState("huiming");
  const [question, setQuestion] = useState("");
  const [lines, setLines] = useState<LineValue[]>([]);
  const [result, setResult] = useState<GuaResult | null>(null);
  const [interpretation, setInterpretation] = useState("");
  const [premiumText, setPremiumText] = useState("");
  const [loading, setLoading] = useState(false);
  const [casting, setCasting] = useState(false);
  const [error, setError] = useState("");

  const interpret = useCallback(
    async (guaResult: GuaResult, isPremium: boolean, orderId?: string) => {
      setLoading(true);
      setError("");
      const res = await postInterpret({
        type: "gua",
        question,
        isPremium,
        orderId,
        masterId,
        data: {
          benGua: guaResult.benGua,
          huGua: guaResult.huGua,
          bianGua: guaResult.bianGua,
          changingLines: guaResult.changingLines,
          lines: guaResult.lines,
        },
      });
      setLoading(false);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      if (isPremium) setPremiumText(res.interpretation);
      else setInterpretation(res.interpretation);
    },
    [question, masterId]
  );

  async function handleCast() {
    setCasting(true);
    setLines([]);
    setResult(null);
    setInterpretation("");
    setPremiumText("");
    setError("");

    const newLines: LineValue[] = [];
    for (let i = 0; i < 6; i++) {
      await new Promise((r) => setTimeout(r, 400));
      newLines.push(tossCoins());
      setLines([...newLines]);
    }
    const guaResult = castHexagram(newLines);
    setResult(guaResult);
    setCasting(false);
    saveRecord({
      type: "gua",
      title: `${guaResult.benGua.name}卦`,
      summary: guaResult.benGua.guaCi,
    });
    await interpret(guaResult, false);
  }

  const guaCards = result
    ? [
        { label: "本卦", gua: result.benGua },
        { label: "互卦", gua: result.huGua },
        ...(result.bianGua ? [{ label: "变卦", gua: result.bianGua }] : []),
      ]
    : [];

  return (
    <View className="container">
      <PageHero title="六爻占卜" subtitle="心诚则灵 · 三铜起卦 · 一卦一事" />

      <View className="card">
        <MasterPicker value={masterId} onChange={setMasterId} />
        <Text className="label">您要问的事</Text>
        <Input
          className="question-input"
          value={question}
          onInput={(e) => setQuestion(e.detail.value)}
          placeholder="例如：这次出行是否顺利？"
        />
        <View className="cast-area">
          <Button
            className="btn-primary"
            disabled={casting || loading}
            onClick={handleCast}
          >
            {casting ? "起卦中…" : loading ? "解卦中…" : lines.length ? "重新起卦" : "摇动三铜 · 六爻成卦"}
          </Button>
        </View>
      </View>

      {lines.length > 0 ? (
        <View className="card lines-card">
          <Text className="label">六爻（自下而上）</Text>
          {[...lines].reverse().map((line, i) => (
            <View key={i} className="line-row">
              <Text className="line-idx">第{lines.length - i}爻</Text>
              <Text>{LINE_LABELS[line]}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {result ? (
        <View className="card">
          <View className="gua-grid">
            {guaCards.map(({ label, gua }) => (
              <View key={label} className="gua-item">
                <Text className="gua-label">{label}</Text>
                <Text className="gua-symbol">{gua.symbol}</Text>
                <Text className="gua-name">{gua.name}卦</Text>
                <Text className="gua-ci">{gua.guaCi}</Text>
              </View>
            ))}
          </View>
          {interpretation ? (
            <View className="mt">
              <Paywall
                productId="gua_premium"
                previewContent={interpretation}
                onUnlock={(orderId) => interpret(result, true, orderId)}
              >
                <InterpretBlock content={premiumText} loading={loading} />
              </Paywall>
            </View>
          ) : loading ? (
            <Text className="hero-sub">师父正在解读卦象…</Text>
          ) : null}
        </View>
      ) : null}

      {error ? <Text className="error-tip">{error}</Text> : null}
    </View>
  );
}
