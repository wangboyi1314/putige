import Link from "next/link";
import { BrandName, Logo } from "@/components/SiteChrome";

const NAV = [
  { href: "/ziwei", label: "紫微" },
  { href: "/bazi", label: "八字" },
  { href: "/qimen", label: "奇门" },
  { href: "/lamp", label: "祈福" },
  { href: "/huangli", label: "黄历" },
  { href: "/qian", label: "灵签" },
  { href: "/gua", label: "六爻" },
  { href: "/dream", label: "解梦" },
  { href: "/naming", label: "宝宝起名" },
  { href: "/meditation", label: "静心禅坐" },
  { href: "/mine", label: "我的" },
];

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-amber-400/15 bg-black/50 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Logo className="size-9" />
          <BrandName size="sm" />
        </Link>
        <nav className="hidden lg:flex items-center gap-4">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs text-amber-200/60 hover:text-amber-300 transition-colors whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
