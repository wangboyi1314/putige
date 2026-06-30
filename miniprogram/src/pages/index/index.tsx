import { View, Text, Navigator } from "@tarojs/components";
import { SITE, FEATURES } from "../../config";
import "./index.scss";

export default function IndexPage() {
  return (
    <View className="container">
      <Text className="hero-title">{SITE.name}</Text>
      <Text className="hero-sub">{SITE.tagline}</Text>

      <View className="feature-grid">
        {FEATURES.map((f) => (
          <Navigator key={f.id} url={f.path} className="feature-item">
            <View>
              <Text className="feature-title">{f.title}</Text>
              <Text className="feature-desc">{f.desc}</Text>
            </View>
            <Text className="feature-arrow">›</Text>
          </Navigator>
        ))}
      </View>

      <View className="nav-links">
        <Navigator url="/pages/mine/index" className="btn-ghost">
          我的
        </Navigator>
      </View>

      <Text className="disclaimer">{SITE.disclaimer}</Text>
    </View>
  );
}
