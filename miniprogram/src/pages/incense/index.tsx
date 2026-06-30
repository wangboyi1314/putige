import { useState } from "react";
import { View, Text, Button } from "@tarojs/components";
import { PageHero } from "../../components/PageHero";
import "./index.scss";

export default function IncensePage() {
  const [sticks, setSticks] = useState(0);
  const [bows, setBows] = useState(0);
  const [done, setDone] = useState(false);

  function lightStick() {
    if (sticks < 9) setSticks((s) => s + 1);
  }

  function bow() {
    if (sticks === 9 && bows < 3) {
      const next = bows + 1;
      setBows(next);
      if (next === 3) setDone(true);
    }
  }

  function reset() {
    setSticks(0);
    setBows(0);
    setDone(false);
  }

  return (
    <View className="container">
      <PageHero title="敬香礼佛" subtitle="九枝敬香 · 三拜礼敬" />

      <View className="card incense-area">
        <Text className="incense-pot">🪔</Text>
        <View className="sticks-row">
          {Array.from({ length: 9 }).map((_, i) => (
            <View key={i} className={`stick ${i < sticks ? "lit" : ""}`}>
              {i < sticks ? <View className="stick-smoke" /> : null}
            </View>
          ))}
        </View>
        <Text className="bow-hint">已敬香 {sticks}/9 枝</Text>

        {!done ? (
          <>
            {sticks < 9 ? (
              <View className="mt">
                <Button className="btn-primary" onClick={lightStick}>敬上一枝香</Button>
              </View>
            ) : (
              <>
                <Text className="bow-count">礼拜 {bows}/3</Text>
                <Button className="btn-primary" onClick={bow}>虔诚一拜</Button>
              </>
            )}
          </>
        ) : (
          <>
            <Text className="done-text">礼成 · 愿心诚所至</Text>
            <View className="mt">
              <Button className="btn-ghost" onClick={reset}>重新开始</Button>
            </View>
          </>
        )}
      </View>

      <View className="card">
        <Text className="bow-hint">敬香须知：心诚为先，九枝敬香象征圆满；三拜礼敬，表虔诚恭敬之心。仅供文化体验参考。</Text>
      </View>
    </View>
  );
}
