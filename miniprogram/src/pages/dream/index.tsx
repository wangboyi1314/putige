import { useState } from "react";
import { View, Text, Input, Button } from "@tarojs/components";
import { searchDream, type DreamEntry } from "../../lib/dreams";
import { PageHero } from "../../components/PageHero";
import { MasterPicker } from "../../components/MasterPicker";
import { Paywall, InterpretBlock } from "../../components/Paywall";
import { postInterpret } from "../../services/api";
import { saveRecord } from "../../utils/storage";
import "./index.scss";

export default function DreamPage() {
  const [masterId, setMasterId] = useState("huiming");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DreamEntry[]>([]);
  const [selected, setSelected] = useState<DreamEntry | null>(null);
  const [interpretation, setInterpretation] = useState("");
  const [premiumText, setPremiumText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSearch() {
    setResults(searchDream(query));
    setSelected(null);
    setInterpretation("");
    setPremiumText("");
  }

  async function interpret(entry: DreamEntry, isPremium: boolean, orderId?: string) {
    setSelected(entry);
    if (!isPremium) {
      setPremiumText("");
      saveRecord({ type: "dream", title: `梦见${entry.keyword}`, summary: entry.brief });
    }

    setLoading(true);
    setError("");
    const res = await postInterpret({
      type: "dream",
      question: query,
      isPremium,
      orderId,
      masterId,
      data: { ...entry, userQuery: query },
    });
    setLoading(false);

    if (!res.ok) {
      setError(res.error);
      return;
    }
    if (isPremium) setPremiumText(res.interpretation);
    else setInterpretation(res.interpretation);
  }

  return (
    <View className="container">
      <PageHero title="梦境析疑" subtitle="按传统梦书检索 · 结合心境解读" />

      <View className="card">
        <MasterPicker value={masterId} onChange={setMasterId} />
        <Text className="label">梦见什么？输入关键词</Text>
        <Input
          className="search-input"
          value={query}
          onInput={(e) => setQuery(e.detail.value)}
          placeholder="蛇、水、飞、考试……"
          onConfirm={handleSearch}
        />
        <View className="mt">
          <Button className="btn-primary" onClick={handleSearch}>检索梦意</Button>
        </View>
      </View>

      {results.length > 0 ? (
        <View className="card">
          <Text className="label">匹配意象（{results.length}）</Text>
          <View className="dream-list">
            {results.slice(0, 8).map((d) => (
              <View
                key={d.keyword}
                className={`dream-item ${selected?.keyword === d.keyword ? "active" : ""}`}
                onClick={() => interpret(d, false)}
              >
                <Text className="dream-kw">{d.keyword}</Text>
                <Text className="dream-meta">{d.category} · <Text className={`luck-${d.luck}`}>{d.luck}</Text></Text>
                <Text className="dream-brief">{d.brief}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {selected && interpretation ? (
        <View className="card">
          <Text className="dream-kw">梦见{selected.keyword}</Text>
          <Text className="dream-brief">{selected.classic}</Text>
          <View className="mt">
            <Paywall
              productId="dream_premium"
              previewContent={interpretation}
              onUnlock={(orderId) => interpret(selected, true, orderId)}
            >
              <InterpretBlock content={premiumText} loading={loading} />
            </Paywall>
          </View>
        </View>
      ) : selected && loading ? (
        <View className="card">
          <Text className="hero-sub">正在解析梦境…</Text>
        </View>
      ) : null}

      {error ? <Text className="error-tip">{error}</Text> : null}
    </View>
  );
}
