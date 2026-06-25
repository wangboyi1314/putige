import { getTodayHuangLi, getShiChen } from "@/lib/huangli";
import { PageHero } from "@/components/SiteChrome";

export default function HuangLiPage() {
  const huangli = getTodayHuangLi();
  const shiChen = getShiChen();

  return (
    <div className="py-8 px-4">
      <div className="mx-auto max-w-2xl">
        <PageHero title="今日黄历" subtitle="干支宜忌、神煞冲煞、十二时辰，传统择吉一目了然" />

        <div className="p-6 rounded-xl border border-emerald-900/30 bg-emerald-950/20 mb-6 text-center">
          <p className="text-amber-300 text-xl font-serif mb-1">{huangli.solarDate}</p>
          <p className="text-amber-500/70 text-sm mb-3">{huangli.lunarDate}</p>
          <p className="text-amber-400 font-serif text-lg tracking-wider">{huangli.ganZhi}</p>
          <p className="text-amber-600/50 text-sm mt-2">
            {huangli.shengXiao}年 · {huangli.wuXing} · {huangli.jieQi}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-5 rounded-xl border border-green-900/30 bg-green-950/20">
            <h3 className="text-green-400 font-serif mb-3">宜</h3>
            <div className="flex flex-wrap gap-2">
              {huangli.yi.map((item, i) => (
                <span key={`yi-${item}-${i}`} className="px-2 py-1 rounded-md bg-green-900/30 text-green-300/80 text-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="p-5 rounded-xl border border-red-900/30 bg-red-950/20">
            <h3 className="text-red-400 font-serif mb-3">忌</h3>
            <div className="flex flex-wrap gap-2">
              {huangli.ji.map((item, i) => (
                <span key={`ji-${item}-${i}`} className="px-2 py-1 rounded-md bg-red-900/30 text-red-300/80 text-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-amber-800/20 bg-amber-950/10 mb-6">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <p className="text-amber-500/60">冲煞：<span className="text-amber-300">{huangli.chong}</span></p>
            <p className="text-amber-500/60">煞方：<span className="text-amber-300">{huangli.sha}</span></p>
            <p className="text-amber-500/60">喜神：<span className="text-amber-300">{huangli.xiShen}</span></p>
            <p className="text-amber-500/60">福神：<span className="text-amber-300">{huangli.fuShen}</span></p>
            <p className="text-amber-500/60">财神：<span className="text-amber-300">{huangli.caiShen}</span></p>
            <p className="text-amber-500/60">彭祖百忌：<span className="text-amber-300">{huangli.pengZu}</span></p>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-amber-800/20 bg-amber-950/10">
          <h3 className="text-amber-400 font-serif text-lg mb-4 text-center">十二时辰</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {shiChen.map((sc) => (
              <div
                key={sc.id}
                className={`p-2 rounded-lg text-center text-xs ${
                  sc.luck === "吉"
                    ? "bg-green-950/30 border border-green-900/20"
                    : sc.luck === "凶"
                    ? "bg-red-950/30 border border-red-900/20"
                    : "bg-amber-950/30 border border-amber-800/20"
                }`}
              >
                <p className="text-amber-300 font-serif">{sc.name}时</p>
                <p className="text-amber-500/40 text-[10px]">{sc.ganZhi}</p>
                <p className="text-amber-600/50">{sc.time}</p>
                <p className={`mt-1 ${
                  sc.luck === "吉" ? "text-green-400" : sc.luck === "凶" ? "text-red-400" : "text-amber-500"
                }`}>
                  {sc.luck}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
