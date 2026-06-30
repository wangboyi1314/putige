import { View, Text } from "@tarojs/components";
import "./PageHero.scss";

export function PageHero({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View className="page-hero">
      <Text className="title">{title}</Text>
      {subtitle ? <Text className="subtitle">{subtitle}</Text> : null}
    </View>
  );
}
