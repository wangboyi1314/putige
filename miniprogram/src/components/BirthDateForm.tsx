import { View, Text, Picker } from "@tarojs/components";
import "./BirthDateForm.scss";

export const SHI_CHEN = [
  { label: "子时", range: "23-01", hour: 0 },
  { label: "丑时", range: "01-03", hour: 2 },
  { label: "寅时", range: "03-05", hour: 4 },
  { label: "卯时", range: "05-07", hour: 6 },
  { label: "辰时", range: "07-09", hour: 8 },
  { label: "巳时", range: "09-11", hour: 10 },
  { label: "午时", range: "11-13", hour: 12 },
  { label: "未时", range: "13-15", hour: 14 },
  { label: "申时", range: "15-17", hour: 16 },
  { label: "酉时", range: "17-19", hour: 18 },
  { label: "戌时", range: "19-21", hour: 20 },
  { label: "亥时", range: "21-23", hour: 22 },
] as const;

export interface LunarBirthValue {
  year: number;
  month: number;
  day: number;
  hour: number;
  isLeapMonth: boolean;
}

function Stepper({ label, value, set, min, max }: { label: string; value: number; set: (v: number) => void; min: number; max: number }) {
  return (
    <View className="stepper">
      <Text className="step-label">{label}</Text>
      <View className="step-row">
        <View className="step-btn" onClick={() => set(Math.max(min, value - 1))}><Text>−</Text></View>
        <Text className="step-val">{value}</Text>
        <View className="step-btn" onClick={() => set(Math.min(max, value + 1))}><Text>+</Text></View>
      </View>
    </View>
  );
}

export function BirthDateForm({
  value,
  onChange,
  yearMin = 1920,
  yearMax = 2025,
}: {
  value: LunarBirthValue;
  onChange: (v: LunarBirthValue) => void;
}) {
  const patch = (p: Partial<LunarBirthValue>) => onChange({ ...value, ...p });
  const hourIdx = SHI_CHEN.findIndex((s) => s.hour === value.hour);

  return (
    <View className="birth-form">
      <View className="step-grid">
        <Stepper label="农历年" value={value.year} set={(year) => patch({ year })} min={yearMin} max={yearMax} />
        <Stepper label="农历月" value={value.month} set={(month) => patch({ month })} min={1} max={12} />
        <Stepper label="农历日" value={value.day} set={(day) => patch({ day })} min={1} max={30} />
      </View>
      <View className="leap-row">
        <Text className="label">闰月</Text>
        <View className={`leap-chip ${value.isLeapMonth ? "on" : ""}`} onClick={() => patch({ isLeapMonth: !value.isLeapMonth })}>
          <Text>{value.isLeapMonth ? "是" : "否"}</Text>
        </View>
      </View>
      <View className="hour-row">
        <Text className="label">出生时辰</Text>
        <Picker
          mode="selector"
          range={SHI_CHEN.map((s) => `${s.label}（${s.range}点）`)}
          value={hourIdx >= 0 ? hourIdx : 6}
          onChange={(e) => patch({ hour: SHI_CHEN[Number(e.detail.value)].hour })}
        >
          <View className="picker-val">
            <Text>{SHI_CHEN[hourIdx >= 0 ? hourIdx : 6].label}</Text>
          </View>
        </Picker>
      </View>
    </View>
  );
}

export function GenderPicker({ value, onChange }: { value: "男" | "女"; onChange: (g: "男" | "女") => void }) {
  return (
    <View className="gender-row">
      {(["男", "女"] as const).map((g) => (
        <View key={g} className={`gender-chip ${value === g ? "active" : ""}`} onClick={() => onChange(g)}>
          <Text>{g}</Text>
        </View>
      ))}
    </View>
  );
}
