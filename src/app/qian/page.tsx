"use client";

import { useState } from "react";
import { drawQian, type QianStick } from "@/lib/qian";
import { Interpretation } from "@/components/Interpretation";
import { Paywall } from "@/components/Paywall";
import { MasterPicker } from "@/components/MasterPicker";
import { PageHero } from "@/components/SiteChrome";
import { ConsentNotice } from "@/components/ConsentNotice";
import { saveRecord } from "@/lib/records";

export default function QianPage() {
  const [masterId, setMasterId] = useState("huiming");
  const [stick, setStick] = useState<QianStick | null>(null);
  const [shaking, setShaking] = useState(false);
  const [question, setQuestion] = useState("");
  const [interpretation, setInterpretation] = useState("");
  const [premiumInterpretation, setPremiumInterpretation] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchInterpretation(target: QianStick, isPremium: boolean) {
    setLoading(true);
    try {
      const res = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "qian",
          question,
          isPremium,
          masterId,
          data: { ...target, signType: "关帝灵签" },
        }),
      });
      const data = await res.json();
      if (isPremium) setPremiumInterpretation(data.interpretation || "");
      else setInterpretation(data.interpretation || "");
    } finally {
      setLoading(false);
    }
  }

  async function handleDraw() {
    setShaking(true);
    setStick(null);
    setInterpretation("");
    setPremiumInterpretation("");
    await new Promise((r) => setTimeout(r, 2000));
    const drawn = drawQian();
    setStick(drawn);
    setShaking(false);
    saveRecord({ type: "qian", title: `第${drawn.number}签 · ${drawn.level}`, summary: drawn.poem.slice(0, 40) });
    await fetchInterpretation(drawn, false);
  }

  const levelColor: Record<string, string> = {
    上上: "text-red-400", 上吉: "text-orange-400", 中吉: "text-amber-400",
    中平: "text-amber-500", 下: "text-amber-600", 下下: "text-amber-700",
  };

  return (
    <div className="py-8 px-4">
      <div className="mx-auto max-w-2xl">
        <PageHero title="关帝灵签" subtitle="心诚则灵 · 默念所问 · 抽一支签" />

        <div className="glass-panel rounded-2xl p-6 mb-6 space-y-5">
          <MasterPicker value={masterId} onChange={setMasterId} />
          <div>
            <label className="text-amber-300/60 text-xs">写下您要问的事，心诚则灵</label>
            <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="例如：家人身体能否安康？"
              className="mt-1 w-full px-4 py-3 rounded-xl bg-amber-950/30 border border-amber-400/20 text-amber-100 placeholder-amber-400/30 focus:outline-none" />
          </div>
          <div className="text-center">
            <div className={`text-7xl mb-4 ${shaking ? "animate-bounce" : ""}`}>🏮</div>
            <button onClick={handleDraw} disabled={shaking || loading} className="px-10 py-3 bg-gradient-to-r from-red-800 to-red-700 text-amber-50 rounded-full font-medium disabled:opacity-50">
              {shaking ? "摇签中..." : stick ? "再求一签" : "求一支签"}
            </button>
          </div>
          <ConsentNotice topic="问事内容" />
        </div>

        {stick && (
          <div className="space-y-6">
            <div className="glass-panel p-8 rounded-xl text-center">
              <p className="text-amber-400/50 text-sm">关帝灵签 · 第 {stick.number} 签 / 100</p>
              <p className={`text-2xl font-serif my-3 ${levelColor[stick.level]}`}>{stick.level}签</p>
              <p className="text-amber-100 font-serif leading-loose mb-4">{stick.poem}</p>
              <p className="text-amber-400/50 text-sm">典故：{stick.story}</p>
              <p className="text-amber-300/60 text-sm mt-2">{stick.meaning}</p>
            </div>
            {interpretation ? (
              <Paywall productId="qian_premium" onUnlock={() => stick && fetchInterpretation(stick, true)} preview={<Interpretation content={interpretation} />}>
                <Interpretation content={premiumInterpretation} loading={loading} />
              </Paywall>
            ) : (
              <Interpretation content="" loading={loading} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
