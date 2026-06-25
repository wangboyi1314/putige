"use client";

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

interface BirthDateFormProps {
  value: LunarBirthValue;
  onChange: (value: LunarBirthValue) => void;
  yearMin?: number;
  yearMax?: number;
  compact?: boolean;
}

function DateStepper({
  label,
  value,
  set,
  min,
  max,
}: {
  label: string;
  value: number;
  set: (v: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div className="text-center">
      <p className="text-amber-400/50 text-[10px] mb-2">{label}</p>
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => set(Math.max(min, value - 1))}
          className="size-8 rounded-full border border-amber-400/20 text-amber-300/60"
        >
          −
        </button>
        <span className="text-xl font-serif text-amber-100 w-10">{value}</span>
        <button
          type="button"
          onClick={() => set(Math.min(max, value + 1))}
          className="size-8 rounded-full border border-amber-400/20 text-amber-300/60"
        >
          +
        </button>
      </div>
    </div>
  );
}

export function BirthDateForm({
  value,
  onChange,
  yearMin = 1920,
  yearMax = 2025,
  compact = false,
}: BirthDateFormProps) {
  const patch = (partial: Partial<LunarBirthValue>) => onChange({ ...value, ...partial });

  if (compact) {
    return (
      <div className="space-y-3">
        <p className="text-amber-400/50 text-xs">农历生辰（年、月、日、时辰）</p>
        <div className="grid grid-cols-4 gap-2">
          {[
            { l: "农历年", k: "year" as const, min: yearMin, max: yearMax },
            { l: "农历月", k: "month" as const, min: 1, max: 12 },
            { l: "农历日", k: "day" as const, min: 1, max: 30 },
          ].map(({ l, k, min, max }) => (
            <div key={k}>
              <label className="text-[10px] text-amber-400/40">{l}</label>
              <input
                type="number"
                value={value[k]}
                min={min}
                max={max}
                onChange={(e) => patch({ [k]: Number(e.target.value) })}
                className="w-full px-2 py-2 rounded-lg bg-black/40 border border-amber-400/20 text-amber-100 text-center text-sm"
              />
            </div>
          ))}
          <div>
            <label className="text-[10px] text-amber-400/40">时辰</label>
            <select
              value={value.hour}
              onChange={(e) => patch({ hour: Number(e.target.value) })}
              className="w-full px-1 py-2 rounded-lg bg-black/40 border border-amber-400/20 text-amber-100 text-xs"
            >
              {SHI_CHEN.map((sc) => (
                <option key={sc.hour} value={sc.hour}>
                  {sc.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <label className="flex items-center gap-2 text-amber-300/50 text-xs">
          <input
            type="checkbox"
            checked={value.isLeapMonth}
            onChange={(e) => patch({ isLeapMonth: e.target.checked })}
            className="rounded"
          />
          出生在闰月
        </label>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-amber-400/50 text-xs text-center">请填写农历（阴历）生辰</p>
      <div className="grid grid-cols-3 gap-4">
        <DateStepper
          label="农历年"
          value={value.year}
          set={(year) => patch({ year })}
          min={yearMin}
          max={yearMax}
        />
        <DateStepper
          label="农历月"
          value={value.month}
          set={(month) => patch({ month })}
          min={1}
          max={12}
        />
        <DateStepper
          label="农历日"
          value={value.day}
          set={(day) => patch({ day })}
          min={1}
          max={30}
        />
      </div>
      <label className="flex items-center gap-2 text-amber-300/50 text-xs">
        <input
          type="checkbox"
          checked={value.isLeapMonth}
          onChange={(e) => patch({ isLeapMonth: e.target.checked })}
          className="rounded"
        />
        出生在闰月
      </label>
      <div>
        <p className="text-amber-400/50 text-[10px] mb-2">出生时辰（十二时辰）</p>
        <select
          value={value.hour}
          onChange={(e) => patch({ hour: Number(e.target.value) })}
          className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-amber-400/20 text-amber-100"
        >
          {SHI_CHEN.map((sc) => (
            <option key={sc.hour} value={sc.hour}>
              {sc.label}（{sc.range}点）
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
