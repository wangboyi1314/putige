import { View, Text } from "@tarojs/components";
import { MASTERS } from "../config";
import "./MasterPicker.scss";

interface Props {
  value: string;
  onChange: (id: string) => void;
}

export function MasterPicker({ value, onChange }: Props) {
  return (
    <View className="master-picker">
      <Text className="label">选择解签师父</Text>
      <View className="row">
        {MASTERS.map((m) => (
          <View
            key={m.id}
            className={`chip ${value === m.id ? "active" : ""}`}
            onClick={() => onChange(m.id)}
          >
            <Text>{m.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
