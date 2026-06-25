"use client";

import { useState, useEffect } from "react";
import { LAMP_DURATIONS, LAMP_TYPES, RELATIONS } from "@/lib/config";
import { PageHero } from "@/components/SiteChrome";
import { ConsentNotice } from "@/components/ConsentNotice";
import { saveRecord } from "@/lib/records";

interface LampWish {
  id: string;
  forName: string;
  relation: string;
  lampType: string;
  duration: string;
  wish: string;
  donorName: string;
  createdAt: string;
}

const LAMP_KEY = "bodhi_lamps";

function getLamps(): LampWish[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LAMP_KEY) || "[]");
  } catch {
    return [];
  }
}

function maskName(name: string): string {
  if (name.length <= 1) return name + "*";
  if (name.length === 2) return name[0] + "*";
  return name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
}

export default function LampPage() {
  const [forName, setForName] = useState("");
  const [relation, setRelation] = useState("");
  const [lampType, setLampType] = useState("peace");
  const [duration, setDuration] = useState("7");
  const [wish, setWish] = useState("");
  const [donorName, setDonorName] = useState("");
  const [lamps, setLamps] = useState<LampWish[]>([]);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    setLamps(getLamps());
  }, []);

  const todayCount = lamps.filter((l) => {
    const d = new Date(l.createdAt);
    const t = new Date();
    return d.toDateString() === t.toDateString();
  }).length;

  function lightLamp() {
    if (!forName.trim()) return;
    const entry: LampWish = {
      id: `lamp_${Date.now()}`,
      forName: forName.trim(),
      relation,
      lampType,
      duration,
      wish: wish.trim(),
      donorName: donorName.trim(),
      createdAt: new Date().toISOString(),
    };
    const updated = [entry, ...lamps].slice(0, 100);
    localStorage.setItem(LAMP_KEY, JSON.stringify(updated));
    setLamps(updated);
    setLit(true);
    saveRecord({
      type: "lamp",
      title: `供灯 · ${forName}`,
      summary: wish || "平安健康",
    });
  }

  const selectedLamp = LAMP_TYPES.find((l) => l.id === lampType);

  return (
    <div className="py-8 px-4">
      <div className="mx-auto max-w-xl">
        <PageHero
          title="心愿供灯"
          subtitle="点一盏灯，写下一份祝愿，留给家人、自己或重要时刻一份温和的仪式感。"
        />

        <div className="glass-panel rounded-full inline-flex items-center gap-4 px-6 py-2 text-sm text-amber-200/70 mx-auto mb-8 w-full justify-center">
          <span>已点亮 <span className="text-amber-300 text-lg font-serif">{lamps.length}</span> 盏</span>
          <span className="h-4 w-px bg-amber-400/20" />
          <span>今日新增 <span className="text-red-400/80 text-lg font-serif">{todayCount}</span> 盏</span>
        </div>

        {!lit ? (
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <div>
              <label className="text-amber-300/60 text-xs">为谁点灯</label>
              <input
                value={forName}
                onChange={(e) => setForName(e.target.value)}
                placeholder="家人姓名，例如：王秀英"
                className="mt-1 w-full px-4 py-2.5 rounded-xl bg-amber-950/30 border border-amber-400/20 text-amber-100 placeholder-amber-400/30 focus:outline-none focus:border-amber-400/45"
              />
            </div>
            <div>
              <label className="text-amber-300/60 text-xs">与您的关系</label>
              <select
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                className="mt-1 w-full px-4 py-2.5 rounded-xl bg-amber-950/30 border border-amber-400/20 text-amber-100 focus:outline-none"
              >
                <option value="">请选择</option>
                {RELATIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-amber-300/60 text-xs">选一盏灯</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
                {LAMP_TYPES.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setLampType(l.id)}
                    className={`p-2 rounded-xl text-center text-xs border transition-all ${
                      lampType === l.id ? "border-amber-400/50 bg-amber-400/10" : "border-amber-400/15"
                    }`}
                  >
                    <span className="text-xl block">{l.emoji}</span>
                    {l.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-amber-300/60 text-xs">供奉时长</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {LAMP_DURATIONS.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDuration(d.id)}
                    className={`px-4 py-1.5 rounded-full text-xs border ${
                      duration === d.id ? "border-amber-400/50 bg-amber-400/10 text-amber-200" : "border-amber-400/15 text-amber-400/50"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-amber-300/60 text-xs">心愿（可选，最多 80 字）</label>
              <textarea
                value={wish}
                onChange={(e) => setWish(e.target.value.slice(0, 80))}
                placeholder="例如：愿父亲身体康健、烦恼消解"
                rows={3}
                className="mt-1 w-full px-4 py-3 rounded-xl bg-amber-950/30 border border-amber-400/20 text-amber-100 placeholder-amber-400/30 focus:outline-none resize-none"
              />
            </div>
            <div>
              <label className="text-amber-300/60 text-xs">您的称呼（可选，会显示在灯墙）</label>
              <input
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="例如：李小华"
                className="mt-1 w-full px-4 py-2.5 rounded-xl bg-amber-950/30 border border-amber-400/20 text-amber-100 placeholder-amber-400/30 focus:outline-none"
              />
            </div>
            <button
              onClick={lightLamp}
              disabled={!forName.trim()}
              className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-500 text-amber-950 rounded-xl font-medium disabled:opacity-40"
            >
              需供奉 {LAMP_DURATIONS.find((d) => d.id === duration)?.label} · 点亮此灯
            </button>
            <ConsentNotice topic="心愿内容" />
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-8 text-center">
            <div className="text-7xl mb-4 animate-glow">{selectedLamp?.emoji ?? "🪔"}</div>
            <p className="text-amber-200 font-serif text-lg mb-2">灯已点亮</p>
            <p className="text-amber-300/60 text-sm mb-6">为 {forName} 点亮{selectedLamp?.name}</p>
            <button onClick={() => setLit(false)} className="text-amber-400/60 text-sm hover:text-amber-300">
              再点一盏 →
            </button>
          </div>
        )}

        {/* 灯墙 */}
        <div className="mt-10">
          <h2 className="text-amber-300 font-serif text-lg text-center mb-1">心愿灯墙</h2>
          <p className="text-amber-400/35 text-[10px] text-center mb-4">姓名已脱敏处理 · 仅作心愿展示</p>
          {lamps.length === 0 ? (
            <p className="text-center text-amber-400/30 text-sm py-8">暂无心愿灯，成为第一个点灯的人</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {lamps.slice(0, 20).map((l) => {
                const lt = LAMP_TYPES.find((t) => t.id === l.lampType);
                return (
                  <div key={l.id} className="glass-panel rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{lt?.emoji ?? "🪔"}</span>
                      <div>
                        <p className="text-amber-200 text-sm">{maskName(l.forName)} · {l.relation || "家人"}</p>
                        <p className="text-amber-300/50 text-xs mt-1 line-clamp-2">{l.wish || "平安顺遂"}</p>
                        {l.donorName && <p className="text-amber-400/30 text-[10px] mt-1">— {maskName(l.donorName)}</p>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
