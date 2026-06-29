"use client";

import { useState } from "react";
import { calculateBaZi, type BaZiChart, type CalendarType } from "@/lib/bazi";
import { Interpretation } from "@/components/Interpretation";
import { Paywall } from "@/components/Paywall";
import { MasterPicker } from "@/components/MasterPicker";
import { PageHero } from "@/components/SiteChrome";
import { ConsentNotice } from "@/components/ConsentNotice";
import { BirthDateForm, SHI_CHEN } from "@/components/BirthDateForm";
import { saveRecord } from "@/lib/records";

function DateStepper({ label, value, set, min, max }: { label: string; value: number; set: (v: number) => void; min: number; max: number }) {
  return (
    <div className="text-center">
      <p className="text-amber-400/50 text-[10px] mb-2">{label}</p>
      <div className="flex items-center justify-center gap-2">
        <button type="button" onClick={() => set(Math.max(min, value - 1))} className="size-8 rounded-full border border-amber-400/20 text-amber-300/60">−</button>
        <span className="text-xl font-serif text-amber-100 w-10">{value}</span>
        <button type="button" onClick={() => set(Math.min(max, value + 1))} className="size-8 rounded-full border border-amber-400/20 text-amber-300/60">+</button>
      </div>
    </div>
  );
}

export default function BaziPage() {
  const [masterId, setMasterId] = useState("huiming");
  const [calendarType, setCalendarType] = useState<CalendarType>("lunar");
  const [birth, setBirth] = useState({ year: 1990, month: 1, day: 1, hour: 12, isLeapMonth: false });
  const [gender, setGender] = useState<"男" | "女">("男");
  const [chart, setChart] = useState<BaZiChart | null>(null);
  const [question, setQuestion] = useState("");
  const [interpretation, setInterpretation] = useState("");
  const [premiumInterpretation, setPremiumInterpretation] = useState("");
  const [loading, setLoading] = useState(false);

  async function run(isPremium: boolean) {
    const { year, month, day, hour, isLeapMonth } = birth;
    const result = calculateBaZi({
      year,
      month,
      day,
      hour,
      calendarType,
      isLeapMonth: calendarType === "lunar" && isLeapMonth,
    });
    if (!isPremium) {
      setChart(result);
      setInterpretation("");
      setPremiumInterpretation("");
      saveRecord({ type: "bazi", title: "八字排盘", summary: result.inputLabel });
    }
    setLoading(true);
    try {
      const res = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "bazi", question, isPremium, masterId, data: { ...result, gender } }),
      });
      const data = await res.json();
      if (isPremium) setPremiumInterpretation(data.interpretation || "");
      else setInterpretation(data.interpretation || "");
    } finally {
      setLoading(false);
    }
  }

  const wuXingColors: Record<string, string> = { 金: "text-yellow-300", 木: "text-green-400", 水: "text-blue-400", 火: "text-red-400", 土: "text-amber-600" };

  return (
    <div className="py-8 px-4">
      <div className="mx-auto max-w-2xl">
        <PageHero
          title="八字精批"
          subtitle="默认按农历生辰排盘，支持闰月与十二时辰。输入生辰，真排盘、看格局、看大运。"
        />

        <div className="glass-panel rounded-2xl p-6 mb-6 space-y-5">
          <MasterPicker value={masterId} onChange={setMasterId} />

          <div className="flex gap-2">
            {([{ t: "lunar" as const, l: "农历（阴历）" }, { t: "solar" as const, l: "公历（阳历）" }]).map(({ t, l }) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setCalendarType(t);
                  if (t === "solar") setBirth((b) => ({ ...b, isLeapMonth: false }));
                }}
                className={`flex-1 py-2 rounded-xl text-xs border ${calendarType === t ? "border-amber-400/45 bg-amber-400/10 text-amber-100" : "border-amber-400/15 text-amber-400/50"}`}
              >
                {l}
              </button>
            ))}
          </div>

          {calendarType === "lunar" ? (
            <BirthDateForm value={birth} onChange={setBirth} />
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4">
                <DateStepper label="公历年" value={birth.year} set={(year) => setBirth((b) => ({ ...b, year }))} min={1920} max={2025} />
                <DateStepper label="公历月" value={birth.month} set={(month) => setBirth((b) => ({ ...b, month }))} min={1} max={12} />
                <DateStepper label="公历日" value={birth.day} set={(day) => setBirth((b) => ({ ...b, day }))} min={1} max={31} />
              </div>
              <div>
                <p className="text-amber-400/50 text-[10px] mb-2">出生时辰</p>
                <select
                  value={birth.hour}
                  onChange={(e) => setBirth((b) => ({ ...b, hour: Number(e.target.value) }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-amber-950/30 border border-amber-400/20 text-amber-100"
                >
                  {SHI_CHEN.map((sc) => (
                    <option key={sc.hour} value={sc.hour}>{sc.label}（{sc.range}点）</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="flex justify-center gap-3">
            {(["男", "女"] as const).map((g) => (
              <button key={g} type="button" onClick={() => setGender(g)} className={`px-8 py-2 rounded-full text-sm ${gender === g ? "bg-violet-800/60 text-amber-100 border border-violet-500/40" : "border border-amber-400/20 text-amber-400/50"}`}>{g}</button>
            ))}
          </div>

          <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="想了解什么？事业、财运、婚姻……"
            className="w-full px-4 py-3 rounded-xl bg-amber-950/30 border border-amber-400/20 text-amber-100 placeholder-amber-400/30 focus:outline-none" />

          <button onClick={() => run(false)} className="w-full py-3 bg-gradient-to-r from-violet-700 to-purple-600 text-amber-50 rounded-xl font-medium">开始真排盘</button>
          <ConsentNotice topic="生辰信息" />
        </div>

        {chart && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-xl">
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
              <Paywall productId="bazi_premium" onUnlock={() => run(true)} preview={<Interpretation content={interpretation} />}>
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
