"use client";

import { useState, useEffect } from "react";
import { getRecords, deleteRecord, type RecordItem } from "@/lib/records";
import Link from "next/link";
import { PageHero } from "@/components/SiteChrome";

export default function MinePage() {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [recoverCode, setRecoverCode] = useState("");

  useEffect(() => { setRecords(getRecords()); }, []);

  function shareSite() {
    const url = window.location.origin;
    if (navigator.share) {
      navigator.share({ title: "菩提阁", text: "为家人祈福求灵签", url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const typeLabel: Record<RecordItem["type"], string> = {
    lamp: "心愿灯", gua: "六爻", qian: "灵签", bazi: "八字", dream: "解梦", xiang: "相术", naming: "起名",
  };

  return (
    <div className="py-8 px-4">
      <div className="mx-auto max-w-2xl">
        <PageHero title="我的" subtitle="问事记录保存在本机 · 找回记录" />

        <div className="glass-panel rounded-xl p-6 mb-6 text-center">
          <p className="text-amber-200 font-serif mb-2">分享给家人 · 一起记录心愿</p>
          <p className="text-amber-300/50 text-sm mb-4 leading-relaxed">
            微信、朋友圈、抖音私信都可以分享，把一份温和祝愿传递出去。
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={shareSite} className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-yellow-500 text-amber-950 rounded-full text-sm font-medium">
              {copied ? "链接已复制" : "分享本站"}
            </button>
            <span className="px-4 py-2.5 border border-amber-400/25 text-amber-300/60 rounded-full text-sm">分享返佣 · 赚钱</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-6">
          {[{ href: "/lamp", l: "祈福", i: "灯" }, { href: "/incense", l: "敬香", i: "香" }, { href: "/qian", l: "灵签", i: "籤" }, { href: "/bazi", l: "八字", i: "命" }].map((x) => (
            <Link key={x.href} href={x.href} className="glass-panel rounded-xl p-3 text-center hover:border-amber-400/30">
              <span className="text-lg block">{x.i}</span><span className="text-[10px] text-amber-400/60">{x.l}</span>
            </Link>
          ))}
        </div>

        <h2 className="text-amber-300 font-serif mb-4">问事记录</h2>
        {records.length === 0 ? (
          <div className="glass-panel p-8 text-center text-amber-400/40 text-sm">
            暂无记录 · <Link href="/lamp" className="text-amber-300/60 hover:text-amber-200">去点一盏灯</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((r) => (
              <div key={r.id} className="glass-panel p-4 flex justify-between gap-3">
                <div>
                  <span className="text-[10px] text-amber-500/50 mr-2">{typeLabel[r.type]}</span>
                  <span className="text-amber-200 text-sm">{r.title}</span>
                  <p className="text-amber-400/40 text-xs mt-1">{r.summary}</p>
                  <p className="text-amber-500/25 text-[10px]">{new Date(r.createdAt).toLocaleString("zh-CN")}</p>
                </div>
                <button onClick={() => { deleteRecord(r.id); setRecords(getRecords()); }} className="text-amber-500/40 text-xs hover:text-red-400/70 shrink-0">删除</button>
              </div>
            ))}
          </div>
        )}

        <div className="glass-panel p-5 mt-6">
          <p className="text-amber-300/60 text-sm mb-2">找回记录</p>
          <p className="text-amber-400/35 text-xs mb-3">输入记录编号可在同一设备找回（云端同步开发中）</p>
          <input value={recoverCode} onChange={(e) => setRecoverCode(e.target.value)} placeholder="输入记录编号"
            className="w-full px-4 py-2 rounded-lg bg-amber-950/30 border border-amber-400/15 text-amber-200 text-sm focus:outline-none" />
        </div>
      </div>
    </div>
  );
}
