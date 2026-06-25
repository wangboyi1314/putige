import { FeatureCard } from "@/components/FeatureCard";
import { SystemsShowcase } from "@/components/SystemsShowcase";
import { BrandName, Logo } from "@/components/SiteChrome";
import {
  CLASSIC_BOOKS,
  FEATURES,
  FOOTER_EXTRA,
  HIGHLIGHTS,
  SITE_CONFIG,
  STATS,
} from "@/lib/config";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex justify-center mb-6">
            <Logo className="size-20 sm:size-24" />
          </div>
          <BrandName size="xl" />
          <p className="mt-4 text-amber-200/80 text-base sm:text-lg tracking-wide font-serif">
            {SITE_CONFIG.tagline}
          </p>
          <p className="mt-3 text-amber-100/50 text-sm max-w-xl mx-auto leading-relaxed">
            {SITE_CONFIG.heroDesc}
          </p>

          {/* 数据亮点 */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {STATS.map((s) => (
              <div key={s.label} className="glass-panel rounded-xl py-3 px-2">
                <p className="text-amber-300 font-serif text-xl sm:text-2xl">{s.value}</p>
                <p className="text-amber-100/45 text-[10px] sm:text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="/bazi"
              className="px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 rounded-full text-sm font-medium shadow-lg shadow-amber-500/30 hover:shadow-amber-400/40 transition-shadow"
            >
              开始排盘
            </a>
            <a
              href="/lamp"
              className="px-8 py-3 glass-panel text-amber-100 rounded-full text-sm hover:border-amber-400/40 transition-colors"
            >
              点灯祈福
            </a>
            <a
              href="/naming"
              className="px-8 py-3 glass-panel text-amber-100 rounded-full text-sm hover:border-amber-400/40 transition-colors"
            >
              宝宝起名
            </a>
            <a
              href="/meditation"
              className="px-8 py-3 glass-panel text-amber-100 rounded-full text-sm hover:border-amber-400/40 transition-colors"
            >
              静心禅坐
            </a>
          </div>
        </div>
      </section>

      {/* 三大体系 */}
      <SystemsShowcase />

      {/* 功能入口 */}
      <section className="py-14 px-4 border-t border-amber-400/10">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-serif text-amber-100 tracking-widest mb-2">问事工具箱</h2>
          <p className="text-center text-amber-100/40 text-sm mb-10">择需而用 · 免费起步</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <FeatureCard key={f.id} {...f} badge={"badge" in f ? f.badge : undefined} />
            ))}
          </div>
        </div>
      </section>

      {/* 特色 */}
      <section className="py-14 px-4 border-t border-amber-400/10">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-serif text-amber-100 tracking-widest mb-8">
            为什么选 {SITE_CONFIG.name}
          </h2>
          <div className="grid md:grid-cols-3 gap-5 mb-12">
            {HIGHLIGHTS.map((h) => (
              <div key={h.title} className="glass-panel rounded-xl p-6 text-center">
                <h3 className="text-amber-300 font-serif text-lg mb-3">{h.title}</h3>
                <p className="text-amber-100/50 text-sm leading-relaxed">{h.description}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-amber-100/40 text-xs mb-4 tracking-widest">参考典籍</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {CLASSIC_BOOKS.map((b) => (
              <div
                key={b.title}
                className="aspect-[3/4] glass-panel rounded-lg flex flex-col items-center justify-center p-2 hover:border-amber-400/30 transition-colors"
              >
                <span className="text-xl mb-1 opacity-50">📖</span>
                <p className="text-amber-100/75 text-[10px] sm:text-xs font-serif text-center leading-tight">{b.title}</p>
                <p className="text-amber-400/35 text-[9px]">{b.era}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 敬香 & 分享 */}
      <section className="py-14 px-4 border-t border-amber-400/10">
        <div className="mx-auto max-w-4xl grid sm:grid-cols-2 gap-5">
          <div className="glass-panel rounded-2xl p-8 text-center">
            <h3 className="text-amber-200 font-serif text-lg mb-3">线上敬香</h3>
            <p className="text-amber-100/50 text-sm mb-5 leading-relaxed">
              三礼九炷，让心先静下来，再问事、再排盘。
            </p>
            <a href="/incense" className="inline-block px-6 py-2.5 bg-amber-700/80 text-amber-50 rounded-full text-sm">
              敬香
            </a>
          </div>
          <div className="glass-panel rounded-2xl p-8 text-center">
            <h3 className="text-amber-200 font-serif text-lg mb-3">分享给亲友</h3>
            <p className="text-amber-100/50 text-sm mb-5 leading-relaxed">
              把本站分享给家人，一起排盘、一起问事。
            </p>
            <a href="/mine" className="inline-block px-6 py-2.5 border border-amber-400/30 text-amber-200 rounded-full text-sm">
              去分享
            </a>
          </div>
        </div>
      </section>

      <section className="py-8 px-4 text-center border-t border-amber-400/10">
        <blockquote className="glass-panel max-w-lg mx-auto px-6 py-4 rounded-xl mb-4">
          <p className="text-amber-100/75 font-serif text-sm leading-loose italic">{SITE_CONFIG.verse}</p>
          <footer className="text-amber-400/45 text-xs mt-2">{SITE_CONFIG.verseSource}</footer>
        </blockquote>
        <p className="text-amber-100/35 text-xs max-w-md mx-auto">{FOOTER_EXTRA}</p>
      </section>
    </div>
  );
}
