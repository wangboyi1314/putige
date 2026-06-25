"use client";

import { useState } from "react";
import { calculateBaZi } from "@/lib/bazi";
import { PageHero } from "@/components/SiteChrome";
import { MasterPicker } from "@/components/MasterPicker";
import { ConsentNotice } from "@/components/ConsentNotice";
import { Interpretation } from "@/components/Interpretation";
import { BirthDateForm } from "@/components/BirthDateForm";

export default function ZiWeiPage() {
  const [masterId, setMasterId] = useState("huiming");
  const [birth, setBirth] = useState({ year: 1990, month: 1, day: 1, hour: 12, isLeapMonth: false });
  const [gender, setGender] = useState<"男" | "女">("男");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  async function analyze() {
    const { year, month, day, hour, isLeapMonth } = birth;
    const chart = calculateBaZi({ year, month, day, hour, calendarType: "lunar", isLeapMonth });
    setLoading(true);
    try {
      const res = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "bazi",
          question: "请按紫微斗数体系分析命宫主星、十二宫格局与流年要点",
          isPremium: false,
          masterId,
          data: { ...chart, gender, system: "紫微斗数" },
        }),
      });
      const data = await res.json();
      setResult(data.interpretation || "");
    } finally {
      setLoading(false);
    }
  }

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
              <button key={g} onClick={() => setGender(g)} className={`px-6 py-2 rounded-full text-sm ${gender === g ? "bg-purple-800/60 text-amber-100" : "border border-amber-400/20 text-amber-400/50"}`}>{g}</button>
            ))}
          </div>
          <button onClick={analyze} disabled={loading} className="w-full py-3 bg-gradient-to-r from-purple-700 to-indigo-600 text-amber-50 rounded-xl disabled:opacity-50">
            {loading ? "排盘中..." : "紫微排盘 · AI 解读"}
          </button>
          <ConsentNotice topic="农历生辰信息" />
        </div>
        {result && <Interpretation content={result} />}
        <p className="text-amber-400/35 text-xs text-center mt-6">完整十二宫星曜表与 80+ 专项盘持续扩充中</p>
      </div>
    </div>
  );
}
