"use client";

import { useState } from "react";
import { calculateBaZi, type BaZiChart } from "@/lib/bazi";
import { PageHero } from "@/components/SiteChrome";
import { MasterPicker } from "@/components/MasterPicker";
import { ConsentNotice } from "@/components/ConsentNotice";
import { Interpretation } from "@/components/Interpretation";
import { BirthDateForm } from "@/components/BirthDateForm";
import { Paywall } from "@/components/Paywall";
import { ResultSection } from "@/components/ResultSection";
import { AnalysisLoading } from "@/components/AnalysisLoading";
import { saveRecord } from "@/lib/records";

export default function ZiWeiPage() {
  const [masterId, setMasterId] = useState("huiming");
  const [birth, setBirth] = useState({ year: 1990, month: 1, day: 1, hour: 12, isLeapMonth: false });
  const [gender, setGender] = useState<"男" | "女">("男");
  const [chart, setChart] = useState<BaZiChart | null>(null);
  const [interpretation, setInterpretation] = useState("");
  const [premiumInterpretation, setPremiumInterpretation] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultVersion, setResultVersion] = useState(0);

  async function analyze(isPremium: boolean, paidOrderId?: string) {
    const { year, month, day, hour, isLeapMonth } = birth;
    const result = calculateBaZi({ year, month, day, hour, calendarType: "lunar", isLeapMonth });
    if (!isPremium) {
      setChart(result);
      setPremiumInterpretation("");
      setResultVersion((v) => v + 1);
      saveRecord({ type: "bazi", title: "紫微排盘", summary: result.inputLabel });
    }
    setLoading(true);
    try {
      const res = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "ziwei",
          question: "请按紫微斗数体系分析命宫主星、十二宫格局与流年要点",
          isPremium,
          orderId: paidOrderId,
          masterId,
          data: { ...result, gender, system: "紫微斗数" },
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

  const wuXingColors: Record<string, string> = { 金: "text-yellow-300", 木: "text-green-400", 水: "text-blue-400", 火: "text-red-400", 土: "text-amber-600" };

  return (
    <div className="py-8 px-4">
      <div className="mx-auto max-w-2xl">
        <PageHero
          title="紫微斗数"
          subtitle="按农历生辰排盘，看命宫十二宫、主星辅星与流年际遇。可与子平、奇门交叉验证。"
        />
        <div className="glass-panel rounded-2xl p-6 space-y-4 mb-6">
          <MasterPicker value={masterId} onChange={setMasterId} />
          <BirthDateForm value={birth} onChange={setBirth} />
          <div className="flex justify-center gap-3">
            {(["男", "女"] as const).map((g) => (
              <button key={g} type="button" onClick={() => setGender(g)} className={`px-6 py-2 rounded-full text-sm ${gender === g ? "bg-purple-800/60 text-amber-100" : "border border-amber-400/20 text-amber-400/50"}`}>{g}</button>
            ))}
          </div>
          <button onClick={() => analyze(false)} disabled={loading} className="w-full py-3 bg-gradient-to-r from-purple-700 to-indigo-600 text-amber-50 rounded-xl disabled:opacity-50">
            {loading ? "排盘中..." : "紫微排盘 · AI 解读"}
          </button>
          {!chart && (
            <p className="text-center text-amber-500/50 text-xs">点击后排盘与解读将显示在下方，可解锁完整详批</p>
          )}
          <ConsentNotice topic="农历生辰信息" />
        </div>

        {chart && (
          <ResultSection
            active
            scrollKey={resultVersion}
            banner={
              loading && !interpretation
                ? "排盘已完成，正在生成解读…"
                : loading
                  ? "正在更新解读…"
                  : "排盘与解读已生成 · 向下查看并解锁完整详批"
            }
          >
            <div className="glass-panel p-6 rounded-xl ring-1 ring-purple-400/15">
              <p className="text-center text-amber-400/50 text-xs mb-1">输入：{chart.inputLabel}</p>
              <p className="text-center text-amber-200/60 text-sm mb-4">{chart.solarDate} · {chart.lunarDate} · 属{chart.shengXiao}</p>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[{ l: "年柱", p: chart.year }, { l: "月柱", p: chart.month }, { l: "日柱", p: chart.day }, { l: "时柱", p: chart.hour }].map(({ l, p }) => (
                  <div key={l} className="p-3 rounded-lg bg-amber-950/30">
                    <p className="text-amber-500/50 text-[10px] mb-1">{l}</p>
                    <p className="text-xl text-amber-100 font-serif">{p.gan}{p.zhi}</p>
                    <p className="text-amber-500/40 text-[10px]">{p.naYin}</p>
                  </div>
                ))}
              </div>
              <p className="text-center text-sm mt-4">日主：<span className={wuXingColors[chart.dayMasterWuXing]}>{chart.dayMaster}</span>（{chart.dayMasterWuXing}）</p>
            </div>
            {interpretation ? (
              <Paywall
                productId="ziwei_premium"
                previewContent={interpretation}
                onUnlock={(orderId) => analyze(true, orderId)}
              >
                <Interpretation content={premiumInterpretation} loading={loading} />
              </Paywall>
            ) : (
              <AnalysisLoading productId="ziwei_premium" label="师父正在研读您的紫微命盘…" />
            )}
          </ResultSection>
        )}

        <p className="text-amber-400/35 text-xs text-center mt-6">完整十二宫星曜表与 80+ 专项盘持续扩充中</p>
      </div>
    </div>
  );
}
