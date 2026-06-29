"use client";

import type { GuardErrorDetail } from "@/lib/interpret-api";

interface GuardNoticeProps {
  detail: GuardErrorDetail | null;
  onDismiss?: () => void;
  className?: string;
}

function formatWait(seconds?: number): string | null {
  if (!seconds || seconds <= 0) return null;
  if (seconds < 60) return `约 ${seconds} 秒后可重试`;
  const m = Math.ceil(seconds / 60);
  return m < 60 ? `约 ${m} 分钟后可重试` : `约 ${Math.ceil(m / 60)} 小时后可重试`;
}

export function GuardNotice({ detail, onDismiss, className = "" }: GuardNoticeProps) {
  if (!detail) return null;

  const wait = formatWait(detail.retryAfter);
  const isAbuse = detail.code === "abuse_detected" || detail.code === "bot_blocked";

  return (
    <div
      className={`rounded-xl border p-4 ${
        isAbuse
          ? "border-amber-500/30 bg-amber-950/40"
          : "border-amber-400/25 bg-amber-950/30"
      } ${className}`}
      role="alert"
    >
      <p className="text-amber-100 text-sm font-medium mb-1">
        {isAbuse ? "🛡️ 安全提示" : "⏳ 请稍候"}
      </p>
      <p className="text-amber-200/90 text-sm leading-relaxed">{detail.message}</p>
      {wait && (
        <p className="text-amber-400/70 text-xs mt-2">{wait}</p>
      )}
      {detail.tip && (
        <p className="text-amber-400/55 text-xs mt-2 leading-relaxed border-t border-amber-400/10 pt-2">
          💡 {detail.tip}
        </p>
      )}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="mt-3 text-xs text-amber-400/60 hover:text-amber-300/80 underline"
        >
          知道了
        </button>
      )}
    </div>
  );
}
