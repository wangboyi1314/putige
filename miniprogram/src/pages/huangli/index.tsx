import { View, Text } from "@tarojs/components";
import { getTodayHuangLi, getShiChen } from "../../lib/huangli";
import "./index.scss";

export default function HuangLiPage() {
  const huangli = getTodayHuangLi();
  const shiChen = getShiChen();

  return (
    <View className="container">
      <View className="card date-card">
        <Text className="date-main">{huangli.solarDate}</Text>
        <Text className="date-sub">{huangli.lunarDate}</Text>
        <Text className="date-gz">{huangli.ganZhi}</Text>
        <Text className="date-meta">
          {huangli.shengXiao}年 · {huangli.wuXing} · {huangli.jieQi}
        </Text>
      </View>

      <View className="card">
        <Text className="section-title yi-title">宜</Text>
        <View className="tags">
          {huangli.yi.map((item, i) => (
            <Text key={`yi-${i}`} className="tag-yi">{item}</Text>
          ))}
        </View>
      </View>

      <View className="card">
        <Text className="section-title ji-title">忌</Text>
        <View className="tags">
          {huangli.ji.map((item, i) => (
            <Text key={`ji-${i}`} className="tag-ji">{item}</Text>
          ))}
        </View>
      </View>

      <View className="card meta-grid">
        <Text>冲煞：{huangli.chong}</Text>
        <Text>煞方：{huangli.sha}</Text>
        <Text>喜神：{huangli.xiShen}</Text>
        <Text>福神：{huangli.fuShen}</Text>
        <Text>财神：{huangli.caiShen}</Text>
        <Text>彭祖：{huangli.pengZu}</Text>
      </View>

      <View className="card">
        <Text className="section-title">十二时辰</Text>
        <View className="shichen-grid">
          {shiChen.map((sc) => (
            <View
              key={sc.id}
              className={`shichen-item shichen-${sc.luck}`}
            >
              <Text className="sc-name">{sc.name}时</Text>
              <Text className="sc-gz">{sc.ganZhi}</Text>
              <Text className="sc-time">{sc.time}</Text>
              <Text className={`sc-luck luck-${sc.luck}`}>{sc.luck}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
