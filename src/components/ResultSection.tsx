"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ResultSectionProps {
  active: boolean;
  scrollKey?: string | number;
  banner?: string;
  children: ReactNode;
}

/** 结果区容器：出现时自动滚入视野，并显示引导条 */
export function ResultSection({ active, scrollKey, banner, children }: ResultSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !ref.current) return;
    const timer = window.setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
    return () => window.clearTimeout(timer);
  }, [active, scrollKey]);

  if (!active) return null;

  return (
    <div ref={ref} className="space-y-6 scroll-mt-20">
      {banner && (
        <div
          role="status"
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-amber-400/30 bg-amber-400/8 text-amber-200/90 text-sm"
        >
          <span className="text-amber-400 animate-bounce" aria-hidden>
            ↓
          </span>
          <span>{banner}</span>
        </div>
      )}
      {children}
    </div>
  );
}
