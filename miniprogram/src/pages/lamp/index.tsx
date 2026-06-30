import { useState, useEffect } from "react";
import { View, Text, Input, Button } from "@tarojs/components";
import { LAMP_TYPES, LAMP_DURATIONS, RELATIONS } from "../../config";
import { PageHero } from "../../components/PageHero";
import { saveRecord } from "../../utils/storage";
import "./index.scss";

const LAMP_KEY = "bodhi_mp_lamps";

interface LampWish {
  id: string;
  forName: string;
  relation: string;
  lampType: string;
  duration: string;
  wish: string;
  donorName: string;
  createdAt: string;
}

function getLamps(): LampWish[] {
  try {
    const raw = wx.getStorageSync(LAMP_KEY);
    return Array.isArray(raw) ? (raw as LampWish[]) : [];
  } catch {
    return [];
  }
}

export default function LampPage() {
  const [forName, setForName] = useState("");
  const [relation, setRelation] = useState(RELATIONS[0]);
  const [lampType, setLampType] = useState(LAMP_TYPES[0].id);
  const [duration, setDuration] = useState(LAMP_DURATIONS[1].id);
  const [wish, setWish] = useState("");
  const [donorName, setDonorName] = useState("");
  const [lamps, setLamps] = useState<LampWish[]>([]);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    setLamps(getLamps());
  }, []);

  function lightLamp() {
    if (!forName.trim()) return;
    const entry: LampWish = {
      id: `lamp_${Date.now()}`,
      forName: forName.trim(),
      relation,
      lampType,
      duration,
      wish: wish.trim(),
      donorName: donorName.trim(),
      createdAt: new Date().toISOString(),
    };
    const updated = [entry, ...lamps].slice(0, 100);
    wx.setStorageSync(LAMP_KEY, updated);
    setLamps(updated);
    setLit(true);
    const typeName = LAMP_TYPES.find((l) => l.id === lampType)?.name ?? "明灯";
    saveRecord({
      type: "lamp",
      title: `供灯 · ${forName}`,
      summary: wish || typeName,
    });
  }

  const selectedLamp = LAMP_TYPES.find((l) => l.id === lampType);

  return (
    <View className="container">
      <PageHero title="心愿明灯" subtitle="写愿 · 点灯 · 留念" />

      {lit ? (
        <View className="card lit-area">
          <Text className="lit-emoji">{selectedLamp?.emoji ?? "🪔"}</Text>
          <Text className="lit-text">已为 {forName} 点亮{selectedLamp?.name}</Text>
          <Text className="hero-sub">{wish || "愿平安喜乐，诸事顺遂"}</Text>
          <View className="mt">
            <Button className="btn-ghost" onClick={() => setLit(false)}>再点一盏</Button>
          </View>
        </View>
      ) : (
        <View className="card">
          <Text className="label">为谁点灯</Text>
          <Input className="input" value={forName} onInput={(e) => setForName(e.detail.value)} placeholder="姓名或称呼" />
          <Text className="label">关系</Text>
          <View className="chip-row">
            {RELATIONS.map((r) => (
              <View key={r} className={`chip ${relation === r ? "active" : ""}`} onClick={() => setRelation(r)}>
                <Text>{r}</Text>
              </View>
            ))}
          </View>
          <Text className="label">选一盏灯</Text>
          <View className="lamp-grid">
            {LAMP_TYPES.map((l) => (
              <View key={l.id} className={`lamp-type ${lampType === l.id ? "active" : ""}`} onClick={() => setLampType(l.id)}>
                <Text className="lamp-emoji">{l.emoji}</Text>
                <Text>{l.name}</Text>
              </View>
            ))}
          </View>
          <Text className="label">供奉时长</Text>
          <View className="chip-row">
            {LAMP_DURATIONS.map((d) => (
              <View key={d.id} className={`chip ${duration === d.id ? "active" : ""}`} onClick={() => setDuration(d.id)}>
                <Text>{d.label}</Text>
              </View>
            ))}
          </View>
          <Text className="label">心愿</Text>
          <Input className="input" value={wish} onInput={(e) => setWish(e.detail.value)} placeholder="写下您的心愿" />
          <Text className="label">点灯人（可选）</Text>
          <Input className="input" value={donorName} onInput={(e) => setDonorName(e.detail.value)} placeholder="您的称呼" />
          <View className="mt">
            <Button className="btn-primary" disabled={!forName.trim()} onClick={lightLamp}>点亮明灯</Button>
          </View>
        </View>
      )}

      {lamps.length > 0 ? (
        <View className="card">
          <Text className="label">近期供灯（{lamps.length}）</Text>
          {lamps.slice(0, 5).map((l) => {
            const lt = LAMP_TYPES.find((t) => t.id === l.lampType);
            return (
              <View key={l.id} className="history-item">
                <Text className="history-title">{lt?.emoji} {l.forName} · {lt?.name}</Text>
                <Text className="history-meta">{l.relation} · {l.wish || "平安"}</Text>
              </View>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}
