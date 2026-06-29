"use client";

import { useState, useCallback } from "react";
import { tossCoins, castHexagram, type LineValue, type GuaResult } from "@/lib/iching";
import { Interpretation } from "@/components/Interpretation";
import { Paywall } from "@/components/Paywall";
import { MasterPicker } from "@/components/MasterPicker";
import { PageHero } from "@/components/SiteChrome";
import { ConsentNotice } from "@/components/ConsentNotice";
import { ResultSection } from "@/components/ResultSection";
import { AnalysisLoading } from "@/components/AnalysisLoading";
import { saveRecord } from "@/lib/records";

const LINE_LABELS: Record<LineValue, string> = { 6: "老阴 ○×", 7: "少阳 —", 8: "少阴 --", 9: "老阳 ○" };

export default function GuaPage() {
  const [masterId, setMasterId] = useState("huiming");
  const [lines, setLines] = useState<LineValue[]>([]);
  const [result, setResult] = useState<GuaResult | null>(null);
  const [question, setQuestion] = useState("");
  const [interpretation, setInterpretation] = useState("");
  const [premiumInterpretation, setPremiumInterpretation] = useState("");
  const [loading, setLoading] = useState(false);
  const [casting, setCasting] = useState(false);
  const [resultVersion, setResultVersion] = useState(0);

  const interpret = useCallback(async (guaResult: GuaResult, isPremium: boolean, paidOrderId?: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "gua",
          question,
          isPremium,
          orderId: paidOrderId,
          masterId,
          data: { benGua: guaResult.benGua, huGua: guaResult.huGua, bianGua: guaResult.bianGua, changingLines: guaResult.changingLines, lines: guaResult.lines },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "解读失败");
      if (isPremium) setPremiumInterpretation(data.interpretation || "");
      else setInterpretation(data.interpretation || "");
    } catch (e) {
      if (!isPremium) setInterpretation("");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [question, masterId]);

  const cast = useCallback(async () => {
    setCasting(true);
    setLines([]);
    setResult(null);
    setPremiumInterpretation("");
    const newLines: LineValue[] = [];
    for (let i = 0; i < 6; i++) {
      await new Promise((r) => setTimeout(r, 400));
      newLines.push(tossCoins());
      setLines([...newLines]);
    }
    const guaResult = castHexagram(newLines);
    setResult(guaResult);
    setInterpretation("");
    setResultVersion((v) => v + 1);
    setCasting(false);
    saveRecord({ type: "gua", title: `${guaResult.benGua.name}卦`, summary: guaResult.benGua.guaCi });
    await interpret(guaResult, false);
  }, [interpret]);

  return (
    <div className="py-8 px-4">
      <div className="mx-auto max-w-2xl">
        <PageHero title="六爻占卜" subtitle="心诚则灵 · 先静心默念，再三铜起卦，一卦一事" />

        <div className="glass-panel rounded-2xl p-6 mb-6 space-y-5">
          <MasterPicker value={masterId} onChange={setMasterId} />
          <div>
            <label className="text-amber-300/60 text-xs">默念心中所问，写下您要问的事</label>
            <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="例如：这次出行是否顺利？"
              className="mt-1 w-full px-4 py-3 rounded-xl bg-amber-950/30 border border-amber-400/20 text-amber-100 placeholder-amber-400/30 focus:outline-none" />
          </div>
          <div className="text-center">
            <button onClick={cast} disabled={casting || loading} className="px-10 py-3 bg-gradient-to-r from-amber-700 to-amber-600 text-amber-50 rounded-full font-medium disabled:opacity-50">
              {casting ? "起卦中..." : loading ? "正在解卦…" : lines.length === 0 ? "摇动签筒 · 六爻成卦" : "重新起卦"}
            </button>
            {lines.length === 0 && (
              <p className="text-amber-500/50 text-xs mt-3">卦象与解读将显示在下方</p>
            )}
          </div>
          <ConsentNotice topic="问事内容" />
        </div>

        {lines.length > 0 && (
          <div className="glass-panel p-6 rounded-xl mb-6">
            <p className="text-amber-400/50 text-xs text-center mb-3">六爻（自下而上）</p>
            <div className="flex flex-col-reverse items-center gap-1">
              {lines.map((line, i) => (
                <div key={i} className="flex items-center gap-3 w-44 text-sm">
                  <span className="text-amber-500/40 w-8">第{i + 1}爻</span>
                  <span className="text-amber-200 font-mono flex-1 text-center">{LINE_LABELS[line]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {result && (
          <ResultSection
            active
            scrollKey={resultVersion}
            banner={
              loading && !interpretation
                ? "卦象已成，正在生成解读…"
                : "卦象与解读在下方 · 可解锁完整详批"
            }
          >
            <div className="grid grid-cols-3 gap-3">
              {[{ label: "本卦", gua: result.benGua }, { label: "互卦", gua: result.huGua }, ...(result.bianGua ? [{ label: "变卦", gua: result.bianGua }] : [])].map(({ label, gua }) => (
                <div key={label} className="glass-panel p-4 text-center">
                  <p className="text-amber-500/50 text-[10px]">{label}</p>
                  <p className="text-3xl my-1">{gua.symbol}</p>
                  <p className="text-amber-200 font-serif">{gua.name}卦</p>
                  <p className="text-amber-400/50 text-[10px] mt-1">{gua.guaCi}</p>
                </div>
              ))}
            </div>
            {interpretation ? (
              <Paywall
                productId="gua_premium"
                previewContent={interpretation}
                onUnlock={(orderId) => result && interpret(result, true, orderId)}
              >
                <Interpretation content={premiumInterpretation} loading={loading} />
              </Paywall>
            ) : (
              <AnalysisLoading productId="gua_premium" label="师父正在解读卦象…" />
            )}
          </ResultSection>
        )}
      </div>
    </div>
  );
}
