"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Interpretation } from "@/components/Interpretation";
import { Paywall } from "@/components/Paywall";
import { AnalysisLoading } from "@/components/AnalysisLoading";
import type { ProductId } from "@/lib/payment";

type ChartsType = "ziwei_charts" | "qimen_charts";

interface ExtendedChartsSectionProps {
  productId: ProductId;
  chartType: ChartsType;
  title: string;
  subtitle: string;
  question: string;
  masterId: string;
  data: Record<string, unknown>;
  enabled: boolean;
  resetKey?: number | string;
}

export function ExtendedChartsSection({
  productId,
  chartType,
  title,
  subtitle,
  question,
  masterId,
  data,
  enabled,
  resetKey = 0,
}: ExtendedChartsSectionProps) {
  const [preview, setPreview] = useState("");
  const [full, setFull] = useState("");
  const [loading, setLoading] = useState(false);
  const fetchedRef = useRef(false);

  useEffect(() => {
    fetchedRef.current = false;
    setPreview("");
    setFull("");
  }, [resetKey]);

  const fetchCharts = useCallback(
    async (isPremium: boolean, paidOrderId?: string) => {
      setLoading(true);
      try {
        const res = await fetch("/api/interpret", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: chartType,
            question,
            isPremium,
            orderId: paidOrderId,
            masterId,
            data,
          }),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "解读失败");
        if (isPremium) setFull(result.interpretation || "");
        else setPreview(result.interpretation || "");
      } catch (e) {
        if (!isPremium) setPreview("");
        console.error(e);
      } finally {
        setLoading(false);
      }
    },
    [chartType, question, masterId, data]
  );

  useEffect(() => {
    if (enabled && !fetchedRef.current && !loading) {
      fetchedRef.current = true;
      void fetchCharts(false);
    }
  }, [enabled, loading, fetchCharts, resetKey]);

  if (!enabled) return null;

  return (
    <div className="mt-6 glass-panel rounded-2xl p-5 ring-1 ring-amber-400/10">
      <h3 className="text-center text-amber-100 font-medium text-sm mb-1">{title}</h3>
      <p className="text-center text-amber-400/45 text-xs mb-4">{subtitle}</p>

      {preview ? (
        <Paywall
          productId={productId}
          previewContent={preview}
          onUnlock={(orderId) => fetchCharts(true, orderId)}
        >
          <Interpretation content={full} loading={loading} />
        </Paywall>
      ) : (
        <AnalysisLoading productId={productId} label="正在生成专项盘预览…" />
      )}
    </div>
  );
}
