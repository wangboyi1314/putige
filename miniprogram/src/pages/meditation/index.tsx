import { useState, useEffect, useRef } from "react";
import { View, Text, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { MEDITATION_CATALOG, formatMeditationTime } from "../../lib/meditation";
import { API_BASE } from "../../config";
import { PageHero } from "../../components/PageHero";
import "./index.scss";

export default function MeditationPage() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const audioRef = useRef<WechatMiniprogram.InnerAudioContext | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.stop();
      audioRef.current?.destroy();
    };
  }, []);

  function playTrack(id: string, url: string) {
    if (playingId === id && !paused) {
      audioRef.current?.pause();
      setPaused(true);
      return;
    }
    if (playingId === id && paused) {
      audioRef.current?.play();
      setPaused(false);
      return;
    }

    audioRef.current?.stop();
    audioRef.current?.destroy();

    const ctx = wx.createInnerAudioContext();
    ctx.src = `${API_BASE}${url}`;
    ctx.onPlay(() => {
      setPlayingId(id);
      setPaused(false);
    });
    ctx.onEnded(() => {
      setPlayingId(null);
      setPaused(false);
    });
    ctx.onError(() => {
      Taro.showToast({ title: "音频加载失败", icon: "none" });
      setPlayingId(null);
    });
    audioRef.current = ctx;
    ctx.play();
  }

  function stopAll() {
    audioRef.current?.stop();
    setPlayingId(null);
    setPaused(false);
  }

  const current = MEDITATION_CATALOG.tracks.find((t) => t.id === playingId);

  return (
    <View className="container">
      <PageHero title="静心禅坐" subtitle="梵音导引 · 息念放下" />

      <View className="card">
        <Text className="quote">「{MEDITATION_CATALOG.quote.text}」</Text>
        <Text className="quote-src">— {MEDITATION_CATALOG.quote.source}</Text>
      </View>

      {current ? (
        <View className="card">
          <Text className="now-playing">正在播放 · {current.title}</Text>
          <View className="player-bar">
            <Button className="btn-ghost" onClick={() => playTrack(current.id, current.url)}>
              {paused ? "继续" : "暂停"}
            </Button>
            <Button className="btn-ghost" onClick={stopAll}>停止</Button>
          </View>
        </View>
      ) : null}

      <View className="card">
        <Text className="section-label">静心曲目</Text>
        <View className="track-list">
          {MEDITATION_CATALOG.tracks.map((t) => (
            <View
              key={t.id}
              className={`track-item ${playingId === t.id ? "playing" : ""}`}
              onClick={() => playTrack(t.id, t.url)}
            >
              <Text className="track-icon">{t.icon}</Text>
              <View className="track-info">
                <Text className="track-title">{t.title}</Text>
                <Text className="track-sub">{t.subtitle}</Text>
              </View>
              <Text className="track-dur">{formatMeditationTime(t.duration)}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="card">
        <Text className="section-label">静坐导引</Text>
        {MEDITATION_CATALOG.guided.map((g) => (
          <View key={g.id} className="guided-item">
            <Text className="guided-title">{g.title} · {formatMeditationTime(g.duration)}</Text>
            <Text className="guided-sub track-sub">{g.subtitle}</Text>
            {g.steps.map((step, i) => (
              <Text key={i} className="guided-step">{i + 1}. {step}</Text>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}
