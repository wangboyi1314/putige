"use client";

import { useState } from "react";
import { Interpretation } from "@/components/Interpretation";
import { Paywall } from "@/components/Paywall";
import { MasterPicker } from "@/components/MasterPicker";
import { PageHero } from "@/components/SiteChrome";
import { ConsentNotice } from "@/components/ConsentNotice";
import { saveRecord } from "@/lib/records";

type XiangType = "palm" | "face";
type HandSide = "left" | "right";

const FOCUS_AREAS = ["综合", "性情", "感情", "事业", "财运"];

export default function XiangPage() {
  const [masterId, setMasterId] = useState("huiming");
  const [type, setType] = useState<XiangType>("palm");
  const [hand, setHand] = useState<HandSide>("left");
  const [focus, setFocus] = useState("综合");
  const [preview, setPreview] = useState("");
  const [full, setFull] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageName, setImageName] = useState("");

  async function analyze(isPremium: boolean, paidOrderId?: string) {
    if (!imageName) return;
    setLoading(true);
    try {
      const res = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "xiang",
          question: `重点看${focus}`,
          isPremium,
          orderId: paidOrderId,
          masterId,
          data: {
            type: type === "palm" ? "手相" : "面相",
            hand: type === "palm" ? (hand === "left" ? "左手（先天）" : "右手（后天）") : undefined,
            focus,
            imageName,
            note: type === "palm"
              ? "上传清晰掌心照，先看掌色、掌丘与主线走势，结合相学古籍印证。"
              : "把额头、眉眼、鼻口、下庭等可见特征，落到人际、事业与当下状态上来讲。",
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "解读失败");
      if (isPremium) setFull(data.interpretation || "");
      else {
        setPreview(data.interpretation || "");
        saveRecord({ type: "xiang", title: type === "palm" ? "手相分析" : "面相分析", summary: focus });
      }
    } catch (e) {
      if (!isPremium) setPreview("");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="py-8 px-4">
      <div className="mx-auto max-w-2xl">
        <PageHero
          title="手相 / 面相"
          subtitle={type === "palm"
            ? "上传清晰掌心照，围绕图上可见特征逐段分析，先预览再解锁完整详批。"
            : "上传正脸照，围绕可见特征分析，先预览再解锁完整详批。"}
        />

        <div className="flex gap-2 mb-4 justify-center">
          {([{ t: "palm" as const, l: "手相" }, { t: "face" as const, l: "面相" }]).map(({ t, l }) => (
            <button key={t} onClick={() => { setType(t); setPreview(""); setFull(""); }}
              className={`px-6 py-2 rounded-full text-sm ${type === t ? "bg-rose-800/50 text-amber-100 border border-rose-500/40" : "border border-amber-400/20 text-amber-400/50"}`}>{l}</button>
          ))}
        </div>

        <div className="glass-panel rounded-2xl p-6 mb-6 space-y-5">
          <MasterPicker value={masterId} onChange={setMasterId} />

          {type === "palm" && (
            <div>
              <p className="text-amber-300/60 text-xs mb-2">看哪只手 · 男左女右；左手主先天，右手主后天</p>
              <div className="flex gap-2">
                {([{ h: "left" as const, l: "左手（先天）" }, { h: "right" as const, l: "右手（后天）" }]).map(({ h, l }) => (
                  <button key={h} onClick={() => setHand(h)} className={`flex-1 py-2 rounded-xl text-xs border ${hand === h ? "border-amber-400/45 bg-amber-400/10" : "border-amber-400/15"}`}>{l}</button>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-amber-300/60 text-xs mb-2">先选这次想深看的方向</p>
            <div className="flex flex-wrap gap-2">
              {FOCUS_AREAS.map((f) => (
                <button key={f} onClick={() => setFocus(f)} className={`px-3 py-1 rounded-full text-xs border ${focus === f ? "border-amber-400/45 bg-amber-400/10" : "border-amber-400/15 text-amber-400/50"}`}>{f}</button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-dashed border-amber-400/25 p-8 text-center">
            <p className="text-4xl mb-2">{type === "palm" ? "✋" : "😊"}</p>
            <p className="text-amber-300/60 text-sm mb-1">拍摄要求：自然光下，线条清晰，图片小于 5MB</p>
            <label className="inline-block mt-3 px-6 py-2 bg-amber-800/40 rounded-full text-sm text-amber-200 cursor-pointer hover:bg-amber-800/60">
              {imageName || "从相册选 / 拍照上传"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setImageName(f.name); setPreview(""); setFull(""); } }} />
            </label>
          </div>

          {imageName && (
            <button onClick={() => analyze(false)} disabled={loading} className="w-full py-3 bg-gradient-to-r from-rose-800 to-pink-700 text-amber-50 rounded-xl disabled:opacity-50">
              {loading ? "分析中..." : "开始专业解读"}
            </button>
          )}
          <ConsentNotice topic="掌纹照片" />
          <p className="text-amber-400/30 text-[10px] text-center">图片仅用于本次解读，不会用于其他用途</p>
        </div>

        {preview && (
          <Paywall
            productId="xiang_premium"
            previewContent={preview}
            onUnlock={(orderId) => analyze(true, orderId)}
          >
            <Interpretation content={full} loading={loading} />
          </Paywall>
        )}
      </div>
    </div>
  );
}
