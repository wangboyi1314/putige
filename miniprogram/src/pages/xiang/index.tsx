import { useState } from "react";
import { View, Text, Button, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { PageHero } from "../../components/PageHero";
import { MasterPicker } from "../../components/MasterPicker";
import { Paywall, InterpretBlock } from "../../components/Paywall";
import { postInterpret } from "../../services/api";
import { saveRecord } from "../../utils/storage";
import "./index.scss";

type XiangType = "palm" | "face";
const FOCUS_AREAS = ["综合", "性情", "感情", "事业", "财运"];

export default function XiangPage() {
  const [masterId, setMasterId] = useState("huiming");
  const [type, setType] = useState<XiangType>("palm");
  const [hand, setHand] = useState<"left" | "right">("left");
  const [focus, setFocus] = useState("综合");
  const [imagePath, setImagePath] = useState("");
  const [imageName, setImageName] = useState("");
  const [interpretation, setInterpretation] = useState("");
  const [premiumText, setPremiumText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function chooseImage() {
    try {
      const res = await Taro.chooseMedia({
        count: 1,
        mediaType: ["image"],
        sourceType: ["album", "camera"],
      });
      const file = res.tempFiles[0];
      if (file) {
        setImagePath(file.tempFilePath);
        setImageName(file.tempFilePath.split("/").pop() || "photo.jpg");
        setInterpretation("");
        setPremiumText("");
      }
    } catch {
      /* cancelled */
    }
  }

  async function analyze(isPremium: boolean, orderId?: string) {
    if (!imageName) {
      setError("请先上传照片");
      return;
    }

    if (!isPremium) {
      setPremiumText("");
      saveRecord({
        type: "xiang",
        title: type === "palm" ? "手相分析" : "面相分析",
        summary: focus,
      });
    }

    setLoading(true);
    setError("");
    const res = await postInterpret({
      type: "xiang",
      question: `重点看${focus}`,
      isPremium,
      orderId,
      masterId,
      data: {
        type: type === "palm" ? "手相" : "面相",
        hand: type === "palm" ? (hand === "left" ? "左手（先天）" : "右手（后天）") : undefined,
        focus,
        imageName,
        note: type === "palm"
          ? "上传清晰掌心照，先看掌色、掌丘与主线走势。"
          : "把额头、眉眼、鼻口、下庭等可见特征分段分析。",
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
      <PageHero title="掌纹面相" subtitle="上传照片 · 预览解读 · 解锁详批" />

      <View className="card">
        <MasterPicker value={masterId} onChange={setMasterId} />
        <View className="chip-row">
          <View className={`chip ${type === "palm" ? "active" : ""}`} onClick={() => setType("palm")}>
            <Text>手相</Text>
          </View>
          <View className={`chip ${type === "face" ? "active" : ""}`} onClick={() => setType("face")}>
            <Text>面相</Text>
          </View>
        </View>
        {type === "palm" ? (
          <>
            <Text className="label">哪只手</Text>
            <View className="chip-row">
              <View className={`chip ${hand === "left" ? "active" : ""}`} onClick={() => setHand("left")}>
                <Text>左手（先天）</Text>
              </View>
              <View className={`chip ${hand === "right" ? "active" : ""}`} onClick={() => setHand("right")}>
                <Text>右手（后天）</Text>
              </View>
            </View>
          </>
        ) : null}
        <Text className="label">分析侧重</Text>
        <View className="chip-row">
          {FOCUS_AREAS.map((f) => (
            <View key={f} className={`chip ${focus === f ? "active" : ""}`} onClick={() => setFocus(f)}>
              <Text>{f}</Text>
            </View>
          ))}
        </View>
        <View className="mt">
          <Button className="btn-ghost" onClick={chooseImage}>
            {imagePath ? "重新选择照片" : "选择照片"}
          </Button>
        </View>
        {imagePath ? (
          <>
            <Image className="preview-img" src={imagePath} mode="aspectFit" />
            <Text className="img-name">{imageName}</Text>
          </>
        ) : null}
        <View className="mt">
          <Button className="btn-primary" disabled={loading || !imagePath} onClick={() => analyze(false)}>
            {loading && !interpretation ? "分析中…" : "开始分析"}
          </Button>
        </View>
      </View>

      {interpretation ? (
        <View className="card">
          <Paywall
            productId="xiang_premium"
            previewContent={interpretation}
            onUnlock={(orderId) => analyze(true, orderId)}
          >
            <InterpretBlock content={premiumText} loading={loading} />
          </Paywall>
        </View>
      ) : null}

      {error ? <Text className="error-tip">{error}</Text> : null}
    </View>
  );
}
