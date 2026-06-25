"use client";

import { useState } from "react";

export default function IncensePage() {
  const [bow, setBow] = useState(0);
  const [sticks, setSticks] = useState(0);
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);

  const totalSticks = 9;
  const totalBows = 3;

  function addStick() {
    if (sticks >= totalSticks) return;
    const next = sticks + 1;
    setSticks(next);
    if (next % 3 === 0) {
      const nextBow = Math.min(bow + 1, totalBows);
      setBow(nextBow);
      if (nextBow === totalBows && next === totalSticks) {
        setDone(true);
        setMessage("三礼九炷已毕，心念安放，福慧增长。");
      }
    }
  }

  function reset() {
    setBow(0);
    setSticks(0);
    setDone(false);
    setMessage("");
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-3xl font-serif text-amber-200 tracking-widest mb-2">线上敬香</h1>
        <p className="text-amber-200/50 text-sm mb-2">每日三礼 · 每礼三炷</p>
        <p className="text-amber-300/40 text-xs mb-10">静心九炷，为自己、为家人、为众生</p>

        <div className="text-7xl mb-6 animate-float">🪷</div>

        <div className="glass-panel rounded-2xl p-8 mb-6">
          <div className="flex justify-center gap-3 mb-6">
            {Array.from({ length: totalSticks }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-12 rounded-full transition-all duration-500 ${
                  i < sticks
                    ? "bg-gradient-to-t from-amber-700 to-amber-300 shadow-sm shadow-amber-400/30"
                    : "bg-amber-900/30"
                }`}
              />
            ))}
          </div>

          <p className="text-amber-300/70 text-sm mb-1">
            已敬香 {sticks} / {totalSticks} 炷 · 礼拜 {bow} / {totalBows} 礼
          </p>

          {message && (
            <p className="text-amber-200 font-serif text-base mt-4 leading-relaxed">{message}</p>
          )}

          {!done ? (
            <button
              onClick={addStick}
              className="mt-6 px-8 py-3 bg-gradient-to-r from-amber-700 to-amber-600 text-amber-50 rounded-full hover:from-amber-600 hover:to-amber-500 transition-all"
            >
              敬上一炷清香
            </button>
          ) : (
            <button
              onClick={reset}
              className="mt-6 px-6 py-2 border border-amber-400/30 text-amber-300/70 rounded-full text-sm hover:bg-amber-400/10 transition-all"
            >
              明日再来
            </button>
          )}
        </div>

        <p className="text-amber-400/35 text-xs leading-relaxed max-w-sm mx-auto">
          一炷心香，不必外求。敬的是一份清净心，求的是片刻安宁。
        </p>
      </div>
    </div>
  );
}
