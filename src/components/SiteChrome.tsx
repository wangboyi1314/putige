import Image from "next/image";
import { SITE_CONFIG } from "@/lib/config";

/** 菩提阁 Logo：莲台 + 佛光 + 阁字 */
export function Logo({ className = "size-10", showText = false }: { className?: string; showText?: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${showText ? "" : ""}`}>
      <svg
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 drop-shadow-[0_0_12px_rgba(255,200,80,0.5)] ${className}`}
      >
        {/* 外圈佛光 */}
        <circle cx="40" cy="40" r="36" stroke="url(#goldGrad)" strokeWidth="1.2" opacity="0.6" />
        <circle cx="40" cy="40" r="28" stroke="url(#goldGrad)" strokeWidth="0.8" opacity="0.35" />
        {/* 光芒 */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <line
            key={deg}
            x1="40"
            y1="40"
            x2={40 + 34 * Math.cos((deg * Math.PI) / 180)}
            y2={40 + 34 * Math.sin((deg * Math.PI) / 180)}
            stroke="url(#goldGrad)"
            strokeWidth="0.6"
            opacity="0.25"
          />
        ))}
        {/* 莲瓣 */}
        {[0, 72, 144, 216, 288].map((deg, i) => (
          <ellipse
            key={i}
            cx="40"
            cy="52"
            rx="8"
            ry="14"
            fill="url(#goldGrad)"
            opacity="0.35"
            transform={`rotate(${deg - 90} 40 52)`}
          />
        ))}
        {/* 莲台 */}
        <ellipse cx="40" cy="58" rx="18" ry="5" fill="url(#goldGrad)" opacity="0.5" />
        {/* 阁字简化 */}
        <text
          x="40"
          y="46"
          textAnchor="middle"
          fill="url(#goldGrad)"
          fontSize="22"
          fontFamily="serif"
          fontWeight="600"
        >
          阁
        </text>
        <defs>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffe9a8" />
            <stop offset="50%" stopColor="#f0c14a" />
            <stop offset="100%" stopColor="#b8860b" />
          </linearGradient>
        </defs>
      </svg>
      {showText && <BrandName size="lg" />}
    </div>
  );
}

export function SiteBackground() {
  return (
    <>
      {/* 用户佛光背景图 */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/buddha-bg.png"
          alt=""
          fill
          priority
          className="object-cover object-top"
          sizes="100vw"
        />
      </div>
      {/* 暗色遮罩保证文字可读 */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/55 via-black/70 to-black/85" />
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 15%, rgba(255,200,80,0.12) 0%, transparent 55%), radial-gradient(ellipse 100% 80% at 50% 100%, rgba(0,0,0,0.5) 0%, transparent 50%)",
        }}
      />
      {/* 底部内容区加深 */}
      <div className="fixed inset-x-0 bottom-0 z-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
    </>
  );
}

export function PageHero({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl sm:text-4xl font-serif text-amber-100 tracking-widest mb-3 drop-shadow-lg">{title}</h1>
      {subtitle && (
        <p className="mx-auto max-w-lg text-amber-100/65 text-sm leading-relaxed drop-shadow">{subtitle}</p>
      )}
      {children}
    </div>
  );
}

export function BrandName({ size = "lg" }: { size?: "sm" | "lg" | "xl" }) {
  const cls =
    size === "xl"
      ? "text-3xl sm:text-4xl"
      : size === "lg"
      ? "text-[1.35rem] md:text-[1.6rem]"
      : "text-base";
  return (
    <span
      className={`${cls} font-serif tracking-[0.15em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]`}
      style={{
        background: "linear-gradient(180deg, #fff8e0 0%, #ffd700 40%, #c9a05c 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {SITE_CONFIG.name}
    </span>
  );
}
