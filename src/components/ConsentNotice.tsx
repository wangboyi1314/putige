import Link from "next/link";
import { LEGAL_LINKS } from "@/lib/config";

export function ConsentNotice({ topic }: { topic: string }) {
  return (
    <p className="text-amber-400/35 text-[11px] leading-relaxed text-center mt-4">
      点击开始即表示您已阅读并同意
      {LEGAL_LINKS.map((l, i) => (
        <span key={l.href}>
          {i > 0 && "、"}
          <Link href={l.href} className="text-amber-400/50 hover:text-amber-300/70 underline-offset-2 hover:underline">
            {l.label}
          </Link>
        </span>
      ))}
      ，并同意我们按说明处理您主动提交的{topic}。仅作传统文化参考，请结合现实情况判断；未满18周岁请勿使用本服务，请勿提交他人的照片、生辰或其他信息。
    </p>
  );
}
