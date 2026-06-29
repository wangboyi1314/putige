import { PRODUCTS, type ProductId } from "@/lib/payment";

interface AnalysisLoadingProps {
  productId: ProductId;
  label: string;
}

/** 解读生成中的醒目等待态，避免用户以为页面空白 */
export function AnalysisLoading({ productId, label }: AnalysisLoadingProps) {
  const product = PRODUCTS[productId];

  return (
    <div className="p-8 rounded-xl border border-amber-500/35 bg-gradient-to-b from-amber-950/50 to-amber-950/15 text-center shadow-inner shadow-amber-900/20">
      <div
        className="inline-block size-11 border-2 border-amber-400/25 border-t-amber-400 rounded-full animate-spin mb-5"
        aria-hidden
      />
      <p className="text-amber-100 font-medium text-base">{label}</p>
      <p className="text-amber-500/65 text-xs mt-2">约需 10～30 秒，请勿关闭或离开页面</p>
      <p className="text-amber-400/55 text-xs mt-5 pt-4 border-t border-amber-800/35 leading-relaxed">
        解读完成后将出现
        <span className="text-amber-300">「解锁完整详批 ¥{product.price}」</span>
        按钮，点击即可扫码支付
      </p>
    </div>
  );
}
