"use client";

import { useState } from "react";
import { calculateBaZi } from "@/lib/bazi";
import { Interpretation } from "@/components/Interpretation";
import { Paywall } from "@/components/Paywall";
import { PageHero } from "@/components/SiteChrome";
import { ConsentNotice } from "@/components/ConsentNotice";
import { BirthDateForm } from "@/components/BirthDateForm";
import { ResultSection } from "@/components/ResultSection";
import { AnalysisLoading } from "@/components/AnalysisLoading";
import { saveRecord } from "@/lib/records";

const STYLES = ["Classic", "Modern", "Poetic", "Simple"];
const STYLE_LABELS: Record<string, string> = { Classic: "古典", Modern: "现代", Poetic: "诗意", Simple: "简约" };

export default function NamingPage() {
  const [mode, setMode] = useState<"naming" | "eval">("naming");
  const [surname, setSurname] = useState("");
  const [givenName, setGivenName] = useState("");
  const [gender, setGender] = useState<"男" | "女">("男");
  const [birth, setBirth] = useState({ year: 2025, month: 1, day: 1, hour: 12, isLeapMonth: false });
  const [charCount, setCharCount] = useState(2);
  const [styles, setStyles] = useState<string[]>(["Classic"]);
  const [generationChar, setGenerationChar] = useState("");
  const [avoidChars, setAvoidChars] = useState("");
  const [preview, setPreview] = useState("");
  const [full, setFull] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [started, setStarted] = useState(false);
  const [resultVersion, setResultVersion] = useState(0);

  function toggleStyle(s: string) {
    setStyles((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : prev.length < 3 ? [...prev, s] : prev));
  }

  async function run(isPremium: boolean, paidOrderId?: string) {
    if (!surname.trim()) {
      setError("请填写姓氏");
      return;
    }
    if (mode === "eval" && !givenName.trim()) {
      setError("请填写要测评的名字");
      return;
    }

    setError("");
    const { year, month, day, hour, isLeapMonth } = birth;
    const chart = calculateBaZi({ year, month, day, hour, calendarType: "lunar", isLeapMonth });

    if (!isPremium) {
      setStarted(true);
      setFull("");
      setResultVersion((v) => v + 1);
    }

    setLoading(true);
    try {
      const res = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "naming",
          question: mode === "naming" ? `为${gender}孩取名，姓氏${surname}` : `测评姓名${surname}${givenName}`,
          isPremium,
          orderId: paidOrderId,
          data: { ...chart, gender, surname, givenName, charCount, styles, generationChar, avoidChars, mode },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "生成失败，请稍后重试");

      if (isPremium) {
        setFull(data.interpretation || "");
      } else {
        setPreview(data.interpretation || "");
        const leap = isLeapMonth ? "闰" : "";
        saveRecord({
          type: "naming",
          title: `${surname}姓${mode === "naming" ? "取名" : "测评"}`,
          summary: `${gender} · 农历${year}年${leap}${month}月${day}日`,
        });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "生成失败，请稍后重试";
      setError(msg);
      if (!isPremium) setPreview("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="py-8 px-4">
      <div className="mx-auto max-w-2xl">
        <PageHero
          title="宝宝起名"
          subtitle="按农历生辰排八字喜忌，结合字义、音韵与寓意，为新生儿取一个经得起推敲的名字。"
        />

        <div className="flex gap-2 mb-4">
          {([{ m: "naming" as const, l: "专业起名" }, { m: "eval" as const, l: "姓名测评" }]).map(({ m, l }) => (
            <button key={m} onClick={() => setMode(m)} className={`flex-1 py-2 rounded-xl text-sm border ${mode === m ? "border-cyan-500/40 bg-cyan-900/30 text-amber-100" : "border-amber-400/15 text-amber-400/50"}`}>{l}</button>
          ))}
        </div>

        <div className="glass-panel rounded-2xl p-6 space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-amber-400/50 text-xs">姓氏</label>
              <input value={surname} onChange={(e) => setSurname(e.target.value)} placeholder="如：李" className="mt-1 w-full px-4 py-2.5 rounded-xl bg-amber-950/30 border border-amber-400/20 text-amber-100 text-center focus:outline-none" />
            </div>
            {mode === "eval" && (
              <div>
                <label className="text-amber-400/50 text-xs">名字</label>
                <input value={givenName} onChange={(e) => setGivenName(e.target.value)} placeholder="如：安澜" className="mt-1 w-full px-4 py-2.5 rounded-xl bg-amber-950/30 border border-amber-400/20 text-amber-100 text-center focus:outline-none" />
              </div>
            )}
            <div className="flex gap-2 items-end col-span-2 justify-center">
              {(["男", "女"] as const).map((g) => (
                <button key={g} onClick={() => setGender(g)} className={`px-8 py-2 rounded-full text-sm ${gender === g ? "bg-cyan-800/50 text-amber-100" : "border border-amber-400/20 text-amber-400/50"}`}>{g}</button>
              ))}
            </div>
          </div>

          <BirthDateForm value={birth} onChange={setBirth} yearMin={2010} yearMax={2026} />

          {mode === "naming" && (
            <>
              <div>
                <label className="text-amber-400/50 text-xs">姓名总字数（含姓）· 如：李安澜 = 3</label>
                <input type="number" min={2} max={4} value={charCount} onChange={(e) => setCharCount(Number(e.target.value))} className="mt-1 w-full px-4 py-2 rounded-xl bg-amber-950/30 border border-amber-400/20 text-amber-100 text-center" />
              </div>
              <div>
                <label className="text-amber-400/50 text-xs">偏好风格（最多 3 项）</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {STYLES.map((s) => (
                    <button key={s} onClick={() => toggleStyle(s)} className={`px-3 py-1 rounded-full text-xs border ${styles.includes(s) ? "border-cyan-500/40 bg-cyan-900/20" : "border-amber-400/15"}`}>{STYLE_LABELS[s]}</button>
                  ))}
                </div>
              </div>
              <input value={generationChar} onChange={(e) => setGenerationChar(e.target.value)} placeholder="家族辈分字（选填）如：德"
                className="w-full px-4 py-2.5 rounded-xl bg-amber-950/30 border border-amber-400/20 text-amber-100 placeholder-amber-400/30 text-sm focus:outline-none" />
              <input value={avoidChars} onChange={(e) => setAvoidChars(e.target.value)} placeholder="想避开的字（选填）如：伟、强、敏"
                className="w-full px-4 py-2.5 rounded-xl bg-amber-950/30 border border-amber-400/20 text-amber-100 placeholder-amber-400/30 text-sm focus:outline-none" />
            </>
          )}

          <div className="glass-panel rounded-xl p-4 text-amber-300/50 text-xs leading-relaxed">
            <p className="font-serif text-amber-300/70 mb-1">起名讲究</p>
            先看农历生辰八字，再看五行喜忌、音韵笔画与古籍典出，缺一不可。
          </div>

          <button
            onClick={() => run(false)}
            disabled={loading || !surname.trim()}
            className="w-full py-3 bg-gradient-to-r from-cyan-800 to-sky-700 text-amber-50 rounded-xl disabled:opacity-40"
          >
            {loading ? "正在生成名字方案…" : mode === "naming" ? "开始专业起名" : "开始姓名测评"}
          </button>
          {!started && (
            <p className="text-center text-amber-500/50 text-xs">点击后结果将显示在下方，付费可解锁完整取名方案</p>
          )}
          {error && !started && <p className="text-red-400 text-sm text-center">{error}</p>}
          <ConsentNotice topic="生辰信息与起名偏好" />
        </div>

        {started && (
          <ResultSection
            active
            scrollKey={resultVersion}
            banner={
              loading && !preview
                ? "正在结合八字喜忌生成名字，请稍候…"
                : preview
                  ? "取名方案已生成 · 向下解锁完整候选名字"
                  : error
                    ? "生成失败，请重试"
                    : "处理中…"
            }
          >
            {preview ? (
              <Paywall
                productId="naming_premium"
                previewContent={preview}
                onUnlock={(orderId) => run(true, orderId)}
              >
                <Interpretation content={full} loading={loading} />
              </Paywall>
            ) : loading ? (
              <AnalysisLoading productId="naming_premium" label="师父正在为您的宝宝甄选佳名…" />
            ) : error ? (
              <div className="p-6 rounded-xl border border-red-500/30 bg-red-950/20 text-center">
                <p className="text-red-300 text-sm mb-4">{error}</p>
                <button
                  type="button"
                  onClick={() => run(false)}
                  className="px-6 py-2 rounded-full bg-amber-700/50 text-amber-100 text-sm"
                >
                  重新生成
                </button>
              </div>
            ) : null}
          </ResultSection>
        )}
      </div>
    </div>
  );
}
