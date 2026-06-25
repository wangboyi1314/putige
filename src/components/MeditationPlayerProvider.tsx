"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export interface PlayerTrack {
  id: string;
  title: string;
  subtitle: string;
  duration: number;
  icon: string;
  url: string;
}

interface MeditationPlayerContextValue {
  track: PlayerTrack | null;
  playing: boolean;
  muted: boolean;
  volume: number;
  elapsed: number;
  duration: number;
  play: (track: PlayerTrack) => void;
  toggle: () => void;
  stop: () => void;
  setMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
  seekTo: (ratio: number) => void;
  resetMerit: () => void;
  flushMerit: () => number;
  getLiveMerit: () => number;
}

const MeditationPlayerContext = createContext<MeditationPlayerContextValue | null>(null);

const defaultValue: MeditationPlayerContextValue = {
  track: null,
  playing: false,
  muted: false,
  volume: 0.7,
  elapsed: 0,
  duration: 0,
  play: () => {},
  toggle: () => {},
  stop: () => {},
  setMuted: () => {},
  setVolume: () => {},
  seekTo: () => {},
  resetMerit: () => {},
  flushMerit: () => 0,
  getLiveMerit: () => 0,
};

export function useMeditationPlayer() {
  return useContext(MeditationPlayerContext) ?? defaultValue;
}

export function MeditationPlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const meritStartRef = useRef<number | null>(null);

  const [track, setTrack] = useState<PlayerTrack | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMutedState] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [meritSeconds, setMeritSeconds] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = muted ? 0 : volume;
  }, [muted, volume]);

  const play = useCallback(
    (next: PlayerTrack) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (track?.id === next.id) {
        if (playing) audio.pause();
        else audio.play().catch(() => {});
        return;
      }

      setTrack(next);
      setElapsed(0);
      setDuration(next.duration);
      audio.src = next.url;
      audio.volume = muted ? 0 : volume;
      audio.play().catch(() => {});
    },
    [track, playing, muted, volume]
  );

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !track) return;
    if (playing) audio.pause();
    else audio.play().catch(() => {});
  }, [playing, track]);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setTrack(null);
    setPlaying(false);
    setElapsed(0);
    setDuration(0);
  }, []);

  const setMuted = useCallback((value: boolean) => {
    setMutedState(value);
  }, []);

  const setVolume = useCallback((value: number) => {
    const v = Math.max(0, Math.min(1, value));
    setVolumeState(v);
    if (v > 0) setMutedState(false);
  }, []);

  const seekTo = useCallback(
    (ratio: number) => {
      const audio = audioRef.current;
      if (!audio || !track) return;
      const total = audio.duration || track.duration;
      const next = total * Math.max(0, Math.min(1, ratio));
      audio.currentTime = next;
      setElapsed(next);
    },
    [track]
  );

  const resetMerit = useCallback(() => {
    setMeritSeconds(0);
    meritStartRef.current = playing ? Date.now() : null;
  }, [playing]);

  const flushMerit = useCallback(() => {
    let total = meritSeconds;
    const start = meritStartRef.current;
    if (start !== null) {
      const delta = (Date.now() - start) / 1000;
      if (delta >= 0 && delta < 86400) total += delta;
      meritStartRef.current = playing ? Date.now() : null;
      setMeritSeconds(total);
    }
    return total;
  }, [meritSeconds, playing]);

  const getLiveMerit = useCallback(() => {
    let total = meritSeconds;
    const start = meritStartRef.current;
    if (start !== null) {
      const delta = (Date.now() - start) / 1000;
      if (delta >= 0 && delta < 86400) total += delta;
    }
    return total;
  }, [meritSeconds]);

  const value = useMemo(
    () => ({
      track,
      playing,
      muted,
      volume,
      elapsed,
      duration,
      play,
      toggle,
      stop,
      setMuted,
      setVolume,
      seekTo,
      resetMerit,
      flushMerit,
      getLiveMerit,
    }),
    [
      track,
      playing,
      muted,
      volume,
      elapsed,
      duration,
      play,
      toggle,
      stop,
      setMuted,
      setVolume,
      seekTo,
      resetMerit,
      flushMerit,
      getLiveMerit,
    ]
  );

  return (
    <MeditationPlayerContext.Provider value={value}>
      <audio
        ref={audioRef}
        preload="auto"
        onPlay={() => {
          setPlaying(true);
          meritStartRef.current = Date.now();
        }}
        onPause={() => {
          setPlaying(false);
          const start = meritStartRef.current;
          if (start !== null) {
            meritStartRef.current = null;
            setMeritSeconds((prev) => prev + (Date.now() - start) / 1000);
          }
        }}
        onEnded={() => {
          setPlaying(false);
          const start = meritStartRef.current;
          if (start !== null) {
            meritStartRef.current = null;
            setMeritSeconds((prev) => prev + (Date.now() - start) / 1000);
          }
        }}
        onTimeUpdate={(e) => setElapsed(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />
      {children}
    </MeditationPlayerContext.Provider>
  );
}
