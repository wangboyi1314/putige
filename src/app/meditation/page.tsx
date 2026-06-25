"use client";

import { useEffect, useState } from "react";
import { useMeditationPlayer } from "@/components/MeditationPlayerProvider";
import {
  formatMeditationTime,
  MEDITATION_CATALOG,
  type MeditationTrack,
} from "@/lib/meditation";

function TrackCard({
  track,
  active,
  playing,
  onSelect,
}: {
  track: MeditationTrack;
  active: boolean;
  playing: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all w-full ${
        active
          ? "border-amber-400/50 bg-amber-400/10"
          : "glass-panel hover:border-amber-400/30"
      }`}
    >
      <span
        className={`flex size-12 shrink-0 items-center justify-center rounded-full border border-amber-400/25 bg-black/30 text-2xl ${
          active && playing ? "animate-spin-slow" : ""
        }`}
      >
        {track.icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="truncate font-serif text-base text-amber-100">{track.title}</p>
        <p className="truncate text-xs text-amber-100/55">{track.subtitle}</p>
        <p className="text-[10px] text-amber-400/40 mt-0.5">
          {formatMeditationTime(track.duration)} · {track.license}
        </p>
      </div>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-amber-400/25 text-amber-300 text-sm">
        {active && playing ? "⏸" : "▶"}
      </span>
    </button>
  );
}

export default function MeditationPage() {
  const catalog = MEDITATION_CATALOG;
  const player = useMeditationPlayer();
  const [meritTick, setMeritTick] = useState(0);
  const [completeMsg, setCompleteMsg] = useState<number | null>(null);
  const [showLotus, setShowLotus] = useState(false);

  useEffect(() => {
    if (!player.playing) return;
    const id = window.setInterval(() => setMeritTick((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, [player.playing]);

  useEffect(() => {
    catalog.tracks.forEach((t) => {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.as = "audio";
      link.href = t.url;
      document.head.appendChild(link);
    });
  }, [catalog.tracks]);

  const liveMerit = player.getLiveMerit();
  void meritTick;

  const track = player.track;
  const totalDuration = player.duration || track?.duration || 0;
  const progress = totalDuration > 0 ? Math.min(1, player.elapsed / totalDuration) : 0;

  function handleComplete() {
    const seconds = Math.round(player.flushMerit());
    if (seconds < 30) {
      setCompleteMsg(0);
      return;
    }
    const added = Math.max(1, Math.floor(seconds / 60));
    setCompleteMsg(added);
    setShowLotus(true);
    player.resetMerit();
    window.setTimeout(() => setShowLotus(false), 3500);
  }

  return (
    <div className="py-8 px-4 pb-24">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Hero */}
        <section className="space-y-3 pt-2 text-center">
          <div className="relative mx-auto size-24">
            <div
              className="absolute inset-0 rounded-full bg-amber-400/15 blur-xl animate-halo-pulse"
              style={{ animation: player.playing ? undefined : "none" }}
            />
            <div
              className={`relative flex size-24 items-center justify-center rounded-full border border-amber-400/40 bg-amber-400/10 text-5xl ${
                player.playing ? "animate-spin-slow" : ""
              }`}
            >
              🪷
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-amber-100 tracking-widest">静心禅坐</h1>
          <p className="text-sm sm:text-base text-amber-100/65 leading-relaxed">
            收心静坐 · 听音调息 · 日日如是
          </p>
          <div className="mx-auto max-w-md glass-panel rounded-xl px-4 py-3">
            <p className="font-serif text-amber-100/85">「{catalog.quote.text}」</p>
            <p className="mt-1 text-xs text-amber-400/45">— {catalog.quote.source}</p>
          </div>
        </section>

        {/* Now playing */}
        {track && (
          <section className="glass-panel-heavy rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div
                className="flex size-16 sm:size-20 shrink-0 items-center justify-center rounded-full border-2 border-amber-400/40 bg-gradient-to-br from-amber-400/15 to-orange-900/10 text-3xl sm:text-4xl"
                style={{
                  animation: player.playing ? "spin-slow 18s linear infinite" : "none",
                  boxShadow: player.playing
                    ? "0 0 24px rgba(255,200,80,0.35)"
                    : "0 0 12px rgba(255,200,80,0.15)",
                }}
              >
                {track.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate font-serif text-lg sm:text-xl text-amber-100">{track.title}</p>
                <p className="truncate text-sm text-amber-100/55">{track.subtitle}</p>
                <p className="mt-1 font-mono text-xs text-amber-400/60">
                  {formatMeditationTime(player.elapsed)} / {formatMeditationTime(totalDuration)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => player.toggle()}
                aria-label={player.playing ? "暂停" : "播放"}
                className="flex size-12 sm:size-14 shrink-0 items-center justify-center rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-200 text-lg hover:bg-amber-400/20"
              >
                {player.playing ? "⏸" : "▶"}
              </button>
              <button
                type="button"
                onClick={() => player.setMuted(!player.muted)}
                aria-label={player.muted ? "取消静音" : "静音"}
                className="flex size-10 shrink-0 items-center justify-center rounded-full border border-amber-400/25 text-amber-300/80 hover:bg-amber-400/10"
              >
                {player.muted ? "🔇" : "🔊"}
              </button>
            </div>

            <button
              type="button"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const ratio = (e.clientX - rect.left) / rect.width;
                player.seekTo(ratio);
              }}
              className="group relative h-2.5 w-full overflow-hidden rounded-full bg-black/40"
            >
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-200"
                style={{ width: `${progress * 100}%` }}
              />
              <div
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 size-3 rounded-full bg-amber-300 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${progress * 100}%` }}
              />
            </button>

            <div className="flex items-center gap-2 text-xs text-amber-400/50">
              <span>🔊</span>
              <input
                type="range"
                min={0}
                max={100}
                value={player.muted ? 0 : player.volume * 100}
                onChange={(e) => player.setVolume(Number(e.target.value) / 100)}
                className="flex-1 accent-amber-500"
              />
              <span className="w-8 font-mono">{Math.round((player.muted ? 0 : player.volume) * 100)}</span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-amber-400/50">
                本次静坐 {Math.floor(liveMerit / 60)} 分 {Math.floor(liveMerit % 60)} 秒
              </p>
              <button
                type="button"
                onClick={handleComplete}
                className="rounded-full border border-orange-400/40 bg-orange-900/20 px-4 py-1.5 text-sm text-orange-200 hover:bg-orange-900/35"
              >
                结束本次静坐
              </button>
            </div>

            {completeMsg !== null && (
              <div
                className={`rounded-lg border px-4 py-3 text-center text-sm ${
                  completeMsg > 0
                    ? "border-emerald-500/40 bg-emerald-900/15 text-emerald-300"
                    : "border-amber-400/15 bg-black/30 text-amber-100/55"
                }`}
              >
                {completeMsg > 0 ? (
                  <p>本次静坐圆满，已记录 {completeMsg} 分钟</p>
                ) : (
                  <p>静坐不足 30 秒，下次再专注一些～</p>
                )}
              </div>
            )}
          </section>
        )}

        {/* Track library */}
        <section className="glass-panel rounded-2xl p-5 sm:p-6 space-y-3">
          <h2 className="font-serif text-xl text-amber-100">静心曲库</h2>
          <p className="text-xs text-amber-400/40">
            精选 10 首静坐音乐 · 切换页面可继续播放
          </p>
          <div className="grid gap-2 md:grid-cols-2">
            {catalog.tracks.map((t) => (
              <TrackCard
                key={t.id}
                track={t}
                active={track?.id === t.id}
                playing={player.playing && track?.id === t.id}
                onSelect={() =>
                  player.play({
                    id: t.id,
                    title: t.title,
                    subtitle: t.subtitle,
                    duration: t.duration,
                    icon: t.icon,
                    url: t.url,
                  })
                }
              />
            ))}
          </div>
        </section>

        {/* Guided sessions */}
        <section className="glass-panel rounded-2xl p-5 sm:p-6 space-y-3">
          <h2 className="font-serif text-xl text-amber-100">静坐导引</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {catalog.guided.map((g) => (
              <div
                key={g.id}
                className="rounded-xl border border-amber-400/15 bg-black/25 p-4"
              >
                <p className="font-serif text-lg text-amber-200">{g.title}</p>
                <p className="mt-1 text-xs text-amber-100/50">{g.subtitle}</p>
                <span className="inline-block mt-2 px-2 py-0.5 rounded-full border border-amber-400/25 text-[10px] text-amber-400/70">
                  {Math.floor(g.duration / 60)} 分钟
                </span>
                <ol className="mt-3 space-y-1.5 text-sm text-amber-100/60">
                  {g.steps.map((step, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="shrink-0 text-amber-400/70">{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>
      </div>

      {showLotus && (
        <div className="pointer-events-none fixed inset-0 z-[200] flex items-center justify-center">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <span
              key={i}
              className="absolute text-5xl animate-lotus-rise"
              style={{
                left: `${20 + 8 * i}%`,
                bottom: 0,
                animationDelay: `${0.15 * i}s`,
              }}
            >
              🪷
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
