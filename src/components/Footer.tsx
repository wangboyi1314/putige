import Link from "next/link";
import { FOOTER_VERSES, FOOTER_EXTRA, LEGAL_LINKS, SITE_CONFIG } from "@/lib/config";

export function Footer() {
  return (
    <footer className="border-t border-amber-400/10 bg-black/60 backdrop-blur-xl pb-24 md:pb-10">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* 三行偈语 */}
        <div className="space-y-4 mb-10 text-center">
          {FOOTER_VERSES.map((verse) => (
            <p
              key={verse}
              className="text-amber-200/55 font-serif text-sm sm:text-base leading-relaxed tracking-wider"
            >
              {verse}
            </p>
          ))}
        </div>

        {/* 法律链接 */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8">
          {LEGAL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-amber-300/60 text-sm hover:text-amber-200 transition-colors underline-offset-4 hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* 免责声明 */}
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <p className="text-amber-400/40 text-xs leading-relaxed">
            {SITE_CONFIG.disclaimer}
          </p>
          <p className="text-amber-400/35 text-xs leading-relaxed">
            {SITE_CONFIG.ageNotice}
          </p>
          <p className="text-amber-300/45 text-sm font-serif tracking-widest pt-2">
            {SITE_CONFIG.name} · {SITE_CONFIG.footerTagline}
          </p>
          <p className="text-amber-400/30 text-xs mt-3 max-w-lg mx-auto leading-relaxed">{FOOTER_EXTRA}</p>
          <p className="text-amber-500/25 text-xs">
            © {new Date().getFullYear()} {SITE_CONFIG.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
