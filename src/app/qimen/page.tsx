"use client";

import { useState } from "react";
import { PageHero } from "@/components/SiteChrome";
import { MasterPicker } from "@/components/MasterPicker";
import { ConsentNotice } from "@/components/ConsentNotice";
import { Interpretation } from "@/components/Interpretation";

export default function QiMenPage() {
  const [masterId, setMasterId] = useState("xuanzhen");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  async function analyze() {
    if (!question.trim()) return;
    setLoading(true);
    const now = new Date();
    try {
      const res = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "gua",
          question,
          isPremium: false,
          masterId,
          data: {
            system: "奇门遁甲",
            datetime: now.toISOString(),
            note: "请以奇门遁甲九宫八门、天盘地盘人盘分析当前时空格局与行事宜忌",
          },
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
          <button onClick={analyze} disabled={loading || !question.trim()} className="w-full py-3 bg-gradient-to-r from-teal-700 to-cyan-600 text-amber-50 rounded-xl disabled:opacity-40">
            {loading ? "起局中..." : "奇门起局 · AI 解读"}
          </button>
          <ConsentNotice topic="问事内容" />
        </div>
        {result && <Interpretation content={result} />}
        <p className="text-amber-400/35 text-xs text-center mt-6">完整九宫盘与 80+ 专项局持续扩充中</p>
      </div>
    </div>
  );
}
