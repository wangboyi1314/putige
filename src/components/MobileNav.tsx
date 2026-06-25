"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/", label: "首页", icon: "⌂" },
  { href: "/lamp", label: "祈福", icon: "灯" },
  { href: "/huangli", label: "黄历", icon: "历" },
  { href: "/qian", label: "灵签", icon: "籤" },
  { href: "/mine", label: "我的", icon: "我" },
];

const MORE = [
  { href: "/ziwei", label: "紫微斗数" },
  { href: "/bazi", label: "子平八字" },
  { href: "/qimen", label: "奇门遁甲" },
  { href: "/dream", label: "梦境析疑" },
  { href: "/gua", label: "六爻占卜" },
  { href: "/xiang", label: "掌纹面相" },
  { href: "/naming", label: "宝宝起名" },
  { href: "/meditation", label: "静心禅坐" },
  { href: "/incense", label: "线上敬香" },
];

export function MobileNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      {moreOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-black/50" onClick={() => setMoreOpen(false)}>
          <div
            className="absolute bottom-16 left-0 right-0 glass-panel mx-3 rounded-2xl p-4 grid grid-cols-3 gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            {MORE.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMoreOpen(false)}
                className="text-center py-2 text-amber-200/70 text-xs hover:text-amber-200"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-amber-400/15 bg-black/70 backdrop-blur-xl safe-bottom">
        <div className="flex items-center justify-around px-1 py-1.5">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg ${
                  active ? "text-amber-200" : "text-amber-400/45"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="text-[10px]">{item.label}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMoreOpen(!moreOpen)}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 ${moreOpen ? "text-amber-200" : "text-amber-400/45"}`}
          >
            <span className="text-base">☰</span>
            <span className="text-[10px]">更多</span>
          </button>
        </div>
      </nav>
    </>
  );
}
