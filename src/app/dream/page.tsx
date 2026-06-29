"use client";

import { useState } from "react";
import { searchDream, getDreamsByCategory, DREAM_CATEGORIES, DREAM_ENTRIES, type DreamEntry } from "@/lib/dreams";
import { Interpretation } from "@/components/Interpretation";
import { Paywall } from "@/components/Paywall";
import { PageHero } from "@/components/SiteChrome";
import { ConsentNotice } from "@/components/ConsentNotice";
import { saveRecord } from "@/lib/records";

export default function DreamPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [results, setResults] = useState<DreamEntry[]>([]);
  const [selected, setSelected] = useState<DreamEntry | null>(null);
  const [interpretation, setInterpretation] = useState("");
  const [premiumInterpretation, setPremiumInterpretation] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSearch() {
    const found = query ? searchDream(query) : category ? getDreamsByCategory(category) : DREAM_ENTRIES.slice(0, 12);
    setResults(found);
    setSelected(null);
    setInterpretation("");
  }

  async function selectDream(dream: DreamEntry, isPremium = false) {
    if (!isPremium) {
      setSelected(dream);
      setInterpretation("");
      setPremiumInterpretation("");
      saveRecord({ type: "dream", title: `梦见${dream.keyword}`, summary: dream.brief.slice(0, 40) });
    }
    setLoading(true);
    try {
      const res = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "dream", question: query, isPremium, data: dream }),
      });
      const data = await res.json();
      if (isPremium) setPremiumInterpretation(data.interpretation || "");
      else setInterpretation(data.interpretation || "");
    } finally {
      setLoading(false);
    }
  }

  const luckColor: Record<string, string> = { 吉: "text-green-400", 凶: "text-red-400", 平: "text-amber-400" };

  return (
    <div className="py-8 px-4">
      <div className="mx-auto max-w-2xl">
        <PageHero title="周公解梦" subtitle="百梦皆有意，古今相参证 · 80 余条经典梦境" />

        <div className="glass-panel rounded-2xl p-6 mb-6 space-y-4">
          <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="请描述您梦中所见，如：梦见龙、梦见牙齿掉了"
            className="w-full px-4 py-3 rounded-xl bg-amber-950/30 border border-amber-400/20 text-amber-100 placeholder-amber-400/30 focus:outline-none" />
          <div className="flex flex-wrap gap-2">
            <button onClick={() => { setCategory(""); handleSearch(); }} className="px-3 py-1 rounded-full text-xs border border-amber-400/20 text-amber-400/60">全部</button>
            {DREAM_CATEGORIES.map((c) => (
              <button key={c} onClick={() => { setCategory(c); setResults(getDreamsByCategory(c)); setSelected(null); }}
                className={`px-3 py-1 rounded-full text-xs border ${category === c ? "border-amber-400/45 bg-amber-400/10 text-amber-200" : "border-amber-400/20 text-amber-400/60"}`}>{c}</button>
            ))}
          </div>
          <button onClick={handleSearch} className="w-full py-2.5 bg-gradient-to-r from-indigo-800 to-indigo-700 text-amber-50 rounded-xl text-sm">按类查梦 / 搜索</button>
          <ConsentNotice topic="梦境描述" />
        </div>

        {results.length > 0 && !selected && (
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {results.map((d) => (
              <button key={d.keyword} onClick={() => selectDream(d)} className="glass-panel p-4 text-left hover:border-amber-400/30 transition-colors">
                <div className="flex justify-between mb-1">
                  <span className="text-amber-200 font-serif">梦见{d.keyword}</span>
                  <span className={`text-xs ${luckColor[d.luck]}`}>{d.luck}</span>
                </div>
                <p className="text-amber-400/50 text-xs">{d.brief}</p>
              </button>
            ))}
          </div>
        )}

        {selected && (
          <div className="space-y-6">
            <button onClick={() => { setSelected(null); setInterpretation(""); }} className="text-amber-400/50 text-sm">← 返回</button>
            <div className="glass-panel p-6">
              <h2 className="text-amber-200 font-serif text-xl mb-2">梦见{selected.keyword}</h2>
              <p className={`text-sm mb-2 ${luckColor[selected.luck]}`}>吉凶：{selected.luck}</p>
              <p className="text-amber-400/60 text-sm italic mb-2">{selected.classic}</p>
              <p className="text-amber-200/70 text-sm">{selected.brief}</p>
            </div>
            {interpretation ? (
              <Paywall productId="dream_premium" onUnlock={() => selectDream(selected, true)} preview={<Interpretation content={interpretation} />}>
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
