import { DIVINATION_SYSTEMS } from "@/lib/config";
import Link from "next/link";

export function SystemsShowcase() {
  return (
    <section className="py-14 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <p className="text-amber-300/50 text-xs tracking-[0.3em] mb-2">CORE SYSTEMS</p>
          <h2 className="text-2xl sm:text-3xl font-serif text-amber-100 tracking-widest mb-3">
            三大命理体系 · 交叉验证
          </h2>
          <p className="text-amber-100/55 text-sm max-w-2xl mx-auto leading-relaxed">
            内置紫微斗数、子平八字、奇门遁甲，250+ 定制化命盘工具。
            同一问题可用多体系推演，互相印证，算得更准。
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {DIVINATION_SYSTEMS.map((sys) => (
            <Link
              key={sys.id}
              href={sys.href}
              className={`group glass-panel-heavy rounded-2xl p-6 bg-gradient-to-br ${sys.color} hover:border-amber-400/40 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-900/20`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-serif text-amber-300/90">{sys.icon}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full border border-amber-400/25 text-amber-300/70">
                  {sys.tools}
                </span>
              </div>
              <h3 className="text-xl font-serif text-amber-100 mb-2">{sys.name}</h3>
              <p className="text-amber-100/55 text-sm leading-relaxed mb-4">{sys.description}</p>
              <span className="text-amber-400/70 text-xs group-hover:text-amber-300 transition-colors">
                进入排盘 →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8 glass-panel rounded-xl p-5 text-center">
          <p className="text-amber-200/70 text-sm leading-relaxed">
            <span className="text-amber-300 font-serif">交叉验证示例：</span>
            子平八字定五行喜忌 → 紫微斗数看宫位格局 → 奇门遁甲选时机方位，三系结论一致则信心更足，分歧处则提示多角度看。
          </p>
        </div>
      </div>
    </section>
  );
}
