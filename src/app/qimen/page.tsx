"use client";

import { useState } from "react";
import { PageHero } from "@/components/SiteChrome";
import { MasterPicker } from "@/components/MasterPicker";
import { ConsentNotice } from "@/components/ConsentNotice";
import { Interpretation } from "@/components/Interpretation";
import { Paywall } from "@/components/Paywall";
import { ResultSection } from "@/components/ResultSection";
import { AnalysisLoading } from "@/components/AnalysisLoading";
import { ExtendedChartsSection } from "@/components/ExtendedChartsSection";
import { saveRecord } from "@/lib/records";

export default function QiMenPage() {
  const [masterId, setMasterId] = useState("xuanzhen");
  const [question, setQuestion] = useState("");
  const [interpretation, setInterpretation] = useState("");
  const [premiumInterpretation, setPremiumInterpretation] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [resultVersion, setResultVersion] = useState(0);
  const [chartDatetime, setChartDatetime] = useState("");

  async function analyze(isPremium: boolean, paidOrderId?: string) {
    if (!question.trim()) return;
    if (!isPremium) {
      setStarted(true);
      setPremiumInterpretation("");
      setResultVersion((v) => v + 1);
      saveRecord({ type: "gua", title: "奇门起局", summary: question.slice(0, 40) });
    }
    setLoading(true);
    const now = new Date();
    const datetime = now.toISOString();
    if (!isPremium) setChartDatetime(datetime);
    try {
      const res = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "qimen",
          question,
          isPremium,
          orderId: paidOrderId,
          masterId,
          data: {
            system: "奇门遁甲",
            datetime,
            note: "请以奇门遁甲九宫八门、天盘地盘人盘分析当前时空格局与行事宜忌",
          },
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
  }

  return (
    <div className="py-8 px-4">
      <div className="mx-auto max-w-2xl">
        <PageHero
          title="奇门遁甲"
          subtitle="以当下时空起局，九宫八门推演时机与方位。适合问事、择日、趋避。"
        />
        <div className="glass-panel rounded-2xl p-6 space-y-4 mb-6">
          <MasterPicker value={masterId} onChange={setMasterId} />
          <div>
            <label className="text-amber-300/60 text-xs">所问之事</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="如：下周签约是否顺利？往哪个方位出行更有利？"
              rows={3}
              className="mt-1 w-full px-4 py-3 rounded-xl bg-black/40 border border-amber-400/20 text-amber-100 placeholder-amber-400/30 resize-none focus:outline-none"
            />
          </div>
          <p className="text-amber-400/40 text-xs text-center">
            自动取当前时间起局 · {new Date().toLocaleString("zh-CN")}
          </p>
          <button onClick={() => analyze(false)} disabled={loading || !question.trim()} className="w-full py-3 bg-gradient-to-r from-teal-700 to-cyan-600 text-amber-50 rounded-xl disabled:opacity-40">
            {loading ? "起局中..." : "奇门起局 · AI 解读"}
          </button>
          {!started && (
            <p className="text-center text-amber-500/50 text-xs">起局与解读将显示在下方，可解锁完整详批</p>
          )}
          <ConsentNotice topic="问事内容" />
        </div>

        {started && (
          <ResultSection
            active
            scrollKey={resultVersion}
            banner={
              loading && !interpretation
                ? "起局已完成，正在生成解读…"
                : loading
                  ? "正在更新解读…"
                  : "起局与解读已生成 · 向下查看并解锁完整详批"
            }
          >
            <div className="glass-panel p-6 rounded-xl ring-1 ring-teal-400/15 text-center">
              <p className="text-amber-400/50 text-xs mb-2">奇门遁甲 · 时空起局</p>
              <p className="text-amber-100 text-sm leading-relaxed">所问：{question}</p>
            </div>
            {interpretation ? (
              <Paywall
                productId="qimen_premium"
                previewContent={interpretation}
                onUnlock={(orderId) => analyze(true, orderId)}
              >
                <Interpretation content={premiumInterpretation} loading={loading} />
              </Paywall>
            ) : (
              <AnalysisLoading productId="qimen_premium" label="师父正在推演奇门格局…" />
            )}
          </ResultSection>
        )}

        {started && interpretation && chartDatetime && (
          <ExtendedChartsSection
            enabled
            productId="qimen_charts_premium"
            chartType="qimen_charts"
            title="完整九宫盘 · 80+ 专项局"
            subtitle="天盘地盘人盘九宫布局，含求财、出行、谈判等专项局深度推演"
            question={question}
            masterId={masterId}
            data={{
              system: "奇门遁甲",
              datetime: chartDatetime,
              question,
              note: "请输出完整九宫盘与最相关的专项局深度推演",
            }}
            resetKey={resultVersion}
          />
        )}
      </div>
    </div>
  );
}
