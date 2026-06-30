import { useState } from "react";
import { View, Text, Input, Button } from "@tarojs/components";
import { calculateBaZi } from "../../lib/bazi";
import { BirthDateForm, GenderPicker } from "../../components/BirthDateForm";
import { PageHero } from "../../components/PageHero";
import { MasterPicker } from "../../components/MasterPicker";
import { Paywall, InterpretBlock } from "../../components/Paywall";
import { postInterpret } from "../../services/api";
import { saveRecord } from "../../utils/storage";
import "./index.scss";

const STYLES = ["古典", "诗意", "大气", "温婉", "阳刚", "清雅"];

export default function NamingPage() {
  const [masterId, setMasterId] = useState("huiming");
  const [birth, setBirth] = useState({ year: 2025, month: 1, day: 1, hour: 12, isLeapMonth: false });
  const [gender, setGender] = useState<"男" | "女">("男");
  const [surname, setSurname] = useState("");
  const [givenName, setGivenName] = useState("");
  const [styles, setStyles] = useState<string[]>(["古典"]);
  const [mode, setMode] = useState<"naming" | "eval">("naming");
  const [interpretation, setInterpretation] = useState("");
  const [premiumText, setPremiumText] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState("");

  function toggleStyle(s: string) {
    setStyles((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : prev.length < 3 ? [...prev, s] : prev
    );
  }

  async function run(isPremium: boolean, orderId?: string) {
    if (!surname.trim()) {
      setError("请填写姓氏");
      return;
    }
    if (mode === "eval" && !givenName.trim()) {
      setError("请填写要测评的名字");
      return;
    }

    const chart = calculateBaZi({
      year: birth.year,
      month: birth.month,
      day: birth.day,
      hour: birth.hour,
      calendarType: "lunar",
      isLeapMonth: birth.isLeapMonth,
    });

    if (!isPremium) {
      setStarted(true);
      setPremiumText("");
      saveRecord({
        type: "naming",
        title: mode === "naming" ? `起名 · ${surname}` : `测名 · ${surname}${givenName}`,
        summary: chart.inputLabel,
      });
    }

    setLoading(true);
    setError("");
    const res = await postInterpret({
      type: "naming",
      question: mode === "naming" ? `为${gender}孩取名，姓氏${surname}` : `测评名字${surname}${givenName}`,
      isPremium,
      orderId,
      masterId,
      data: {
        mode,
        surname,
        givenName: mode === "eval" ? givenName : undefined,
        gender,
        styles,
        bazi: chart,
      },
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
      <PageHero title="宝宝起名" subtitle="八字喜忌 · 音韵寓意 · 典故出处" />

      <View className="card">
        <MasterPicker value={masterId} onChange={setMasterId} />
        <View className="mode-row">
          <View className={`mode-chip ${mode === "naming" ? "active" : ""}`} onClick={() => setMode("naming")}>
            <Text>取名</Text>
          </View>
          <View className={`mode-chip ${mode === "eval" ? "active" : ""}`} onClick={() => setMode("eval")}>
            <Text>测名</Text>
          </View>
        </View>
        <Text className="label">姓氏</Text>
        <Input className="input" value={surname} onInput={(e) => setSurname(e.detail.value)} placeholder="张" />
        {mode === "eval" ? (
          <>
            <Text className="label">名字</Text>
            <Input className="input" value={givenName} onInput={(e) => setGivenName(e.detail.value)} placeholder="子涵" />
          </>
        ) : null}
        <BirthDateForm value={birth} onChange={setBirth} yearMin={2015} yearMax={2026} />
        <Text className="label">性别</Text>
        <GenderPicker value={gender} onChange={setGender} />
        <Text className="label">风格偏好（最多3个）</Text>
        <View className="chip-row">
          {STYLES.map((s) => (
            <View key={s} className={`style-chip ${styles.includes(s) ? "active" : ""}`} onClick={() => toggleStyle(s)}>
              <Text>{s}</Text>
            </View>
          ))}
        </View>
        <View className="mt">
          <Button className="btn-primary" disabled={loading} onClick={() => run(false)}>
            {loading && !started ? "生成中…" : mode === "naming" ? "开始起名" : "测评名字"}
          </Button>
        </View>
      </View>

      {started && interpretation ? (
        <View className="card">
          <Paywall
            productId="naming_premium"
            previewContent={interpretation}
            onUnlock={(orderId) => run(true, orderId)}
          >
            <InterpretBlock content={premiumText} loading={loading} />
          </Paywall>
        </View>
      ) : started && loading ? (
        <View className="card">
          <Text className="hero-sub">正在构思名字…</Text>
        </View>
      ) : null}

      {error ? <Text className="error-tip">{error}</Text> : null}
    </View>
  );
}
